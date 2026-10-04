import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Wallet, Briefcase, ArrowRight, Search } from "lucide-react";
import { listJobs } from "../api/jobs";
import { CardSkeleton, ErrorNotice } from "../components/Feedback";

const PAGE_SIZE = 12;

export default function Jobs() {
  const [query, setQuery] = useState(""); // what the user has typed
  const [search, setSearch] = useState(""); // the same text, applied 300ms after they stop typing
  const [reloadKey, setReloadKey] = useState(0); // bump to re-run the fetch ("Try again")
  const [state, setState] = useState({
    jobs: [],
    count: 0,
    page: 1,
    hasMore: false,
    loading: true,
    error: null,
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // (Re)load the first page whenever the search text changes.
  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    listJobs({ search, page: 1, pageSize: PAGE_SIZE, signal: controller.signal })
      .then((data) =>
        setState({
          jobs: data.results,
          count: data.count,
          page: 1,
          hasMore: Boolean(data.next),
          loading: false,
          error: null,
        }),
      )
      .catch((error) => {
        if (error?.name === "AbortError") return;
        setState((s) => ({ ...s, loading: false, error }));
      });
    return () => controller.abort();
  }, [search, reloadKey]);

  const loadMore = async () => {
    setLoadingMore(true);
    setMoreError(null);
    try {
      const data = await listJobs({ search, page: state.page + 1, pageSize: PAGE_SIZE });
      setState((s) => ({
        ...s,
        jobs: [...s.jobs, ...data.results],
        count: data.count,
        page: s.page + 1,
        hasMore: Boolean(data.next),
      }));
    } catch (error) {
      setMoreError(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const { jobs, count, hasMore, loading, error } = state;
  const firstLoad = loading && jobs.length === 0;

  let subtitle = `${count} open roles waiting for you.`;
  if (firstLoad) subtitle = "Loading open roles...";
  else if (!error && jobs.length === 0) subtitle = search ? `No jobs match "${search}".` : "No open roles right now.";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Job Listings
          </h1>
          <p className="text-slate-500 mt-1.5">{error ? "We couldn't load the jobs." : subtitle}</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs by title or company..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-md"
          />
        </div>
      </div>

      {error ? (
        <div className="mt-8">
          <ErrorNotice error={error} onRetry={() => setReloadKey((k) => k + 1)} />
        </div>
      ) : firstLoad ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {Array.from({ length: 6 }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div
          className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 transition-opacity ${
            loading ? "opacity-60" : ""
          }`}
        >
          {jobs.map((j) => (
            <Link
              key={j.id}
              to={`/jobs/${j.id}/apply`}
              className="group card-base card-hover p-6 flex flex-col"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                  {(j.companyLogo || j.company.slice(0, 2)).toUpperCase()}
                </div>
                <span className="chip bg-purple-50 text-purple-700 border border-purple-100">
                  {j.type || j.employmentType}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg mt-4 group-hover:text-purple-700 transition-colors">
                {j.title}
              </h3>
              <p className="text-sm text-slate-500">{j.company}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" /> {j.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5 text-blue-500" /> {j.salary}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-blue-500" /> {j.experience || "Mid-Senior"}
                </span>
              </div>
              <div className="mt-auto pt-4">
                <span className="inline-flex items-center gap-1 text-sm font-medium text-purple-600">
                  View & Apply
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!error && hasMore && (
        <div className="mt-8 text-center">
          <button type="button" onClick={loadMore} disabled={loadingMore} className="btn-ghost disabled:opacity-70">
            {loadingMore ? "Loading..." : "Load more jobs"}
          </button>
          {moreError && <p className="text-sm text-rose-600 mt-2">{moreError.message}</p>}
        </div>
      )}
    </div>
  );
}
