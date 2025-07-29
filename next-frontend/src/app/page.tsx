"use client";
import { FaArrowRight } from 'react-icons/fa';
import useSWR from 'swr';
import { fetchDashboards } from '../lib/api';

export default function HomePage() {
  const { data: dashboards, isLoading, error } = useSWR('dashboards', fetchDashboards);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Lithuanian Flag Bar */}
      <div className="w-full h-3 flex">
        <div className="flex-1 bg-[#FDB913]" />
        <div className="flex-1 bg-[#006A44]" />
        <div className="flex-1 bg-[#C1272D]" />
      </div>
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center h-[56vh] max-h-[600px] px-4">
        {/* Subtle line-art overlay (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#E5EFFF" fillOpacity="0.5" d="M0,160L60,154.7C120,149,240,139,360,154.7C480,171,600,213,720,197.3C840,181,960,107,1080,101.3C1200,96,1320,160,1380,192L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>
        <div className="relative z-10 max-w-3xl mx-auto mt-16">
          <h1 className="text-5xl md:text-7xl font-extrabold text-primary mb-6 tracking-tight drop-shadow-lg">
            Lithuania, in numbers
            <span className="block w-32 h-2 mx-auto mt-3 rounded-full" style={{ background: 'linear-gradient(90deg, #FDB913 33%, #006A44 33%, #006A44 66%, #C1272D 66%)' }} />
          </h1>
          <p className="text-xl md:text-2xl text-primary/80 mb-8 font-medium">Unbiased, data-driven insights on Lithuania’s economy. Explore dashboards, stories, and trusted sources—all in one place.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/dashboard/economy" className="inline-flex items-center px-8 py-3 rounded-full bg-primary text-white font-semibold text-lg shadow-elev-1 hover:bg-success transition">
              Browse data <FaArrowRight className="ml-2" />
            </a>
            <a href="#latest-report" className="inline-flex items-center px-8 py-3 rounded-full bg-warning text-primary font-semibold text-lg shadow-elev-1 hover:bg-primary hover:text-white transition">
              Latest report <FaArrowRight className="ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Trending Questions */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-primary mb-8 tracking-tight">Trending questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-2xl shadow-elev-2 p-8 flex flex-col justify-between h-full border border-blue-100 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-primary mb-2">Sample question {i}</h3>
              <p className="text-gray-700 mb-4">How has Lithuania’s GDP changed in the last decade?</p>
              <a href="#" className="text-success font-semibold hover:underline mt-auto">See answer</a>
            </div>
          ))}
        </div>
      </section>

      {/* Spotlight Story (placeholder) */}
      <section className="w-full bg-gradient-to-r from-primary/5 to-success/5 py-20 mb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-primary mb-4 tracking-tight">Spotlight story</h2>
          <p className="text-lg text-primary/80 mb-6">Full-bleed scrollytelling story goes here. (Coming soon!)</p>
          <div className="bg-card rounded-2xl shadow-elev-2 p-8 border border-blue-100">[Interactive story placeholder]</div>
        </div>
      </section>

      {/* Latest Dashboards (real data) */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-extrabold text-primary mb-8 tracking-tight">Latest dashboards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full text-center text-blue-400">Loading dashboards…</div>
          ) : error ? (
            <div className="col-span-full text-center text-red-500">Failed to load dashboards.</div>
          ) : dashboards && dashboards.length > 0 ? (
            dashboards.slice(0, 3).map((dashboard: any) => (
              <div key={dashboard.id} className="bg-card rounded-2xl shadow-elev-2 p-8 flex flex-col justify-between h-full border border-blue-100 hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-primary mb-2">{dashboard.title}</h3>
                <p className="text-gray-700 mb-4">{dashboard.description || 'No description.'}</p>
                <a href={`dashboard/${dashboard.id}`} className="text-success font-semibold hover:underline mt-auto">View dashboard</a>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">No dashboards yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
