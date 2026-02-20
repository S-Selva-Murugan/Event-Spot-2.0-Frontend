type AuthPayload = {
  message?: string;
  error?: string;
  details?: string;
};

const EXPIRY_SKEW_SECONDS = 30;

const parseJwtPayload = (token: string): Record<string, any> | null => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string, skewSeconds = EXPIRY_SKEW_SECONDS): boolean => {
  const payload = parseJwtPayload(token);
  const exp = payload?.exp;
  if (typeof exp !== "number") return true;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return nowSeconds >= exp - skewSeconds;
};

export const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("provider");
};

export const redirectToLogin = (reason = "session_expired") => {
  const next = `${window.location.pathname}${window.location.search}`;
  window.location.href = `/login?reason=${encodeURIComponent(reason)}&next=${encodeURIComponent(next)}`;
};

export const getValidatedAuthHeaders = (includeJsonContentType = false) => {
  const token = localStorage.getItem("token") || "";
  const provider = localStorage.getItem("provider");

  if (!token) {
    redirectToLogin("login_required");
    return null;
  }

  if (isTokenExpired(token)) {
    clearAuthStorage();
    redirectToLogin("session_expired");
    return null;
  }

  return {
    ...(includeJsonContentType ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${token}`,
    ...(provider ? { "x-auth-provider": provider } : {}),
  };
};

const authTextPattern = /(invalid|expired).*(token)|token used too late|jwt.*expired|signature.*expired/i;

export const isAuthFailure = (status?: number, payload?: AuthPayload | null) => {
  const text = `${payload?.message || ""} ${payload?.error || ""} ${payload?.details || ""}`.trim();
  return status === 401 || status === 403 || authTextPattern.test(text);
};

export const handleAuthFailure = (status?: number, payload?: AuthPayload | null): boolean => {
  if (!isAuthFailure(status, payload)) return false;
  clearAuthStorage();
  redirectToLogin("session_expired");
  return true;
};
