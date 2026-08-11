import { apiJson } from "./api";

export function createPayment(data) {
  return apiJson("/payments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getPaymentReport(query = "") {
  return apiJson(`/reports/payments${query}`);
}

export function getSalesReport(query = "") {
  return apiJson(`/reports/sales${query}`);
}
