const STORAGE_MODE_KEY = "nutrisnap_auth_storage";
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

type StorageMode = "local" | "session";

function storageFor(mode: StorageMode): Storage {
  return mode === "local" ? localStorage : sessionStorage;
}

export function getStorageMode(): StorageMode {
  return localStorage.getItem(STORAGE_MODE_KEY) === "local"
    ? "local"
    : "session";
}

export function saveSession(
  accessToken: string,
  refreshToken: string,
  remember: boolean,
): void {
  clearSession();
  const mode: StorageMode = remember ? "local" : "session";
  localStorage.setItem(STORAGE_MODE_KEY, mode);
  const storage = storageFor(mode);
  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function updateTokens(accessToken: string, refreshToken: string): void {
  const storage = storageFor(getStorageMode());
  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken(): string | null {
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ??
    sessionStorage.getItem(ACCESS_TOKEN_KEY)
  );
}

export function getRefreshToken(): string | null {
  return (
    localStorage.getItem(REFRESH_TOKEN_KEY) ??
    sessionStorage.getItem(REFRESH_TOKEN_KEY)
  );
}

export function clearSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(STORAGE_MODE_KEY);
}
