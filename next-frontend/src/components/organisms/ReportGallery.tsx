'use client';

import { useState } from 'react';
import { useReports, UseReportFilters } from '../../hooks/useReports';
import ReportFilters from '../molecules/ReportFilters';
import ReportCard from '../molecules/ReportCard';

export default function ReportGallery() {
  const [filters, setFilters] = useState<UseReportFilters>({
    search: '',
    topics: [],
    sources: [],
    from: null,
    to: null
  });

  const { data: reports, error, isLoading } = useReports(filters);

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-2">Failed to load reports</p>
          <p className="text-sm text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Economic Reports
        </h1>
        <p className="text-slate-600">
          Browse and filter through our comprehensive collection of economic reports
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ReportFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Reports Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl bg-white shadow-sm"
                >
                  <div className="h-48 bg-gray-200 rounded-t-2xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-8 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : reports && reports.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-sm text-slate-600">
                  Showing {reports.length} report{reports.length !== 1 ? 's' : ''}
                  {filters.topics.length > 0 && ` in ${filters.topics.join(', ')}`}
                  {filters.sources.length > 0 && ` from ${filters.sources.join(', ')}`}
                </p>
              </div>
              
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                role="list"
                aria-label="Economic reports grid"
              >
                {reports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-lg text-slate-600 mb-2">No reports found</p>
                <p className="text-sm text-slate-500">
                  Try adjusting your filters
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 