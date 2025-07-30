import React from 'react';
import Link from 'next/link';

async function fetchReport(id: string) {
  const res = await fetch(`http://localhost:8000/reports/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch report');
  return res.json();
}

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  let report: { id: string; title: string; content: string; date: string } | null = null;
  try {
    report = await fetchReport(params.id);
  } catch {
    return <div className="max-w-2xl mx-auto py-16 text-center text-red-500">Report not found.</div>;
  }

  if (!report) {
    return <div className="max-w-2xl mx-auto py-16 text-center text-red-500">Report not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 pb-16">
      <div className="max-w-2xl mx-auto px-4 py-16 bg-white shadow rounded-2xl border border-green-100">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-green-700 flex items-center gap-2">
          <Link href="/reports" className="hover:underline">Reports</Link>
          <span className="mx-1">/</span>
          <span className="font-semibold">{report.title}</span>
        </div>
        {/* Back button */}
        <div className="mb-4">
          <Link href="/reports" className="inline-block px-4 py-2 rounded bg-green-100 text-green-800 font-semibold hover:bg-green-200 transition">&larr; Back to Reports</Link>
        </div>
        <h1 className="text-4xl font-extrabold mb-4 text-green-800 text-center drop-shadow-lg">{report.title}</h1>
        <div className="text-gray-500 mb-6 text-center">{report.date}</div>
        <div className="text-lg text-gray-700 whitespace-pre-line mb-8">{report.content}</div>
        {/* Edit/Delete buttons (UI only) */}
        <div className="flex justify-end gap-4">
          <button className="px-4 py-2 rounded bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 transition">Edit</button>
          <button className="px-4 py-2 rounded bg-red-100 text-red-800 font-semibold hover:bg-red-200 transition">Delete</button>
        </div>
      </div>
    </div>
  );
} 