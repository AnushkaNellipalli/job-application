// Authentication calls. Tokens are saved here so the rest of the app never touches them.
import { request, tokens } from "./client";

/** POST /api/auth/register/ - creates the account and signs the user in. Returns the user. */
export async function register({ fullName, email, password, confirmPassword }) {
  const data = await request("/auth/register/", {
    method: "POST",
    body: { fullName, email, password, confirmPassword },
  });
  tokens.set(data.access, data.refresh);
  return data.user;
}

/** POST /api/auth/login/ - returns the user. */
export async function login({ email, password }) {
  const data = await request("/auth/login/", { method: "POST", body: { email, password } });
  tokens.set(data.access, data.refresh);
  return data.user;
}

/** POST /api/auth/logout/ - forget the tokens locally, then ask the server to revoke the refresh token. */
export async function logout() {
  const refresh = tokens.refresh;
  tokens.clear();
  if (!refresh) return;
  try {
    await request("/auth/logout/", { method: "POST", body: { refresh } });
  } catch {
    /* already logged out locally; a failed revoke is not worth showing an error for */
  }
}

/** GET /api/auth/me/ - who is logged in right now? (needs a valid token) */
export function getMe() {
  return request("/auth/me/", { auth: true });
}
