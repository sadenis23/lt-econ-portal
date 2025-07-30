import Link from 'next/link';
import { Report } from '../../hooks/useReports';
import SourceBadge from '../atoms/SourceBadge';

export default function ReportCard({ report }: { report: Report }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <article 
      className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
      role="listitem"
    >
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={report.coverUrl || '/api/placeholder/400/250'}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 mb-2">
            {report.title}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-3 mb-3">
            {report.abstract}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <time dateTime={report.date}>
            {formatDate(report.date)}
          </time>
          <div className="flex gap-1">
            {report.topics.slice(0, 2).map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800"
              >
                {topic}
              </span>
            ))}
            {report.topics.length > 2 && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                +{report.topics.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Data Sources */}
        {report.sources && report.sources.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap">
              {report.sources.map((src) => (
                <SourceBadge key={src.id} src={src} />
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Link
          href={report.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          aria-label={`View PDF for ${report.title}`}
        >
          View PDF
        </Link>
      </div>
    </article>
  );
} 