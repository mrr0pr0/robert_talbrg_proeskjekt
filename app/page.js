 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadGames() {
      if (!supabase) {
        setError("Something went wrong. Please try again later.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("games")
        .select(
          "id, slug, title, short_description, cover_image_url, release_year"
        )
        .order("title", { ascending: true });

      if (error) {
        console.error(error);
        setError("Could not load games. Please try again later.");
      } else {
        setGames(data || []);
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
          Browse the available games and open detailed guides with interactive
          maps, tips and useful information for each title.
        </p>
      </header>

      {loading && (
        <div className="glass flex items-center justify-center rounded-lg p-6 text-sm text-muted-foreground">
          Loading games...
        </div>
      )}

      {error && (
        <div className="glass border-destructive/70 bg-destructive/20 text-destructive-foreground rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && games.length === 0 && (
        <div className="glass rounded-lg p-6 text-sm text-muted-foreground">
          No games are available right now. Please check back later.
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

