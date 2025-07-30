import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token');

    if (!refreshToken) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    // Try to refresh the access token
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const refreshResponse = await fetch(`${apiUrl}/users/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken.value }),
    });

    if (!refreshResponse.ok) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const { access_token } = await refreshResponse.json();

    // Fetch profile data from backend
    const profileResponse = await fetch(`${apiUrl}/profiles/me`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (profileResponse.status === 404) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (!profileResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    const profileData = await profileResponse.json();
    
    // Set cache headers to prevent stale data
    const response = NextResponse.json(profileData);
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 