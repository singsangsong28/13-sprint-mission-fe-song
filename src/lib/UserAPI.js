import { defaultFetch } from './fetchClient';

export const getMe = (token) =>
  defaultFetch('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
