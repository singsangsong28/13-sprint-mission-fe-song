import { tokenFetch } from './fetchClient';

export const userService = {
  getMe: () => tokenFetch('/users/me'),
};
