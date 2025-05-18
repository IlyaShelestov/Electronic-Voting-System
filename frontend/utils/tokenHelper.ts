export const TOKEN_KEY = "token";

export const getAuthToken = (): string | null => {
    const match = document.cookie.match(new RegExp(`(^| )${TOKEN_KEY}=([^;]+)`));
    return match ? match[2] : null;
};

export const setAuthToken = (token: string) => {
    document.cookie = `${TOKEN_KEY}=${token}; Path=/; Secure; SameSite=Strict;`;
};

export const removeAuthToken = () => {
    document.cookie = `${TOKEN_KEY}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Max-Age=0; Secure; SameSite=Strict;`;
};

export const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp;
        if (!exp) return true;
        return Date.now() >= exp * 1000;
    } catch (e) {
        return true;
    }
};
