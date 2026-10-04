import { Sparkles, Bookmark, Share2, MapPin, Wallet, Briefcase } from "lucide-react";

export default function Hero({ job }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 text-white">
      <div className="absolute inset-0 opacity-70 bg-[radial-gradient(at_20%_20%,rgba(167,139,250,0.25)_0px,transparent_50%),radial-gradient(at_80%_0%,rgba(59,130,246,0.20)_0px,transparent_50%),radial-gradient(at_0%_80%,rgba(34,211,238,0.15)_0px,transparent_50%)]" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-24 -right-16 w-96 h-96 rounded-full bg-purple-400/40 blur-3xl animate-float" />
        <div className="absolute -bottom-32 -left-10 w-80 h-80 rounded-full bg-blue-400/40 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 left-1/2 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl animate-slide-up">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium ring-1 ring-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            {job.employmentType} · {job.postedAt}
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold mt-5 leading-[1.05]">
            {job.title}
          </h1>
          <p className="text-white/85 mt-4 text-lg sm:text-xl">
            {job.company} · {job.location}
          </p>

          <div className="flex flex-wrap gap-3 mt-7">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 backdrop-blur text-sm font-medium ring-1 ring-white/20">
              <Wallet className="w-4 h-4" /> {job.salary}
            </span>
            {job.experience && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 backdrop-blur text-sm font-medium ring-1 ring-white/20">
                <Briefcase className="w-4 h-4" /> {job.experience}
              </span>
            )}
            {/^remote/i.test(job.location) && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 backdrop-blur text-sm font-medium ring-1 ring-white/20">
                <MapPin className="w-4 h-4" /> Remote
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-9">
            <a
              href="#apply"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-blue-700 bg-white hover:bg-slate-50 shadow-lg transition-all hover:-translate-y-0.5"
            >
              Apply Now
              <Sparkles className="w-4 h-4" />
            </a>
            <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-white/15 backdrop-blur ring-1 ring-white/20 hover:bg-white/25 transition-colors">
              <Bookmark className="w-4 h-4" />
              Save
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold text-white bg-white/15 backdrop-blur ring-1 ring-white/20 hover:bg-white/25 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
    </section>
  );
}
