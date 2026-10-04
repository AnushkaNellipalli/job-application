import { AlertCircle } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all";

/** Labelled input with an icon and an inline error line - same look as the fields in ApplyForm. */
export default function AuthField({ label, icon: Icon, error, id, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative group">
        <Icon className="w-4 h-4 absolute left-3 top-3.5 text-slate-400 group-focus-within:text-purple-500 pointer-events-none transition-colors" />
        <input id={id} className={inputClass} aria-invalid={Boolean(error)} {...inputProps} />
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-rose-600 mt-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
