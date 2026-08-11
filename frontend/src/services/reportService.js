import { apiJson } from "./api";

export function getBusinessAnalytics(query = "") {
  return apiJson(`/reports/analytics${query}`);
}
