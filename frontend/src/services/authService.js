import { apiJson } from "./api";

export function login(credentials) {
  return apiJson("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function getMe() {
  return apiJson("/auth/me");
}

export function logout() {
  return apiJson("/auth/logout", {
    method: "POST",
  });
}