import { NextResponse } from 'next/server';
import { verifyPassword, createSession } from '@/lib/auth.js';
import { isRateLimited, recordFailedAttempt, recordSuccessfulLogin } from '@/lib/rate-limit.js';

export async function POST(request) {
  try {
    // Check rate limiting first
    const rateLimitCheck = isRateLimited(request);
    
    if (rateLimitCheck.limited) {
      console.log(`🚫 Rate limited login attempt: ${rateLimitCheck.message}`);
      return NextResponse.json(
        { 
          error: rateLimitCheck.message,
          attempts: rateLimitCheck.attempts,
          remainingTime: rateLimitCheck.remainingTime
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password);

    if (!isValid) {
      // Record failed attempt
      const failureData = recordFailedAttempt(request);
      
      console.log(`❌ Failed login attempt #${failureData.attempts}`);
      
      return NextResponse.json(
        { 
          error: 'Invalid password',
          attempts: failureData.attempts,
          cooldown: failureData.cooldown
        },
        { status: 401 }
      );
    }

    // Password is correct - create session
    await createSession();
    
    // Record successful login (clears rate limiting)
    recordSuccessfulLogin(request);
    
    console.log('✅ Successful authentication');
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Authentication successful'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Authentication API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle logout
export async function DELETE(request) {
  try {
    const { destroySession } = await import('@/lib/auth.js');
    await destroySession();
    
    console.log('👋 User logged out');
    
    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

// Handle clearing all session data (for debugging)
export async function GET(request) {
  try {
    const { destroySession } = await import('@/lib/auth.js');
    await destroySession();
    
    console.log('🧹 All session data cleared');
    
    return NextResponse.json(
      { success: true, message: 'All session data cleared' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Clear session error:', error);
    return NextResponse.json(
      { error: 'Clear session failed' },
      { status: 500 }
    );
  }
} 