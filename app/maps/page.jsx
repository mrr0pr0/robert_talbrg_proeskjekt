"use client";

import { useEffect, useState } from "react"; // importerer useEffect og useState fra react
import Link from "next/link"; // importerer Link fra next/link
import { supabase } from "../../lib/supabaseClient"; // importerer supabase fra ../../lib/supabaseClient

export default function MapsOverviewPage() {
  const [games, setGames] = useState([]); // lagrer spillene i state
  const [loading, setLoading] = useState(true); // lagrer loading i state
  const [error, setError] = useState(null); // lagrer error i state

  useEffect(() => {
    async function loadGamesWithMaps() { // funksjon for å laste spillene med kart
      if (!supabase) {
        setError("error loading maps"); // setter error til "error loading maps"
        setLoading(false); // setter loading til false
        return;
      }

      const { data, error } = await supabase // henter data og error fra supabase
        .from("games") // henter data fra games tabellen
        .select("id, slug, title, short_description, map_image_url") // henter data fra games tabellen  feltene vi trenger
        .not("map_image_url", "is", null)
        .order("title", { ascending: true }); // sorter data på title

      if (error) { // hvis det er en error
        console.error(error); // printer error
        setError("error loading maps"); // setter error til "error loading maps"
      } else { // hvis det ikke er en error
        setGames(data || []); // setter games til data
      }
      setLoading(false); // setter loading til false
    }

    loadGamesWithMaps(); // kaller funksjonen for å laste spillene med kart
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3 border-b border-border/60 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Interactive Maps{/* interaktive kart */}
        </p>
        <h2 className="text-3xl font-bold text-gradient-primary glow-red">
          view interactive maps for your games{/* vis interaktive kart for spillene */}
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Each game here has an interactive map. {/* hvert spill har et interaktivt kart */}
        </p>
      </header>

      {loading && ( // hvis loading er true
        <div className="glass flex items-center justify-center rounded-lg p-6 text-sm text-muted-foreground">
          loading maps...{/* laster kart */}
        </div>
      )}

      {error && ( // hvis error er true
        <div className="glass border-destructive/70 bg-destructive/20 text-destructive-foreground rounded-lg p-4 text-sm">
          {error}{/* feilmelding */}
        </div>
      )}

      {!loading && !error && games.length === 0 && ( // hvis loading er false og error er false og games.length er 0
        <div className="glass rounded-lg p-6 text-sm text-muted-foreground">
          No interactive maps yet. Add{" "}
          <span className="font-mono text-foreground/90">map_image_url</span> to
          your games in Supabase to show them here.{/* tabellen games i supabase */}
        </div>
      )}

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => ( // render én kort per spill
          <Link
            key={game.id}
            href={`/games/${game.slug}`} // lenker til spillssiden
            className="group gradient-border card-lift flex flex-col overflow-hidden rounded-xl"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              {game.map_image_url ? ( // hvis det er et kart-bilde
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={game.map_image_url}
                  alt={`${game.title} map`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary/70 text-xs text-muted-foreground">
                  No map image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
            </div>
            <div className="flex flex-1 flex-col justify-between p-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
                  {game.title}
                </h3>
                {game.short_description && (
                  <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                    {game.short_description}
                  </p>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-primary">
                <span className="font-medium">Open interactive map</span>
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

