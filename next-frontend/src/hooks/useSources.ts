/**
 * Hook for fetching available data sources
 * Supports multi-source filtering in the Report Gallery
 */
import useSWR from 'swr';

export type DataSource = { 
  id: string; 
  name: string; 
  url: string; 
};

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then((r) => {
    if (!r.ok) throw new Error('Network error');
    return r.json();
  });

export function useSources() {
  return useSWR<DataSource[]>('/api/sources', fetcher);
} 