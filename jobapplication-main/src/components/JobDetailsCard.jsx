import {
  MapPin,
  Wallet,
  Briefcase,
  Clock,
  CheckCircle2,
  Sparkles,
  FileText,
  Star,
} from "lucide-react";

function Section({ title, icon: Icon, children }) {
  return (
    <div className="mt-7 first:mt-0">
      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-3.5">
        <span className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-purple-600" />
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function JobDetailsCard({ job }) {
  return (
    <article className="card-base overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600" />
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {job.companyLogo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                {job.title}
              </h2>
              <span className="chip bg-emerald-50 text-emerald-700 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Open
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-slate-600 font-medium">{job.company}</p>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm text-slate-500">4.8</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="chip bg-slate-100 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-blue-500" /> {job.location}
              </span>
              <span className="chip bg-slate-100 text-slate-700">
                <Wallet className="w-3.5 h-3.5 text-blue-500" /> {job.salary}
              </span>
              <span className="chip bg-slate-100 text-slate-700">
                <Briefcase className="w-3.5 h-3.5 text-blue-500" /> {job.employmentType}
              </span>
              <span className="chip bg-slate-100 text-slate-700">
                <Clock className="w-3.5 h-3.5 text-blue-500" /> {job.postedAt}
              </span>
            </div>
          </div>
        </div>

        {job.experience && (
          <Section title="Experience Required" icon={Briefcase}>
            <p className="text-slate-700">{job.experience}</p>
          </Section>
        )}

        {job.skills?.length > 0 && (
          <Section title="Skills Required" icon={Sparkles}>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <span
                  key={s}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-br from-blue-50 to-purple-50 text-purple-700 border border-purple-100 hover:from-blue-100 hover:to-purple-100 hover:-translate-y-0.5 transition-all cursor-default"
                >
                  {s}
                </span>
              ))}
            </div>
          </Section>
        )}

        {job.description && (
          <Section title="Job Description" icon={FileText}>
            <p className="text-slate-700 leading-relaxed">{job.description}</p>
          </Section>
        )}

        {job.responsibilities?.length > 0 && (
          <Section title="Responsibilities" icon={CheckCircle2}>
            <ul className="space-y-2.5">
              {job.responsibilities.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {job.benefits?.length > 0 && (
          <Section title="Benefits" icon={Sparkles}>
            <ul className="grid sm:grid-cols-2 gap-2.5">
              {job.benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2.5 text-slate-700 bg-gradient-to-br from-slate-50 to-purple-50/40 rounded-xl px-3.5 py-2.5 border border-slate-100 hover:border-purple-200 transition-colors"
                >
                  <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-purple-500" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </article>
  );
}
