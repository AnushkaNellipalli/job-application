// The one place that knows how to talk to the Django backend.
// Every page/component calls the small functions in jobs.js / auth.js, which call request() below.

const API_URL = (import.meta.env?.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

// --- Token storage -------------------------------------------------------
// localStorage survives page reloads, so the user stays logged in. Trade-off: any
// JavaScript on the page can read it, so never inject untrusted HTML into this app.
const ACCESS_KEY = "jobportal.access";
const REFRESH_KEY = "jobportal.refresh";

function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    /* storage blocked (private mode etc.) - the user just won't stay logged in */
  }
}

export const tokens = {
  get access() {
    return read(ACCESS_KEY);
  },
  get refresh() {
    return read(REFRESH_KEY);
  },
  set(access, refresh) {
    write(ACCESS_KEY, access);
    write(REFRESH_KEY, refresh);
  },
  clear() {
    write(ACCESS_KEY, null);
    write(REFRESH_KEY, null);
  },
};

// --- Errors --------------------------------------------------------------
// Django/DRF errors look like {"detail": "..."} or {"email": ["..."], "password": ["..."]}.

function firstMessage(value) {
  return Array.isArray(value) ? value[0] : value;
}

export class ApiError extends Error {
  constructor(status, data, fallback) {
    const detail = data && typeof data === "object" ? firstMessage(data.detail) : null;
    super(detail || fallback || `Request failed (${status}).`);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }

  /** {field: "first message"} for validation errors, e.g. {email: "An account with this email already exists."} */
  get fieldErrors() {
    if (!this.data || typeof this.data !== "object" || this.status !== 400) return {};
    return Object.fromEntries(
      Object.entries(this.data)
        .filter(([key]) => key !== "detail")
        .map(([key, value]) => [key, String(firstMessage(value))]),
    );
  }
}

// --- Requests ------------------------------------------------------------

async function send(path, { method = "GET", body, auth = false, signal } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth && tokens.access) headers.Authorization = `Bearer ${tokens.access}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err; // a cancelled request is not an error to show
    throw new ApiError(0, null, "Can't reach the server. Is the backend running?");
  }

  let data = null;
  if (response.status !== 204) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }
  if (!response.ok) throw new ApiError(response.status, data);
  return data;
}

// Access tokens are short-lived (30 min). When one expires we swap the refresh token for a new
// pair and retry once. `refreshing` makes simultaneous 401s share a single refresh call.
let refreshing = null;

function refreshTokens() {
  if (!refreshing) {
    refreshing = (async () => {
      if (!tokens.refresh) return false;
      try {
        const data = await send("/auth/token/refresh/", {
          method: "POST",
          body: { refresh: tokens.refresh },
        });
        tokens.set(data.access, data.refresh ?? tokens.refresh);
        return true;
      } catch {
        tokens.clear();
        if (typeof window !== "undefined") window.dispatchEvent(new Event("auth:expired"));
        return false;
      }
    })().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

/**
 * request("/jobs/")                           public call, no token sent
 * request("/auth/me/", { auth: true })        sends the access token; auto-refreshes on 401
 */
export async function request(path, options = {}) {
  try {
    return await send(path, options);
  } catch (err) {
    if (options.auth && err instanceof ApiError && err.status === 401 && (await refreshTokens())) {
      return send(path, options);
    }
    throw err;
  }
}
