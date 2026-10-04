import { useState } from "react";
import { Mail, MapPin, Briefcase, Phone, Save, Star, Pencil, X } from "lucide-react";

const initialProfile = {
  name: "Anushka",
  role: "Python fullstack developer",
  email: "anushka@example.com",
  phone: "+91 6666666666",
  location: "Andhra Pradesh",
  experience: "5+ years",
  bio: "Passionate about Full Stack Development and building user-friendly web applications.",
  skills: ["React", "JavaScript", "CSS", "Accessibility"],
};

const inputCls =
  "w-full bg-transparent outline-none border-b border-purple-200 focus:border-purple-500 text-sm text-slate-700";

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile); // saved data
  const [form, setForm] = useState(initialProfile);       // draft while editing
  const [isEditing, setIsEditing] = useState(false);

  const startEdit = () => {
    setForm({ ...profile, skills: [...profile.skills] });
    setIsEditing(true);
  };
  const cancel = () => setIsEditing(false);
  const save = () => {
    setProfile(form);
    setIsEditing(false);
  };
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const updateSkills = (e) =>
    setForm({
      ...form,
      skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
    });

  const data = isEditing ? form : profile;

  const infoRow = (Icon, key, type = "text") => (
    <div className="flex items-center gap-2.5 text-sm text-slate-600 bg-slate-50 rounded-xl px-3.5 py-2.5">
      <Icon className="w-4 h-4 text-purple-500 shrink-0" />
      {isEditing ? (
        <input type={type} className={inputCls} value={form[key]} onChange={update(key)} />
      ) : (
        data[key]
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="card-base overflow-hidden">
        <div className="h-28 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700" />
        <div className="p-6 sm:p-8 -mt-14">
          <div className="flex items-end justify-between">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white">
              {data.name.slice(0, 1) || "?"}
            </div>
            {isEditing ? (
              <button
                onClick={cancel}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            ) : (
              <button
                onClick={startEdit}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4">
            {isEditing ? (
              <input className={`${inputCls} text-2xl font-bold`} value={form.name} onChange={update("name")} />
            ) : (
              <h1 className="text-2xl font-bold text-slate-800">{data.name}</h1>
            )}
            <span className="chip bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Available
            </span>
          </div>

          <div className="text-slate-500 flex items-center gap-1.5 mt-0.5">
            {isEditing ? (
              <input className={inputCls} value={form.role} onChange={update("role")} />
            ) : (
              <>
                {data.role}
                <span className="inline-flex items-center gap-0.5 ml-2 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-slate-500">Top 5% Frontend</span>
                </span>
              </>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {infoRow(Mail, "email", "email")}
            {infoRow(Phone, "phone", "tel")}
            {infoRow(MapPin, "location")}
            {infoRow(Briefcase, "experience")}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">About</h3>
            {isEditing ? (
              <textarea rows={3} className={`${inputCls} border rounded-lg p-2`} value={form.bio} onChange={update("bio")} />
            ) : (
              <p className="text-sm text-slate-600 leading-relaxed">{data.bio}</p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Skills</h3>
            {isEditing ? (
              <input
                className={inputCls}
                value={form.skills.join(", ")}
                onChange={updateSkills}
                placeholder="Comma separated: React, JavaScript, CSS"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {data.skills.map((s) => (
                  <span
                    key={s}
                    className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-br from-blue-50 to-purple-50 text-purple-700 border border-purple-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {isEditing && (
            <button onClick={save} className="btn-primary mt-8">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}