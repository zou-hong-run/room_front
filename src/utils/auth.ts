const ACCESS_TOKEN_KEY = 'REDRUN_ACCESS_TOKEN';
const REFRESH_TOKEN_KEY = 'REDRUN_REFRESH_TOKEN';

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};
export const setAccessToken = (token: string) => {
  return localStorage.setItem(ACCESS_TOKEN_KEY, token);
};
export const removeAccessToken = () => {
  return localStorage.removeItem(ACCESS_TOKEN_KEY);
};
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};
export const setRefreshToken = (token: string) => {
  return localStorage.setItem(REFRESH_TOKEN_KEY, token);
};
export const removeRefreshToken = () => {
  return localStorage.removeItem(REFRESH_TOKEN_KEY);
};
