import { supabase } from "./supabaseClient";

const SESSION_KEY = "app_session_v1";

export async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function getSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  // Dispatch custom event so components can update immediately
  window.dispatchEvent(new CustomEvent("app_session_changed", { detail: session }));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  // Dispatch custom event so components can update immediately
  window.dispatchEvent(new CustomEvent("app_session_changed", { detail: null }));
}

export async function signUpWithSha256({ username, password }) {
  if (!supabase) throw new Error("Supabase not configured");
  const passwordHash = await sha256Hex(password);
  const { data, error } = await supabase.rpc("create_user", {
    p_username: username,
    p_password_hash: passwordHash,
  });
  if (error) {
    // Surface the custom error from SQL (username_taken)
    throw new Error(error.message || "Sign up failed");
  }
  const session = { userId: data, username };
  setSession(session);
  return session;
}

export async function signInWithSha256({ username, password }) {
  if (!supabase) throw new Error("Supabase not configured");
  const passwordHash = await sha256Hex(password);
  const { data, error } = await supabase.rpc("verify_login", {
    p_username: username,
    p_password_hash: passwordHash,
  });
  if (error) throw new Error(error.message || "Login failed");
  if (!data) throw new Error("Wrong username or password");
  const session = { userId: data, username };
  setSession(session);
  return session;
}

