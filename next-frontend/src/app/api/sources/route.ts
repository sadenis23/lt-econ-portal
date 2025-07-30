/**
 * API route for fetching available data sources
 * Returns list of data sources for filtering in the Report Gallery
 */
import { NextRequest, NextResponse } from 'next/server';

// Mock data sources - in production this would come from the backend
const MOCK_SOURCES = [
  {
    id: 'LB',
    name: 'Bank of Lithuania',
    url: 'https://www.lb.lt/en/statistics'
  },
  {
    id: 'StataLT',
    name: 'Statistics Lithuania',
    url: 'https://osp.stat.gov.lt/en'
  },
  {
    id: 'Eurostat',
    name: 'European Statistics',
    url: 'https://ec.europa.eu/eurostat'
  },
  {
    id: 'OECD',
    name: 'Organisation for Economic Co-operation and Development',
    url: 'https://data.oecd.org'
  },
  {
    id: 'IMF',
    name: 'International Monetary Fund',
    url: 'https://data.imf.org'
  },
  {
    id: 'WorldBank',
    name: 'World Bank',
    url: 'https://data.worldbank.org'
  }
];

export async function GET(request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    // Try to fetch from backend first
    const response = await fetch(`${apiUrl}/sources`, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    // Fallback to mock data if backend doesn't have the endpoint yet
    return NextResponse.json(MOCK_SOURCES);
  } catch (error) {
    console.error('Error fetching sources:', error);
    // Return mock data as fallback
    return NextResponse.json(MOCK_SOURCES);
  }
} 