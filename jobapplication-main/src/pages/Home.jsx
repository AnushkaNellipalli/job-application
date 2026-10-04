import { Link } from "react-router-dom";
import { Briefcase, FileText, User, ArrowRight, Sparkles, Users, Award } from "lucide-react";

const cards = [
  {
    to: "/jobs",
    icon: Briefcase,
    title: "Browse Jobs",
    desc: "Explore open roles matching your skills and apply in minutes.",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    to: "/applications",
    icon: FileText,
    title: "My Applications",
    desc: "Track the status of roles you've applied to.",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    to: "/profile",
    icon: User,
    title: "Profile",
    desc: "Keep your resume and details up to date.",
    gradient: "from-cyan-500 to-blue-500",
  },
];

const stats = [
  { icon: Briefcase, label: "Open Positions", value: "12,500+" },
  { icon: Users, label: "Active Recruiters", value: "3,200+" },
  { icon: Award, label: "Hired This Month", value: "840" },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 text-white">
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(at_20%_20%,rgba(167,139,250,0.25)_0px,transparent_50%),radial-gradient(at_80%_0%,rgba(59,130,246,0.20)_0px,transparent_50%),radial-gradient(at_0%_80%,rgba(34,211,238,0.15)_0px,transparent_50%)]" />
        <div className="absolute -top-20 -right-10 w-96 h-96 rounded-full bg-purple-400/30 blur-3xl animate-float" />
        <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-blue-400/30 blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-medium ring-1 ring-white/20 animate-slide-up">
            <Sparkles className="w-3.5 h-3.5" />
            Your next career move starts here
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mt-6 leading-[1.05] animate-slide-up" style={{ animationDelay: "0.05s" }}>
            Find a job you
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-cyan-300">
              actually love
            </span>
          </h1>
          <p className="text-white/85 mt-5 text-lg sm:text-xl max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Browse thousands of openings, apply with one click, and track your
            applications — all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-9 animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-blue-700 bg-white hover:bg-slate-50 shadow-lg transition-all hover:-translate-y-0.5"
            >
              Explore Jobs
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-white/15 backdrop-blur ring-1 ring-white/20 hover:bg-white/25 transition-colors"
            >
              <User className="w-4 h-4" />
              My Profile
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="card-base p-4 sm:p-6 text-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-purple-600">
                <s.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-slate-800 mt-3">
                {s.value}
              </p>
              <p className="text-xs sm:text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-800">
            Everything you need to get hired
          </h2>
          <p className="text-slate-500 mt-2">
            Tools and features designed to make your job search effortless.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group card-base card-hover p-6"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white shadow-md`}>
                <c.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mt-4">{c.title}</h3>
              <p className="text-sm text-slate-500 mt-1.5">{c.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 mt-4">
                Go
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
