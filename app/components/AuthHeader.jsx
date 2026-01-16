"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearSession, getSession } from "../../lib/auth";

export default function AuthHeader() { // lager en AuthHeader komponent
  const [session, setSession] = useState(() => getSession()); // lager en session variabel

  useEffect(() => {
    function onStorage(e) { // lager en onStorage funksjon
      if (e.key === "app_session_v1") setSession(getSession());
    }
    window.addEventListener("storage", onStorage); // lager en event listener for storage
    return () => window.removeEventListener("storage", onStorage); // fjerner event listener for storage
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

