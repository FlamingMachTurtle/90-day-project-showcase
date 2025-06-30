// In-memory rate limiting (for production, consider Redis or database)
const attemptStore = new Map();

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  // Progressive penalty structure
  penalties: [
    { attempts: 3, cooldown: 0 },           // 1-3 attempts: no penalty
    { attempts: 5, cooldown: 5 * 60 * 1000 },   // 4-5 attempts: 5 minutes
    { attempts: 8, cooldown: 30 * 60 * 1000 },  // 6-8 attempts: 30 minutes
    { attempts: 10, cooldown: 2 * 60 * 60 * 1000 }, // 9-10 attempts: 2 hours
    { attempts: Infinity, cooldown: 24 * 60 * 60 * 1000 } // 11+ attempts: 24 hours
  ],
  
  // Clean up old entries after this time
  cleanupInterval: 24 * 60 * 60 * 1000, // 24 hours
};

// Get client identifier (IP address)
function getClientId(request) {
  // Try to get real IP behind proxies
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  return forwarded?.split(',')[0] || realIp || 'unknown';
}

// Get current attempt data for client
function getAttemptData(clientId) {
  const data = attemptStore.get(clientId);
  const now = Date.now();
  
  if (!data) {
    return { attempts: 0, lastAttempt: now, cooldownUntil: 0 };
  }
  
  // Clean up old attempts (reset after 24 hours of no activity)
  if (now - data.lastAttempt > RATE_LIMIT_CONFIG.cleanupInterval) {
    attemptStore.delete(clientId);
    return { attempts: 0, lastAttempt: now, cooldownUntil: 0 };
  }
  
  return data;
}

// Calculate cooldown period based on attempt count
function calculateCooldown(attempts) {
  for (const penalty of RATE_LIMIT_CONFIG.penalties) {
    if (attempts <= penalty.attempts) {
      return penalty.cooldown;
    }
  }
  return RATE_LIMIT_CONFIG.penalties[RATE_LIMIT_CONFIG.penalties.length - 1].cooldown;
}

// Check if client is currently rate limited
export function isRateLimited(request) {
  const clientId = getClientId(request);
  const data = getAttemptData(clientId);
  const now = Date.now();
  
  // Check if still in cooldown period
  if (data.cooldownUntil > now) {
    const remainingTime = data.cooldownUntil - now;
    return {
      limited: true,
      remainingTime,
      attempts: data.attempts,
      message: `Too many failed attempts. Try again in ${Math.ceil(remainingTime / 1000 / 60)} minutes.`
    };
  }
  
  return { limited: false, attempts: data.attempts };
}

// Record a failed login attempt
export function recordFailedAttempt(request) {
  const clientId = getClientId(request);
  const data = getAttemptData(clientId);
  const now = Date.now();
  
  // Increment attempts
  data.attempts += 1;
  data.lastAttempt = now;
  
  // Calculate new cooldown
  const cooldown = calculateCooldown(data.attempts);
  data.cooldownUntil = now + cooldown;
  
  // Store updated data
  attemptStore.set(clientId, data);
  
  return {
    attempts: data.attempts,
    cooldownUntil: data.cooldownUntil,
    cooldown: cooldown
  };
}

// Record successful login (reset attempts)
export function recordSuccessfulLogin(request) {
  const clientId = getClientId(request);
  attemptStore.delete(clientId);
}

// Get rate limit status for client
export function getRateLimitStatus(request) {
  const clientId = getClientId(request);
  const data = getAttemptData(clientId);
  const now = Date.now();
  
  return {
    clientId: clientId.substring(0, 8) + '***', // Partial IP for logging
    attempts: data.attempts,
    isInCooldown: data.cooldownUntil > now,
    cooldownRemaining: Math.max(0, data.cooldownUntil - now),
    lastAttempt: data.lastAttempt
  };
}

// Cleanup old entries (call periodically)
export function cleanupOldEntries() {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_CONFIG.cleanupInterval;
  
  for (const [clientId, data] of attemptStore.entries()) {
    if (data.lastAttempt < cutoff) {
      attemptStore.delete(clientId);
    }
  }
}

// Get current rate limit stats (for debugging)
export function getRateLimitStats() {
  return {
    totalClients: attemptStore.size,
    clients: Array.from(attemptStore.entries()).map(([id, data]) => ({
      id: id.substring(0, 8) + '***',
      attempts: data.attempts,
      lastAttempt: new Date(data.lastAttempt).toISOString(),
      cooldownUntil: data.cooldownUntil > Date.now() ? new Date(data.cooldownUntil).toISOString() : null
    }))
  };
} 