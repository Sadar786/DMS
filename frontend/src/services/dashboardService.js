import { apiJson } from "./api";

export function getDashboard() {
  return apiJson("/dashboard");
}
