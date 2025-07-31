import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Forward request to backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/users/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '', // Forward cookies
      },
    });

    const data = await response.json();

    if (response.ok) {
      // Create response with cookies from backend
      const nextResponse = NextResponse.json(data, { status: 200 });
      
      // Copy cookies from backend response
      const setCookieHeaders = response.headers.getSetCookie();
      setCookieHeaders.forEach(cookie => {
        nextResponse.headers.append('Set-Cookie', cookie);
      });

      return nextResponse;
    } else {
      return NextResponse.json(
        { error: data.detail || 'Token refresh failed' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Refresh token API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 