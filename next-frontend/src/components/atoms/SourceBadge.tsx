/**
 * SourceBadge component for displaying data source information
 * Shows source ID with tooltip on hover/focus, opens source URL in new tab on click
 */
'use client';

import { useState } from 'react';
import { DataSource } from '../../hooks/useSources';

export default function SourceBadge({ src }: { src: DataSource }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <a
        href={src.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mr-1 mb-1 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-colors"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label={`Open ${src.name} in new tab`}
      >
        {src.id}
      </a>

      {showTooltip && (
        <div className="absolute z-50 mt-1 -ml-2 rounded-lg bg-gray-900 px-2 py-1 text-xs text-white shadow-lg">
          <div className="relative">
            {src.name} ↗
            {/* Tooltip arrow */}
            <div className="absolute -top-1 left-3 w-2 h-2 bg-gray-900 transform rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
} 