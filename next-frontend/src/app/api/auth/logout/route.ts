import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Forward request to backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/users/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '', // Forward cookies
      },
    });

    const data = await response.json();

    if (response.ok) {
      // Create response and clear cookies
      const nextResponse = NextResponse.json(data, { status: 200 });
      
      // Clear authentication cookies
      nextResponse.cookies.delete('access_token');
      nextResponse.cookies.delete('refresh_token');
      
      // Copy any additional cookies from backend response
      const setCookieHeaders = response.headers.getSetCookie();
      setCookieHeaders.forEach(cookie => {
        nextResponse.headers.append('Set-Cookie', cookie);
      });

      return nextResponse;
    } else {
      return NextResponse.json(
        { error: data.detail || 'Logout failed' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 