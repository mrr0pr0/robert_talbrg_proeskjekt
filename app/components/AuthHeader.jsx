"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearSession, getSession } from "../../lib/auth";

export default function AuthHeader() { // lager en AuthHeader komponent
  const [session, setSession] = useState(null); // lager en session variabel, starter med null for å unngå hydration mismatch

  useEffect(() => {
    // Load session after mount to avoid hydration mismatch
    // Using setTimeout to defer state update and satisfy linter
    const timer = setTimeout(() => {
      setSession(getSession());
    }, 0);

    function onStorage(e) { // lager en onStorage funksjon
      if (e.key === "app_session_v1") setSession(getSession());
    }
    function onSessionChanged(e) { // lager en onSessionChanged funksjon
      setSession(e.detail);
    }
    window.addEventListener("storage", onStorage); // lager en event listener for storage
    window.addEventListener("app_session_changed", onSessionChanged); // lager en event listener for app_session_changed
    return () => {
      clearTimeout(timer);
      window.removeEventListener("storage", onStorage); // fjerner event listener for storage
      window.removeEventListener("app_session_changed", onSessionChanged); // fjerner event listener for app_session_changed
    };
  }, []);

  if (!session) { // hvis session ikke er satt
    return (
      <Link // lager en Link komponent
        href="/login"
        className="rounded-md bg-secondary/70 px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary/60" // lager en className variabel
      >
        Logg inn
      </Link> // lager en Link komponent
    );
  }

  return ( // lager en return funksjon
    <div className="flex items-center gap-3"> {/* lager en div komponent */}
      <span className="text-xs text-muted-foreground"> {/* lager en span komponent */}
        Logget inn som{" "}
        <span className="font-semibold text-foreground">{session.username}</span> {/* lager en span komponent */}
      </span>
      <button // lager en button komponent
        type="button"
        onClick={() => { // lager en onClick funksjon
          clearSession();
          setSession(null);
        }} // fjerner session
        className="rounded-md bg-secondary/70 px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary/60" // lager en className variabel
      >
        Logg ut
      </button> {/* lager en button komponent */}
    </div>
  );
}

