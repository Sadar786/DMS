import { apiJson } from "./api";

export function getSales(query = "") {
  return apiJson(`/sales${query}`);
}


export function createSale(data) {
  return apiJson("/sales", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getSale(id) {
  return apiJson(`/sales/${id}`);
}

export function updateSale(id, data) {
  return apiJson(`/sales/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}