import type { User } from "./api";
import { decodeToken } from "./api";

const USER_KEY = "user";
const TOKEN_KEY = "token";

export function saveSession(user: User, token: string) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
        const { exp } = decodeToken(token);
        if (exp * 1000 < Date.now()) {
            logout();
            return null;
        }
    } catch {
        logout();
        return null;
    }
    return token;
}

export function getUser(): User | null {
    const roh = localStorage.getItem(USER_KEY);
    if (!roh) return null;
    if (!getToken()) return null;
    return JSON.parse(roh) as User;
}

export function authHeader(): Record<string, string> {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export function logout() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
}