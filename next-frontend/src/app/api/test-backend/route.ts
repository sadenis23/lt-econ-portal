import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    console.log('Testing backend connection to:', apiUrl);
    
    const response = await fetch(`${apiUrl}/test`);
    const data = await response.json();
    
    console.log('Backend test response:', data);
    
    return NextResponse.json({
      success: true,
      backendResponse: data,
      apiUrl: apiUrl
    });
  } catch (error) {
    console.error('Backend test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    }, { status: 500 });
  }
} 