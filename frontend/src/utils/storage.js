const TOKEN_KEY = "dms_token";

export const saveToken = (token) =>
  localStorage.setItem(TOKEN_KEY, token);

export const getToken = () =>
  localStorage.getItem(TOKEN_KEY);

export const removeToken = () =>
  localStorage.removeItem(TOKEN_KEY);