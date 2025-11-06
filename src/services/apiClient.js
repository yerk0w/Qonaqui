const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
};

const getAccessToken = () => localStorage.getItem(STORAGE_KEYS.accessToken);
const getRefreshToken = () => localStorage.getItem(STORAGE_KEYS.refreshToken);

const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) {
    localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
  }
};

const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
};

let refreshInFlight;

async function refreshTokens() {
  if (!getRefreshToken()) {
    clearTokens();
    throw new Error('Refresh token missing');
  }

  if (!refreshInFlight) {
    refreshInFlight = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: getRefreshToken() }),
    })
      .then(async (response) => {
        if (!response.ok) {
          clearTokens();
          throw new Error('Не удалось обновить токен');
        }
        const data = await response.json();
        setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        return data.accessToken;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
}

async function request(path, options = {}, retry = false) {
  const headers = new Headers(options.headers ?? {});
  const token = getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && !retry && getRefreshToken()) {
    try {
      await refreshTokens();
      return request(path, options, true);
    } catch (err) {
      throw err;
    }
  }

  if (!response.ok) {
    let errorMessage = 'Произошла ошибка';
    try {
      const payload = await response.json();
      errorMessage = payload.message ?? errorMessage;
    } catch (parseErr) {
      // ignore parse error, use default message
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export const apiClient = {
  request,
  setTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
};

export { API_BASE_URL, STORAGE_KEYS };
