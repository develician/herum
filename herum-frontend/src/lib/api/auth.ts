import axios from 'axios';

export const checkEmailExists = (email: string) => axios.get(`/api/auth/exists/email/${email}`);

export const checkUsernameExists = (username: string) =>
  axios.get(`/api/auth/exists/username/${username}`);

type LocalRegisterPayload = { email: string; username: string; password: string };
export const localRegister = (payload: LocalRegisterPayload) =>
  axios.post(`/api/auth/register/local`, payload);

type LocalLoginPayload = { email: string; password: string };
export const localLogin = (payload: LocalLoginPayload) =>
  axios.post(`/api/auth/login/local`, payload);

export const checkStatus = () => axios.get('/api/auth/check');
export const logout = () => axios.post('/api/auth/logout');
