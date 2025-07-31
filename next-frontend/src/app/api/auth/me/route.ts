import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Forward request to backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/users/me`, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '', // Forward cookies
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    } else {
      // Return 401 for authentication errors
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Me API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 