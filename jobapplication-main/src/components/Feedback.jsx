import { AlertCircle } from "lucide-react";

/** Shown when a request to the backend fails. `error.message` is already user-friendly (see api/client.js). */
export function ErrorNotice({ error, onRetry }) {
  return (
    <div role="alert" className="card-base p-6 flex items-start gap-3 border-rose-200">
      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800">Something went wrong</p>
        <p className="text-sm text-slate-500 mt-0.5">
          {error?.message || "Please try again in a moment."}
        </p>
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-ghost shrink-0">
          Try again
        </button>
      )}
    </div>
  );
}

/** Grey pulsing placeholder that has the same footprint as a job card in the grid. */
export function CardSkeleton() {
  return (
    <div className="card-base p-6 animate-pulse" aria-hidden="true">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-slate-200" />
        <div className="w-16 h-5 rounded-full bg-slate-100" />
      </div>
      <div className="h-5 w-3/4 rounded bg-slate-200 mt-4" />
      <div className="h-4 w-1/2 rounded bg-slate-100 mt-2" />
      <div className="h-3 w-full rounded bg-slate-100 mt-6" />
    </div>
  );
}
