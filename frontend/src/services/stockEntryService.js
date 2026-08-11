import { apiJson } from "./api";

export function getStock(query = "") {
  return apiJson(`/stock-entries${query}`);
}

export function getStockEntry(id) {
  return apiJson(`/stock-entries/${id}`);
}

export function createStockEntry(data) {
  return apiJson("/stock-entries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteStockEntry(id) {
  return apiJson(`/stock-entries/${id}`, {
    method: "DELETE",
  });
}