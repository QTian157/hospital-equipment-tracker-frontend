import { apiFetch } from "./apiClient";

export const loginUser = async (username, password) => {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
  });
};

export const registerUser = async (registerData) => {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(registerData),
  });
};