import { Globe, Mail, MessageCircle, Share2, Heart } from "lucide-react";

const links = [
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
];

const socials = [
  { icon: Globe, href: "#" },
  { icon: MessageCircle, href: "#" },
  { icon: Mail, href: "#" },
  { icon: Share2, href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative bg-slate-900 text-slate-300 mt-16 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(at_20%_20%,rgba(167,139,250,0.25)_0px,transparent_50%),radial-gradient(at_80%_0%,rgba(59,130,246,0.20)_0px,transparent_50%),radial-gradient(at_0%_80%,rgba(34,211,238,0.15)_0px,transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                J
              </div>
              <span className="text-lg font-bold text-white">
                Job<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Portal</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-4 max-w-xs leading-relaxed">
              Find your dream role or hire the best talent — all in one place.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-purple-500 group-hover:w-3 transition-all" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Follow us
            </h4>
            <div className="flex gap-3">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 flex items-center justify-center text-slate-300 hover:text-white transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for job seekers
          </p>
        </div>
      </div>
    </footer>
  );
}
