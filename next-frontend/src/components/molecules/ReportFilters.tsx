'use client';

import { useState, useEffect } from 'react';
import { Disclosure, Transition, Combobox } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { UseReportFilters } from '../../hooks/useReports';
import { useSources } from '../../hooks/useSources';

const TOPIC_OPTIONS = [
  'Economy',
  'Labour',
  'Prices',
  'Finance',
  'Social'
];

interface ReportFiltersProps {
  filters: UseReportFilters;
  onFiltersChange: (filters: UseReportFilters) => void;
}

export default function ReportFilters({ filters, onFiltersChange }: ReportFiltersProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(filters.topics);
  const [selectedSources, setSelectedSources] = useState<string[]>(filters.sources || []);
  const [dateFrom, setDateFrom] = useState(filters.from || '');
  const [dateTo, setDateTo] = useState(filters.to || '');
  const { data: sources = [] } = useSources();

  // Immediate updates for filters
  useEffect(() => {
    onFiltersChange({
      ...filters,
      topics: selectedTopics,
      sources: selectedSources,
      from: dateFrom || null,
      to: dateTo || null
    });
  }, [selectedTopics, selectedSources, dateFrom, dateTo, onFiltersChange]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const clearFilters = () => {
    setSelectedTopics([]);
    setSelectedSources([]);
    setDateFrom('');
    setDateTo('');
    onFiltersChange({
      search: '',
      topics: [],
      sources: [],
      from: null,
      to: null
    });
  };

  const hasActiveFilters = Boolean(selectedTopics.length > 0 || selectedSources.length > 0 || dateFrom || dateTo);

  return (
    <div className="space-y-6">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-white px-4 py-3 text-left text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                <span>Filters</span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    open ? 'rotate-180' : ''
                  }`}
                />
              </Disclosure.Button>
              <Transition
                as="div"
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="mt-2 rounded-lg bg-white p-4 shadow-sm">
                  <FilterContent
                    selectedTopics={selectedTopics}
                    toggleTopic={toggleTopic}
                    selectedSources={selectedSources}
                    setSelectedSources={setSelectedSources}
                    sources={sources}
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    dateTo={dateTo}
                    setDateTo={setDateTo}
                    clearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                  />
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24 rounded-lg bg-white p-6 shadow-sm">
          <FilterContent
            selectedTopics={selectedTopics}
            toggleTopic={toggleTopic}
            selectedSources={selectedSources}
            setSelectedSources={setSelectedSources}
            sources={sources}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            clearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </div>
    </div>
  );
}

interface FilterContentProps {
  selectedTopics: string[];
  toggleTopic: (topic: string) => void;
  selectedSources: string[];
  setSelectedSources: (sources: string[]) => void;
  sources: { id: string; name: string; url: string }[];
  dateFrom: string;
  setDateFrom: (date: string) => void;
  dateTo: string;
  setDateTo: (date: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

function FilterContent({
  selectedTopics,
  toggleTopic,
  selectedSources,
  setSelectedSources,
  sources,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  clearFilters,
  hasActiveFilters
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Filters</h3>
        
        {/* Date Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="date-from" className="sr-only">From date</label>
              <input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                aria-label="Filter from date"
              />
            </div>
            <div>
              <label htmlFor="date-to" className="sr-only">To date</label>
              <input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                aria-label="Filter to date"
              />
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Topics
          </label>
          <div className="space-y-2">
            {TOPIC_OPTIONS.map((topic) => (
              <label key={topic} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic)}
                  onChange={() => toggleTopic(topic)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-slate-700">{topic}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Data Sources
          </label>
          <Combobox value={selectedSources} onChange={setSelectedSources} multiple>
            <div className="relative">
              <div className="relative w-full cursor-default overflow-hidden rounded-lg border border-gray-300 bg-white text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                <Combobox.Input
                  className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                  placeholder="Select data sources..."
                  displayValue={(selectedIds: string[]) => 
                    selectedIds.map(id => sources.find(s => s.id === id)?.name || id).join(', ')
                  }
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </Combobox.Button>
              </div>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {sources.map((source) => (
                    <Combobox.Option
                      key={source.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-emerald-600 text-white' : 'text-gray-900'
                        }`
                      }
                      value={source.id}
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {source.name} ({source.id})
                          </span>
                          {selected ? (
                            <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-emerald-600'
                            }`}>
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
          
          {/* Selected sources chips */}
          {selectedSources.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedSources.map((sourceId) => {
                const source = sources.find(s => s.id === sourceId);
                return (
                  <span
                    key={sourceId}
                    className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800"
                  >
                    {source?.name || sourceId}
                    <button
                      type="button"
                      onClick={() => setSelectedSources(selectedSources.filter(id => id !== sourceId))}
                      className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-emerald-400 hover:bg-emerald-200 hover:text-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <span className="sr-only">Remove {source?.name || sourceId}</span>
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            aria-label="Clear all filters"
          >
            <XMarkIcon className="h-4 w-4" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
} 