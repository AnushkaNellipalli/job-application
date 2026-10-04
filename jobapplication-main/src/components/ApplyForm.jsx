import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Wallet,
  Globe,
  Link as LinkIcon,
  Upload,
  FileText,
  Send,
  Bookmark,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { validateForm } from "../utils/validation";

const initial = {
  fullName: "",
  email: "",
  phone: "",
  currentLocation: "",
  yearsExperience: "",
  expectedSalary: "",
  linkedin: "",
  github: "",
  resume: null,
  coverLetter: "",
};

function Field({
  label,
  icon: Icon,
  error,
  children,
  required,
  hint,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-purple-500">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon className="w-4 h-4 absolute left-3 top-3.5 text-slate-400 group-focus-within:text-purple-500 pointer-events-none transition-colors" />
        )}
        {children}
      </div>
      {hint && !error && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1 text-xs text-rose-600 mt-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all";

export default function ApplyForm({ onSubmit, onSave, onCancel, submitting }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const set = (key) => (e) => {
    const val = key === "resume" ? e.target.files?.[0] ?? null : e.target.value;
    setValues((v) => ({ ...v, [key]: val }));
    if (touched[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const blur = (key) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validateForm(values));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateForm(values);
    setErrors(errs);
    setTouched(Object.keys(initial).reduce((a, k) => ({ ...a, [k]: true }), {}));
    if (Object.keys(errs).length === 0) onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card-base p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md">
          <Send className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Apply for this role</h2>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Fill in your details below. Fields marked with <span className="text-purple-500">*</span> are required.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full Name" icon={User} error={touched.fullName && errors.fullName} required>
          <input
            type="text"
            value={values.fullName}
            onChange={set("fullName")}
            onBlur={blur("fullName")}
            placeholder="Jane Doe"
            className={inputClass}
          />
        </Field>

        <Field label="Email" icon={Mail} error={touched.email && errors.email} required>
          <input
            type="email"
            value={values.email}
            onChange={set("email")}
            onBlur={blur("email")}
            placeholder="jane@example.com"
            className={inputClass}
          />
        </Field>

        <Field label="Phone Number" icon={Phone} error={touched.phone && errors.phone} required>
          <input
            type="tel"
            value={values.phone}
            onChange={set("phone")}
            onBlur={blur("phone")}
            placeholder="+1 555 123 4567"
            className={inputClass}
          />
        </Field>

        <Field
          label="Current Location"
          icon={MapPin}
          error={touched.currentLocation && errors.currentLocation}
          required
        >
          <input
            type="text"
            value={values.currentLocation}
            onChange={set("currentLocation")}
            onBlur={blur("currentLocation")}
            placeholder="San Francisco, CA"
            className={inputClass}
          />
        </Field>

        <Field
          label="Years of Experience"
          icon={Clock}
          error={touched.yearsExperience && errors.yearsExperience}
          required
        >
          <input
            type="number"
            min="0"
            value={values.yearsExperience}
            onChange={set("yearsExperience")}
            onBlur={blur("yearsExperience")}
            placeholder="5"
            className={inputClass}
          />
        </Field>

        <Field
          label="Expected Salary"
          icon={Wallet}
          error={touched.expectedSalary && errors.expectedSalary}
          required
        >
          <input
            type="text"
            value={values.expectedSalary}
            onChange={set("expectedSalary")}
            onBlur={blur("expectedSalary")}
            placeholder="$130,000"
            className={inputClass}
          />
        </Field>

        <Field
          label="LinkedIn Profile URL"
          icon={LinkIcon}
          error={touched.linkedin && errors.linkedin}
          hint="Optional"
        >
          <input
            type="url"
            value={values.linkedin}
            onChange={set("linkedin")}
            onBlur={blur("linkedin")}
            placeholder="https://linkedin.com/in/jane"
            className={inputClass}
          />
        </Field>

        <Field
          label="GitHub Portfolio URL"
          icon={Globe}
          error={touched.github && errors.github}
          hint="Optional"
        >
          <input
            type="url"
            value={values.github}
            onChange={set("github")}
            onBlur={blur("github")}
            placeholder="https://github.com/jane"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Resume Upload (PDF/DOC)" icon={Upload} error={touched.resume && errors.resume} required>
          <label className="flex items-center gap-3 cursor-pointer rounded-xl border-2 border-dashed border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 px-4 py-3.5 transition-colors">
            <Upload className="w-5 h-5 text-slate-400 group-hover:text-purple-500" />
            <span className="text-sm text-slate-600">
              {values.resume ? values.resume.name : "Click to upload your resume"}
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={set("resume")}
              className="hidden"
            />
          </label>
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Cover Letter" icon={FileText} error={touched.coverLetter && errors.coverLetter} required>
          <textarea
            rows={5}
            value={values.coverLetter}
            onChange={set("coverLetter")}
            onBlur={blur("coverLetter")}
            placeholder="Tell us why you're a great fit for this role..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all resize-y"
          />
        </Field>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Apply Now
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 transition-colors"
        >
          <Bookmark className="w-4 h-4" />
          Save Job
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </form>
  );
}
