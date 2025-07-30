import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { refresh_token } = await request.json();
    
    if (!refresh_token) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
    }
    
    // Set refresh token in httpOnly cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Error setting refresh token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 