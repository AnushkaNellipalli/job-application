import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { AlertCircle, Loader2, LogIn, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthField from "../components/AuthField";

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || "/jobs";
  if (user) return <Navigate to={redirectTo} replace />; // already (or now) logged in

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = {};
    if (!values.email.trim()) found.email = "Email is required.";
    if (!values.password) found.password = "Password is required.";
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      await login(values); // on success `user` is set and the <Navigate> above takes over
    } catch (err) {
      setFormError(err.status === 401 ? "Incorrect email or password." : err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <form onSubmit={handleSubmit} noValidate className="card-base p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            <LogIn className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
        </div>
        <p className="text-sm text-slate-500 mb-6">Log in to your JobPortal account.</p>

        {formError && (
          <div role="alert" className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm px-3.5 py-2.5 mb-4">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {formError}
          </div>
        )}

        <div className="space-y-4">
          <AuthField
            id="login-email"
            label="Email"
            icon={Mail}
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={set("email")}
            placeholder="jane@example.com"
            error={errors.email}
          />
          <AuthField
            id="login-password"
            label="Password"
            icon={Lock}
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={set("password")}
            placeholder="Your password"
            error={errors.password}
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full mt-6 disabled:opacity-70 disabled:cursor-not-allowed">
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log in"
          )}
        </button>

        <p className="text-sm text-slate-500 text-center mt-5">
          New here?{" "}
          <Link to="/register" state={location.state} className="font-medium text-purple-600 hover:text-purple-700">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
