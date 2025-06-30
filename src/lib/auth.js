import bcrypt from 'bcryptjs';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

// Session configuration
const sessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieName: 'auth-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_TIMEOUT) || 86400000, // 24 hours default
  },
};

// Get session from cookies
export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);
  return session;
}

// Verify password against environment variable
export async function verifyPassword(inputPassword) {
  const storedPassword = process.env.AUTH_PASSWORD;
  
  if (!storedPassword) {
    console.error('AUTH_PASSWORD not set in environment variables');
    return false;
  }

  // For simple comparison, we'll hash the env password once and compare
  // In production, you'd store the hashed password in env
  const hashedInput = await bcrypt.hash(inputPassword, 12);
  const hashedStored = await bcrypt.hash(storedPassword, 12);
  
  // Direct comparison for simplicity (you can enhance this)
  return inputPassword === storedPassword;
}

// Create authenticated session
export async function createSession() {
  const session = await getSession();
  session.isAuthenticated = true;
  session.loginTime = Date.now();
  await session.save();
  return session;
}

// Destroy session
export async function destroySession() {
  const session = await getSession();
  session.destroy();
}

// Check if session is valid and not expired (for app routes)
export async function isAuthenticated() {
  try {
    const session = await getSession();
    
    if (!session.isAuthenticated) {
      return false;
    }

    // Check if session has expired
    const now = Date.now();
    const loginTime = session.loginTime || 0;
    const timeout = parseInt(process.env.SESSION_TIMEOUT) || 86400000;
    
    if (now - loginTime > timeout) {
      await destroySession();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}

// Check if session is valid (for middleware - uses request object)
export async function isAuthenticatedMiddleware(request) {
  try {
    console.log('🔍 Starting middleware authentication check...');
    
    // Check if session cookie exists
    const sessionCookie = request.cookies.get('auth-session');
    console.log('🍪 Session cookie exists:', !!sessionCookie);
    
    if (!sessionCookie) {
      console.log('❌ No session cookie found - user not authenticated');
      return false;
    }

    const { getIronSession } = await import('iron-session');
    
    // Get session from request cookies (middleware context)
    const session = await getIronSession(request.cookies, sessionOptions);
    console.log('📦 Session data:', { 
      isAuthenticated: session.isAuthenticated, 
      loginTime: session.loginTime 
    });
    
    if (!session.isAuthenticated) {
      console.log('❌ Session exists but isAuthenticated is false');
      return false;
    }

    // Check if session has expired
    const now = Date.now();
    const loginTime = session.loginTime || 0;
    const timeout = parseInt(process.env.SESSION_TIMEOUT) || 86400000;
    
    if (now - loginTime > timeout) {
      console.log('⏰ Session expired');
      return false;
    }

    console.log('✅ Session is valid and authenticated');
    return true;
  } catch (error) {
    console.error('❌ Middleware session validation error:', error);
    return false;
  }
} 