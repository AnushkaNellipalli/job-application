import { CheckCircle2, X, Briefcase, PartyPopper } from "lucide-react";

export default function SuccessModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-scale-in overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <PartyPopper className="absolute -top-1 -right-1 w-6 h-6 text-amber-400 fill-amber-100" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mt-6">
          Application Submitted Successfully!
        </h3>
        <p className="text-sm text-slate-500 mt-2.5 leading-relaxed">
          Thank you for applying. Our team will review your application and get
          back to you within 5-7 business days.
        </p>
        <button
          onClick={onClose}
          className="btn-primary mt-7 w-full"
        >
          <Briefcase className="w-4 h-4" />
          Back to Jobs
        </button>
      </div>
    </div>
  );
}
