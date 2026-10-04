import { Link } from "react-router-dom";
import { Briefcase, MapPin, Wallet, ArrowRight, Bell } from "lucide-react";
import { getRecentJobs, getSimilarJobs } from "../api/jobs";
import { useAsync } from "../hooks/useAsync";

function JobList({ title, items, loading, accent }) {
  if (!loading && (!items || items.length === 0)) return null; // nothing to show -> no empty card

  return (
    <div className="card-base p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">
        <span className={`w-1.5 h-5 rounded-full ${accent}`} />
        {title}
      </h3>
      {loading ? (
        <div className="space-y-3 animate-pulse" aria-hidden="true">
          <div className="h-20 rounded-xl bg-slate-100" />
          <div className="h-20 rounded-xl bg-slate-100" />
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((j) => (
            <li key={j.id}>
              <Link
                to={`/jobs/${j.id}/apply`}
                className="group block rounded-xl p-3.5 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate group-hover:text-purple-700 transition-colors">
                      {j.title}
                    </p>
                    <p className="text-xs text-slate-500">{j.company}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {j.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Wallet className="w-3 h-3" /> {j.salary}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> {j.type}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Sidebar({ jobId }) {
  const similar = useAsync((signal) => getSimilarJobs(jobId, { limit: 3, signal }), jobId);
  const recent = useAsync(async (signal) => {
    const jobs = await getRecentJobs({ limit: 3, signal });
    return jobs.filter((j) => String(j.id) !== String(jobId)).slice(0, 2); // don't list the job being viewed
  }, jobId);

  return (
    <aside className="space-y-6">
      <JobList
        title="Similar Jobs"
        items={similar.data}
        loading={similar.loading}
        accent="bg-gradient-to-b from-blue-500 to-purple-500"
      />
      <JobList
        title="Recently Posted"
        items={recent.data}
        loading={recent.loading}
        accent="bg-gradient-to-b from-purple-500 to-cyan-500"
      />
      <div className="relative overflow-hidden rounded-2xl shadow-lg p-6 text-white bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700">
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg mt-3">Get job alerts</h3>
          <p className="text-sm text-white/85 mt-1">
            Be the first to know when new roles matching your skills are posted.
          </p>
          <button className="mt-4 w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-white text-purple-700 hover:bg-slate-50 transition-colors">
            Enable alerts
          </button>
        </div>
      </div>
    </aside>
  );
}
