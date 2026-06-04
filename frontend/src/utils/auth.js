import axios from "axios";
import { explainError } from "./utils";
import { toast } from "react-toastify";

const BACKEND = import.meta.env.VITE_API;

export function isValidUsername(username) {
  const value = username?.trim() ?? "";
  if (!/^[A-Za-z]/.test(value)) return false;
  if (!/[A-Za-z]/.test(value)) return false;
  return /^[A-Za-z0-9_]+$/.test(value);
}

export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function getToken() {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  if (isTokenExpired(token)) {
    console.warn("access token expired");
    clearToken();
    return null;
  }
  return token;
}

export async function postAuth(method, req) {
  try {
    const response = await axios.post(`http://${BACKEND}/auth/${method}`, req);

    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("username", response.data.username);
    
    console.log("login successful.");
    toast.success("login successful.");
  } catch (err) {
    console.error(err.message);
    toast.error(explainError(err));
    return false;
  }
  return true;
}