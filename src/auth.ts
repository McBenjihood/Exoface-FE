import type { User } from "./api";

export function saveUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser(): User | null {
  return JSON.parse(localStorage.getItem("user") ?? "null");
}

export function logout() {
  localStorage.removeItem("user");
}
