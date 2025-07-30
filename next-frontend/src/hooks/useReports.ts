import useSWR from 'swr';
import qs from 'qs';
import { DataSource } from './useSources';

export interface Report {
  id: string;
  title: string;
  date: string;        // ISO
  abstract: string;
  topics: string[];    // e.g. ['Economy', 'Finance']
  coverUrl: string;    // 400×250
  pdfUrl: string;
  sources: DataSource[]; // Data sources for this report
}

export interface UseReportFilters {
  search: string;
  topics: string[];
  sources: string[];     // Data source IDs
  from: string | null;   // yyyy-mm-dd
  to: string | null;
}

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then((r) => {
    if (!r.ok) throw new Error('Network error');
    return r.json();
  });

export function useReports(filters: UseReportFilters) {
  const query = qs.stringify(filters, { arrayFormat: 'comma', skipNulls: true });
  return useSWR<Report[]>(`/api/reports?${query}`, fetcher);
} 