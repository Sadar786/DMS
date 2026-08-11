import { apiJson } from "./api";

export function getProducts(query = "") {
  return apiJson(`/products${query}`);
}

export function getProduct(id) {
  return apiJson(`/products/${id}`);
}

export function createProduct(data) {
  return apiJson("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProduct(id, data) {
  return apiJson(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id) {
  return apiJson(`/products/${id}`, {
    method: "DELETE",
  });
}