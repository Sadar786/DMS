import { apiJson } from "./api";

export function getCustomerLedger(customerId, query = "") {
  return apiJson(`/reports/customer/${customerId}${query}`);
}
