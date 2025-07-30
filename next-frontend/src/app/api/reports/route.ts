import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    // Build query string from search params
    const queryParams = new URLSearchParams();
    
    if (searchParams.get('search')) {
      queryParams.append('search', searchParams.get('search')!);
    }
    
    if (searchParams.get('topics')) {
      queryParams.append('topics', searchParams.get('topics')!);
    }
    
    if (searchParams.get('from')) {
      queryParams.append('from', searchParams.get('from')!);
    }
    
    if (searchParams.get('to')) {
      queryParams.append('to', searchParams.get('to')!);
    }

    const queryString = queryParams.toString();
    const url = `${apiUrl}/reports${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch reports' }, { status: response.status });
    }

    const data = await response.json();
    
    // Transform the data to match the expected Report interface
    const transformedData = data.map((report: { id: string; title: string; content?: string; date: string; topics?: string[]; coverUrl?: string; pdfUrl?: string; sources?: any[] }) => ({
      id: report.id,
      title: report.title,
      date: report.date,
      abstract: (report.content?.slice(0, 200) || '') + (report.content && report.content.length > 200 ? '...' : ''),
      topics: report.topics || ['Economy'], // Default topic if none provided
      coverUrl: report.coverUrl || `/api/placeholder/400/250?text=${encodeURIComponent(report.title)}`,
      pdfUrl: report.pdfUrl || `/reports/${report.id}`,
      sources: report.sources || [] // Support for data sources
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 