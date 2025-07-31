import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, remember_me } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Forward request to backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, remember_me }),
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
        { error: data.detail || 'Login failed' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 