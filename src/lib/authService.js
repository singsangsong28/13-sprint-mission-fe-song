import { defaultFetch } from './fetchClient';

export const authService = {
  login: async (email, password) => {
    const data = await defaultFetch('/auth/signIn', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  register: (formData) =>
    defaultFetch('/auth/signUp', { method: 'POST', body: JSON.stringify(formData) }),
};
