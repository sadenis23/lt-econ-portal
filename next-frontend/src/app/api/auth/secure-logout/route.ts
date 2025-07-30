import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const csrfToken = cookieStore.get('csrf_token');
    const refreshToken = cookieStore.get('refresh_token');

    // Get CSRF token from request body
    const body = await request.json();
    const { csrfToken: bodyCsrfToken } = body;

    // Validate CSRF token
    if (!csrfToken || !bodyCsrfToken || csrfToken.value !== bodyCsrfToken) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    // Clear all authentication cookies
    const response = NextResponse.json({ success: true });
    response.cookies.delete('refresh_token');
    response.cookies.delete('csrf_token');

    return response;
  } catch (error) {
    console.error('Secure logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 