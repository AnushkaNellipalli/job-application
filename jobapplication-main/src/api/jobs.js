// One function per backend endpoint used by the job screens.
import { request } from "./client";

/** GET /api/jobs/  ->  { count, next, previous, results: [...] }   (Jobs.jsx) */
export function listJobs({ search = "", page = 1, pageSize = 12, signal } = {}) {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  if (search.trim()) params.set("search", search.trim());
  return request(`/jobs/?${params}`, { signal });
}

/** GET /api/jobs/{id}/  ->  one full job   (Hero.jsx, JobDetailsCard.jsx) */
export function getJob(id, { signal } = {}) {
  return request(`/jobs/${encodeURIComponent(id)}/`, { signal });
}

/** GET /api/jobs/{id}/similar/  ->  [job, ...]   (Sidebar "Similar Jobs") */
export function getSimilarJobs(id, { limit = 3, signal } = {}) {
  return request(`/jobs/${encodeURIComponent(id)}/similar/?limit=${limit}`, { signal });
}

/** GET /api/jobs/recent/  ->  [job, ...]   (Sidebar second list) */
export function getRecentJobs({ limit = 5, signal } = {}) {
  return request(`/jobs/recent/?limit=${limit}`, { signal });
}
