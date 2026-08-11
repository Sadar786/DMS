// src/services/api.js

import { getToken } from "../utils/storage";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL;

export async function apiJson(
  path,
  options = {}
) {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
        ...options.headers,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}