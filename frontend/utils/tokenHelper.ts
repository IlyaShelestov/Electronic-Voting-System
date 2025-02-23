export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export const setAuthToken = (token: string) => {
  document.cookie = `token=${token}; path=/;`;
  localStorage.setItem("token", token);
};

export const removeAuthToken = () => {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  localStorage.removeItem("token");
};
