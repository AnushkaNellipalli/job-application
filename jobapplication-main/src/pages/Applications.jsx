import { useState, useEffect, useMemo } from "react";
import { FileText, Clock, CheckCircle2, XCircle, X, Calendar, MapPin } from "lucide-react";

const applications = [
  {
    id: "a1",
    role: "Senior Frontend Engineer",
    company: "Nebula Labs",
    status: "In Review",
    appliedAt: "2 days ago",
    location: "Remote",
    description:
      "Build and maintain the customer-facing dashboard using React and TypeScript.",
    timeline: [
      { label: "Application submitted", date: "2 days ago", done: true },
      { label: "Resume reviewed", date: "In progress", done: false },
      { label: "Interview", date: "Pending", done: false },
    ],
  },
  {
    id: "a2",
    role: "React Engineer",
    company: "Pixel Forge",
    status: "Shortlisted",
    appliedAt: "1 week ago",
    location: "Hyderabad, India",
    description:
      "Work on reusable UI components and performance for a design-heavy product.",
    timeline: [
      { label: "Application submitted", date: "1 week ago", done: true },
      { label: "Resume reviewed", date: "5 days ago", done: true },
      { label: "Shortlisted", date: "3 days ago", done: true },
      { label: "Interview", date: "Pending", done: false },
    ],
  },
  {
    id: "a3",
    role: "UI Engineer",
    company: "Brightwave",
    status: "Rejected",
    appliedAt: "3 weeks ago",
    location: "Bengaluru, India",
    description:
      "Implement pixel-perfect interfaces and maintain the company design system.",
    timeline: [
      { label: "Application submitted", date: "3 weeks ago", done: true },
      { label: "Resume reviewed", date: "2 weeks ago", done: true },
      { label: "Not selected", date: "2 weeks ago", done: true },
    ],
  },
];

const statusStyles = {
  "In Review": {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    Icon: Clock,
  },
  Shortlisted: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Icon: CheckCircle2,
  },
  Rejected: {
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    Icon: XCircle,
  },
};

function StatusBadge({ status }) {
  const { badge, Icon } = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${badge}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}

function DetailModal({ app, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${app.role} at ${app.company}`}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{app.role}</h2>
            <p className="text-slate-500">{app.company}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-slate-500">
          <StatusBadge status={app.status} />
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Applied {app.appliedAt}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {app.location}
          </span>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mt-5">
          {app.description}
        </p>

        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mt-6 mb-3">
          Progress
        </h3>
        <ol className="space-y-3">
          {app.timeline.map((step, i) => (
            <li key={i} className="flex items-center gap-3">
              <span
                className={`w-3 h-3 rounded-full shrink-0 ${
                  step.done ? "bg-purple-500" : "bg-slate-200"
                }`}
              />
              <span
                className={`text-sm flex-1 ${
                  step.done ? "text-slate-800" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
              <span className="text-xs text-slate-400">{step.date}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function Applications() {
  const [selected, setSelected] = useState(null);

  const counts = useMemo(
    () => ({
      total: applications.length,
      shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
      inReview: applications.filter((a) => a.status === "In Review").length,
    }),
    []
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
        My Applications
      </h1>
      <p className="text-slate-500 mt-1.5">
        Track the status of your submitted applications.
      </p>

      <div className="grid grid-cols-3 gap-3 sm:gap-5 mt-8">
        <div className="card-base p-4 sm:p-5 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">{counts.total}</p>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Total</p>
        </div>
        <div className="card-base p-4 sm:p-5 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{counts.shortlisted}</p>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Shortlisted</p>
        </div>
        <div className="card-base p-4 sm:p-5 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-amber-600">{counts.inReview}</p>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">In Review</p>
        </div>
      </div>

      <div className="space-y-4 mt-8">
        {applications.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setSelected(a)}
            className="card-base card-hover p-5 flex items-center gap-4 w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-800 truncate">{a.role}</h3>
              <p className="text-sm text-slate-500">{a.company}</p>
            </div>
            <div className="text-right shrink-0">
              <StatusBadge status={a.status} />
              <p className="text-xs text-slate-400 mt-1.5">{a.appliedAt}</p>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <DetailModal app={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}