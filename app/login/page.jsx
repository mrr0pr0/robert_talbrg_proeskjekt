"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithSha256, signUpWithSha256 } from "../../lib/auth"; // importerer signInWithSha256 og signUpWithSha256 fra ../../lib/auth

export default function LoginPage() {
  const router = useRouter(); // lager en router variabel
  const [mode, setMode] = useState("signin"); // signin | signup
  const [username, setUsername] = useState(""); // lager en username variabel
  const [password, setPassword] = useState(""); // lager en password variabel
  const [loading, setLoading] = useState(false); // lager en loading variabel
  const [error, setError] = useState(""); // lager en error variabel

  async function onSubmit(e) { // lager en onSubmit funksjon
    e.preventDefault();
    setError("");
    setLoading(true); // setter loading til true
    try { // prøver å logge inn eller registrere bruker
      if (mode === "signup") { // hvis mode er signup
        await signUpWithSha256({ username, password });
      } else { // hvis mode er signin
        await signInWithSha256({ username, password });
      }
      router.push("/"); // går til forsiden
      router.refresh(); // refresher siden
    } catch (err) {
      setError(err?.message || "Something went wrong"); // setter error til err?.message eller "Something went wrong"
    } finally {
      setLoading(false); // setter loading til false
    }
  }

  return ( // lager en return funksjon
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <header className="space-y-2 border-b border-border/60 pb-4"> {/* lager en header komponent */}
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Account
        </p>
        <h1 className="text-2xl font-bold text-gradient-gold glow-red-sm"> {/* lager en h1 komponent */}
          {mode === "signup" ? "Lag bruker" : "Logg inn"}
        </h1>
        <p className="text-sm text-muted-foreground"> {/* lager en p komponent */}
          Passord blir SHA-256 hashed i nettleseren før det sjekkes i databasen.
        </p>
      </header> {/* lager en header komponent */}

      <form onSubmit={onSubmit} className="glass flex flex-col gap-4 rounded-xl p-5">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Username 
          </span>
          <input // lager en input komponent
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-md border border-border bg-background/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            autoComplete="username"
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Password
          </span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)} // setter password til e.target.value
            type="password"
            className="rounded-md border border-border bg-background/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
          />
        </label>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/20 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <button // lager en button komponent
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            type="submit"
          >
            {loading // hvis loading er true
              ? "Loading..." // viser "Loading..."
              : mode === "signup"
                ? "Lag bruker" // viser "Lag bruker"
                : "Logg inn"}
          </button>

          <button // lager en button komponent
            type="button"
            onClick={() => { // lager en onClick funksjon
              setError("");
              setMode((m) => (m === "signin" ? "signup" : "signin")); // setter mode til signup eller signin
            }}
            className="text-sm text-muted-foreground hover:underline"
          >
            {mode === "signup" // hvis mode er signup
              ? "Har du bruker? Logg inn"
              : "Ny her? Lag bruker"} {/* viser "Har du bruker? Logg inn" eller "Ny her? Lag bruker" */}
          </button>
        </div>
      </form>
    </div>
  );
}

