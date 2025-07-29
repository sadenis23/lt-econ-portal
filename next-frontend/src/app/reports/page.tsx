import React from 'react';
import Link from 'next/link';

// Example Lithuanian KPIs (static for now, could be fetched from backend in future)
const KPIS = [
  { label: 'GDP (2023)', value: '66.7', unit: 'Billion EUR' },
  { label: 'Inflation (2023)', value: '2.5', unit: '% YoY' },
  { label: 'Unemployment (2023)', value: '6.8', unit: '%' },
];

// Example chart data (Lithuanian GDP growth, 2018-2023)
const chartData = [
  { name: '2018', value: 46.2 },
  { name: '2019', value: 48.8 },
  { name: '2020', value: 49.6 },
  { name: '2021', value: 56.2 },
  { name: '2022', value: 66.0 },
  { name: '2023', value: 66.7 },
];

async function fetchReports() {
  const res = await fetch('http://localhost:8000/reports', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch reports');
  return res.json();
}

export default async function ReportsPage() {
  let reports: any[] = [];
  try {
    reports = await fetchReports();
  } catch (e) {
    // ignore for now
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 pb-16">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-5xl font-extrabold mb-12 text-green-800 text-center tracking-tight drop-shadow-lg">Economic Reports</h2>
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {KPIS.map((kpi) => (
            <div key={kpi.label} className="bg-white shadow rounded-2xl p-8 text-center border border-green-100">
              <div className="text-3xl font-bold text-green-700 mb-2">{kpi.label}</div>
              <div className="text-5xl font-extrabold mb-1">{kpi.value}</div>
              <div className="text-gray-500">{kpi.unit}</div>
            </div>
          ))}
        </div>
        {/* Impactful Chart (placeholder) */}
        <div className="mb-16">
          <div className="bg-white shadow rounded-2xl p-8 text-center border border-green-100">
            <div className="text-2xl font-bold text-green-700 mb-4">Lithuania GDP Growth (Billion EUR)</div>
            <div className="flex items-end h-48 space-x-4 justify-center">
              {chartData.map((d) => (
                <div key={d.name} className="flex flex-col items-center">
                  <div className="bg-green-400 w-8" style={{ height: `${d.value * 4}px` }}></div>
                  <div className="text-xs mt-2">{d.name}</div>
                  <div className="text-xs text-green-700">{d.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Reports List */}
        <h3 className="text-3xl font-bold mb-6 text-green-700">Latest Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reports && reports.length > 0 ? (
            reports.map((report) => (
              <Link key={report.id} href={`/reports/${report.id}`} className="bg-white shadow rounded-2xl p-8 border border-green-100 hover:shadow-lg hover:border-green-300 transition cursor-pointer block">
                <div className="text-xl font-bold text-green-800 mb-2">{report.title}</div>
                <div className="text-gray-500 mb-2">{report.date}</div>
                <div className="text-gray-700 mb-4">{report.content.slice(0, 200)}{report.content.length > 200 ? '...' : ''}</div>
              </Link>
            ))
          ) : (
            <div className="bg-white shadow rounded-2xl p-8 text-center text-gray-500 col-span-full">No reports yet.</div>
          )}
        </div>
      </div>
    </div>
  );
} 