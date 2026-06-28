import { tokenFetch } from './fetchClient';

export const userService = {
  getMe: () => tokenFetch('/users/me'),
  updateMe: (data) => tokenFetch('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
};
