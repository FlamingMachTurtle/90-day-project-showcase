'use server';

import { cookies } from 'next/headers';

export async function POST(request) {
  const { password } = await request.json();
  
  if (password === 'elig') {
    // Set HTTP-only cookie that expires in 24 hours
    cookies().set('auth', 'true', {
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
  cookies().delete('auth');
  return Response.json({ success: true });
}

export async function GET() {
  const isAuthenticated = cookies().get('auth')?.value === 'true';
  return Response.json({ isAuthenticated });
} 