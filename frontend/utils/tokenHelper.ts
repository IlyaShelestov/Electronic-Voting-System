export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export const setAuthToken = (token: string) => {
  document.cookie = `token=${token}; Path=/; Secure; SameSite=Strict;`;
  localStorage.setItem("token", token);
};

export const removeAuthToken = () => {
  document.cookie =
    "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Max-Age=0; Secure; SameSite=Strict;";
  localStorage.removeItem("token");
};
