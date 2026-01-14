"use client";

import { useEffect, useState } from "react"; //henter react components
import Link from "next/link"; // henter link component
import { supabase } from "../lib/supabaseClient"; // henter supabase client

export default function Home() { // hovedkomponenten for home siden med å lage en liste av spill fra supabase
  const [games, setGames] = useState([]); // state for spillene
  const [loading, setLoading] = useState(true); // state for loading
  const [error, setError] = useState(null); // state for feil

  useEffect(() => {
    async function loadGames() { // funksjon for å laste spillene fra supabase
      if (!supabase) {
        setError("Supabase is not configured yet."); // setter feilmelding hvis supabase ikke er konfigurert
        setLoading(false); // setter loading til false
        return; // returner hvis supabase ikke er konfigurert
      }

      const { data, error } = await supabase // henter spillene fra supabase
        .from("games")
        .select(
          "id, slug, title, short_description, cover_image_url, release_year" // henter spillene fra supabase
        )
        .order("title", { ascending: true }); // sorter spillene etter tittel

      if (error) { // hvis det er en feil
        console.error(error);
        setError("Failed to load games from Supabase.");
      } else {
        setGames(data || []); // settes spillene til data
      }
      setLoading(false);
    }

    loadGames();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3 border-b border-border/60 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Game Selection
        </p>
        <h2 className="text-3xl font-bold text-gradient-primary glow-red">
          Choose a game to view guides & maps
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          This hub lists all games stored in your Supabase{" "}
          <span className="font-mono text-foreground/90">games</span> table.
          Selecting a game opens a layout similar to the RE4 guide with
          sections for guides and an interactive map.
        </p>
      </header>

      {loading && (
        <div className="glass flex items-center justify-center rounded-lg p-6 text-sm text-muted-foreground">
          Loading games from Supabase...
        </div>
      )}

      {error && (
        <div className="glass border-destructive/70 bg-destructive/20 text-destructive-foreground rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && games.length === 0 && (
        <div className="glass rounded-lg p-6 text-sm text-muted-foreground">
          No games found yet. Add rows to your{" "}
          <span className="font-mono text-foreground/90">games</span> table in
          Supabase and refresh this page.
        </div>
      )}

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.slug}`}
            className="group gradient-border card-lift flex flex-col overflow-hidden rounded-xl"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              {game.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={game.cover_image_url}
                  alt={game.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary/70 text-xs text-muted-foreground">
                  No cover image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
            </div>
            <div className="flex flex-1 flex-col justify-between p-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
                  {game.title}
                </h3>
                {game.release_year && (
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {game.release_year}
                  </p>
                )}
                {game.short_description && (
                  <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                    {game.short_description}
                  </p>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-primary">
                <span className="font-medium">Open guides & map</span>
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

