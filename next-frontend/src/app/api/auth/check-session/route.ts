import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    console.log('Session check - Starting...');
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token');
    
    console.log('Session check - Refresh token found:', !!refreshToken);
    
    if (!refreshToken) {
      console.log('Session check - No refresh token found');
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }
    
    // Try to refresh the access token
    console.log('Session check - Attempting to refresh token...');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const refreshResponse = await fetch(`${apiUrl}/users/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken.value }),
    });
    
    console.log('Session check - Refresh response status:', refreshResponse.status);
    
    if (!refreshResponse.ok) {
      console.log('Session check - Refresh failed, clearing token');
      // Clear invalid refresh token
      const response = NextResponse.json({ error: 'Invalid session' }, { status: 401 });
      response.cookies.delete('refresh_token');
      return response;
    }
    
    const data = await refreshResponse.json();
    
    // Decode the access token to get user info
    const tokenPayload = JSON.parse(atob(data.access_token.split('.')[1]));
    
    return NextResponse.json({
      access_token: data.access_token,
      user: { username: tokenPayload.sub, email: '' },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 