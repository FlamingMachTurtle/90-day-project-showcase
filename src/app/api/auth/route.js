'use server';

import { cookies } from 'next/headers';

export async function POST(request) {
  const { password, bypass } = await request.json();
  
  // BYPASS_FEATURE: Handle bypass requests
  // Remove this entire if block to disable bypass functionality
  if (bypass === true) {
    // Set HTTP-only cookie that expires in 24 hours
    const cookieStore = await cookies();
    await cookieStore.set('auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    
    return Response.json({ success: true });
  }
  
  if (password === 'elig') {
    // Set HTTP-only cookie that expires in 24 hours
    const cookieStore = await cookies();
    await cookieStore.set('auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    
    return Response.json({ success: true });
  }
  
  return Response.json({ success: false });
}

export async function DELETE() {
  const cookieStore = await cookies();
  await cookieStore.delete('auth');
  return Response.json({ success: true });
}

export async function GET() {
  const cookieStore = await cookies();
  const isAuthenticated = (await cookieStore.get('auth'))?.value === 'true';
  return Response.json({ isAuthenticated });
} 