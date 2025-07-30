import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }

    // Clear any client-side cookies or state
    const responseHeaders = new Headers();
    responseHeaders.set('Set-Cookie', 'refresh_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
    
    return new NextResponse(null, { 
      status: 204,
      headers: responseHeaders
    });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 