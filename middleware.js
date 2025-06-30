import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('🔥 MIDDLEWARE EXECUTED:', request.nextUrl.pathname);
  return;
}

export const config = {
  matcher: ['/((?!_next).*)'],
}; 