import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PATCH(request: NextRequest) {
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

    // Get the profile data from request body
    const profileData = await request.json();

    // Update profile data from backend
    const profileResponse = await fetch(`${apiUrl}/profiles/me`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!profileResponse.ok) {
      const errorData = await profileResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to update profile', details: errorData },
        { status: profileResponse.status }
      );
    }

    const result = await profileResponse.json();
    
    // Set cache headers to prevent stale data
    const response = NextResponse.json(result);
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 