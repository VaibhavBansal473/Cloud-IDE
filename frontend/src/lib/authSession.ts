export type AuthRole = "user" | "admin" | "superadmin";

export interface AuthSession {
  role: AuthRole;
  id?: string;
  email?: string;
  name?: string;
}

export const AUTH_STORAGE_KEY = "Cloud-IDE";
const LEGACY_AUTH_STORAGE_KEY = "cloud-IDE";

export function readAuthSession(): AuthSession | null {
  const stored =
    localStorage.getItem(AUTH_STORAGE_KEY) ||
    localStorage.getItem(LEGACY_AUTH_STORAGE_KEY);

  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);

    if (parsed?.role) {
      return parsed;
    }

    if (parsed?.data?.userId || parsed?.userId) {
      return {
        role: "user",
        id: parsed?.data?.userId || parsed?.userId,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function writeAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
}
