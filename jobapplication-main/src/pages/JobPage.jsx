import { Link, useParams } from "react-router-dom";
import { getJob } from "../api/jobs";
import { useAsync } from "../hooks/useAsync";
import Hero from "../components/Hero";
import { ErrorNotice } from "../components/Feedback";
import ApplyJob from "./ApplyJob";

/**
 * Route: /jobs/:jobId/apply
 * Loads the job named in the URL once, then hands it to the hero banner and the apply page
 * (which passes it on to the details card and sidebar).
 */
export default function JobPage() {
  const { jobId } = useParams();
  const { data: job, error, loading } = useAsync((signal) => getJob(jobId, { signal }), jobId);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse" aria-busy="true">
        <div className="h-10 w-2/3 rounded bg-slate-200" />
        <div className="h-5 w-1/3 rounded bg-slate-100 mt-4" />
        <div className="h-64 rounded-2xl bg-slate-100 mt-10" />
      </div>
    );
  }

  if (error) {
    const notFound = error.status === 404;
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        {notFound ? (
          <>
            <h1 className="text-3xl font-bold text-slate-800">Job not found</h1>
            <p className="text-slate-500 mt-2">This position may have been closed or removed.</p>
            <Link to="/jobs" className="btn-primary mt-6">
              Browse all jobs
            </Link>
          </>
        ) : (
          <ErrorNotice error={error} onRetry={() => window.location.reload()} />
        )}
      </div>
    );
  }

  return (
    <>
      <Hero job={job} />
      <ApplyJob job={job} />
    </>
  );
}
