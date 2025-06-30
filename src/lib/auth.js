import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: 'auth-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 24 hours
  }
};

// Get session from cookies
export async function getSession() {
  const cookieStore = cookies();
  const session = await getIronSession(await cookieStore, sessionOptions);
  return session;
}

// Create a new authenticated session
export async function createSession() {
  const session = await getSession();
  session.isAuthenticated = true;
  session.loginTime = Date.now();
  await session.save();
  return session;
}

// Destroy the current session
export async function destroySession() {
  const session = await getSession();
  await session.destroy();
}

// Check if session is valid and not expired (for app routes)
export async function checkSession() {
  const session = await getSession();
  if (!session?.isAuthenticated) {
    return false;
  }
  
  // Check if session is expired (24 hours)
  const now = Date.now();
  const loginTime = session.loginTime || 0;
  if (now - loginTime > 24 * 60 * 60 * 1000) {
    await destroySession();
    return false;
  }
  
  return true;
} 