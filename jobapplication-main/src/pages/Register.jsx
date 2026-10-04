import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { AlertCircle, Loader2, Lock, Mail, User, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthField from "../components/AuthField";

function validate(v) {
  const e = {};
  if (v.fullName.trim().length < 2) e.fullName = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Enter a valid email address.";
  if (v.password.length < 8) e.password = "Use at least 8 characters.";
  if (v.confirmPassword !== v.password) e.confirmPassword = "Passwords do not match.";
  return e;
}

export default function Register() {
  const { user, register } = useAuth();
  const location = useLocation();
  const [values, setValues] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || "/jobs";
  if (user) return <Navigate to={redirectTo} replace />;

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      await register(values);
    } catch (err) {
      // Backend validation (duplicate email, weak password...) comes back per field.
      const fields = err.fieldErrors;
      setErrors(fields);
      setFormError(Object.keys(fields).length ? null : err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <form onSubmit={handleSubmit} noValidate className="card-base p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            <UserPlus className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
        </div>
        <p className="text-sm text-slate-500 mb-6">It takes less than a minute.</p>

        {formError && (
          <div role="alert" className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm px-3.5 py-2.5 mb-4">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {formError}
          </div>
        )}

        <div className="space-y-4">
          <AuthField id="reg-name" label="Full name" icon={User} type="text" autoComplete="name"
            value={values.fullName} onChange={set("fullName")} placeholder="Jane Doe" error={errors.fullName} />
          <AuthField id="reg-email" label="Email" icon={Mail} type="email" autoComplete="email"
            value={values.email} onChange={set("email")} placeholder="jane@example.com" error={errors.email} />
          <AuthField id="reg-password" label="Password" icon={Lock} type="password" autoComplete="new-password"
            value={values.password} onChange={set("password")} placeholder="At least 8 characters" error={errors.password} />
          <AuthField id="reg-confirm" label="Confirm password" icon={Lock} type="password" autoComplete="new-password"
            value={values.confirmPassword} onChange={set("confirmPassword")} placeholder="Repeat your password" error={errors.confirmPassword} />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full mt-6 disabled:opacity-70 disabled:cursor-not-allowed">
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign up"
          )}
        </button>

        <p className="text-sm text-slate-500 text-center mt-5">
          Already have an account?{" "}
          <Link to="/login" state={location.state} className="font-medium text-purple-600 hover:text-purple-700">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
