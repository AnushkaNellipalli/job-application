import { useState } from "react";
import JobDetailsCard from "../components/JobDetailsCard";
import ApplyForm from "../components/ApplyForm";
import Sidebar from "../components/Sidebar";
import SuccessModal from "../components/SuccessModal";

export default function ApplyJob({ job }) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 1400);
  };

  const handleSave = () => showToast("Job saved to your list.");
  const handleCancel = () => showToast("Application cleared.", "info");

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <JobDetailsCard job={job} />
          <div id="apply">
            <ApplyForm
              submitting={submitting}
              onSubmit={handleSubmit}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-20">
            <Sidebar jobId={job.id} />
          </div>
        </div>
      </div>

      <SuccessModal open={success} onClose={() => setSuccess(false)} />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div
            className={`px-5 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${
              toast.type === "info" ? "bg-slate-800" : "bg-emerald-600"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
