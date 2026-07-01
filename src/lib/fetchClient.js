const BASE_URL = process.env.NEXT_PUBLIC_API_KEY;

const parseResponse = (res) => res.status === 204 ? null : res.json();

export const defaultFetch = async (url, options = {}) => {
  const { headers, ...rest } = options;
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json', ...headers },
    ...rest,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return parseResponse(res);
};

export const tokenFetch = async (url, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const { headers, ...rest } = options;

  let response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    ...rest,
  });

  if (response.status === 401) {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const { accessToken } = await refreshResponse.json();
        localStorage.setItem('accessToken', accessToken);
        response = await fetch(`${BASE_URL}${url}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            ...headers,
          },
          ...rest,
        });
      }
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
    }
  }

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return parseResponse(response);
};

export const dynamicFetch = async (url, options = {}) => {
  const { headers, ...rest } = options;
  const res = await fetch(`${BASE_URL}${url}`, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...headers },
    ...rest,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return parseResponse(res);
};
