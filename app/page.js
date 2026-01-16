 "use client";

import { useEffect, useState } from "react"; // importerer useEffect og useState fra react
import Link from "next/link"; // importerer Link fra next/link
import { supabase } from "../lib/supabaseClient"; // importerer supabase fra ../lib/supabaseClient

export default function Home() {
  const [games, setGames] = useState([]); // lagrer spillene i state
  const [loading, setLoading] = useState(true); // lagrer loading i state
  const [error, setError] = useState(null); // lagrer error i state

  useEffect(() => {
    async function loadGames() { // funksjon for å laste spillene
      if (!supabase) {
        setError("error loading games"); // setter error til "error loading games"
        setLoading(false); // setter loading til false
        return;
      }

      const { data, error } = await supabase // henter data og error fra supabase
        .from("games") // henter data fra games tabellen
        .select(
          "id, slug, title, short_description, cover_image_url, release_year"
        ) // henter data fra games tabellen
        .order("title", { ascending: true });

      if (error) {
        console.error(error); // printer error
        setError("error loading games"); // setter error til "error loading games"
      } else {
        setGames(data || []); // setter games til data
      }
      setLoading(false); // setter loading til false
    }

    loadGames(); // kaller funksjonen for å laste spillene
  }, []);

  return ( // returnerer en div med flex flex-col gap-8
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3 border-b border-border/60 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Game Selection {/* spillevalg */}
        </p>
        <h2 className="text-3xl font-bold text-gradient-gold glow-red">
          veiw guides & maps {/* vis guider og kart */}
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          look at the games and guides for each game with Interactive maps {/* se spillene og guider for hvert spill med interaktive kart */}
        </p>
      </header>

      {loading && (
        <div className="glass flex items-center justify-center rounded-lg p-6 text-sm text-muted-foreground">
          loading games... {/* laster spillene */}
        </div>
      )}

      {error && (
        <div className="glass border-destructive/70 bg-destructive/20 text-destructive-foreground rounded-lg p-4 text-sm">
          {error} {/* feilmelding */}
        </div>
      )}

      {!loading && !error && games.length === 0 && (
        <div className="glass rounded-lg p-6 text-sm text-muted-foreground">
          No games {/* ingen spill */}
        </div>
      )}
  
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => ( // mapper over spillene
          <Link
            key={game.id}
            href={`/games/${game.slug}`}
            className="group gradient-border card-lift flex flex-col overflow-hidden rounded-xl"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              {game.cover_image_url ? (
                // elslint for å skjule advarsel om img element
                <img
                  src={game.cover_image_url}
                  alt={game.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary/70 text-xs text-muted-foreground">
                  No cover image {/* ingen cover-bilde */}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
            </div>
            <div className="flex flex-1 flex-col justify-between p-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
                  {game.title} {/* tittel */}
                </h3>
                {game.release_year && (
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {game.release_year} {/* utgivelsesår */}
                  </p>
                )}
                {game.short_description && (
                  <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                    {game.short_description} {/* kort beskrivelse */}
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

