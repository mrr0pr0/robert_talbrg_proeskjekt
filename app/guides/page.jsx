"use client";

import { useEffect, useState } from "react"; // importerer useEffect og useState fra react
import Link from "next/link"; // importerer Link fra next/link
import { supabase } from "../../lib/supabaseClient"; // importerer supabase fra ../../lib/supabaseClient

export default function GuidesOverviewPage() {
  const [guides, setGuides] = useState([]); // lagrer guider i state
  const [loading, setLoading] = useState(true); // lagrer loading i state
  const [error, setError] = useState(null); // lagrer error i state

  useEffect(() => {
    async function loadGuides() { // funksjon for å laste guider
      if (!supabase) {
        setError("error loading guides"); // setter error til "error loading guides"
        setLoading(false); // setter loading til false
        return;
      }

      const { data, error } = await supabase // henter data og error fra supabase
        .from("guides") // henter data fra guides tabellen
        .select( // henter data fra guides tabellen
          `
          id,
          title,
          summary,
          category,
          order_index,
          games!inner (
            id,
            slug,
            title
          )
        `
        )
        .order("order_index", { ascending: true }); // sorter data på order_index

      if (error) { // hvis det er en error
        console.error(error); // printer error
        setError("error loading guides"); // setter error til "error loading guides"
      } else { // hvis det ikke er en error
        setGuides(data || []); // setter guides til data
      }
      setLoading(false); // setter loading til false
    }

    loadGuides(); // kaller funksjonen for å laste guider
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3 border-b border-border/60 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Text Guides{/* tekstguider */}
        </p>
        <h2 className="text-3xl font-bold text-gradient-gold glow-red">
          view all text guides{/* vis alle tekstguider */}
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A list of all guides across your games. {/* en liste med alle guider på alle spillene og en interaktiv kart */}
        </p>
      </header>

      {loading && ( // hvis loading er true
        <div className="glass flex items-center justify-center rounded-lg p-6 text-sm text-muted-foreground">
          loading guides...{/* laster guider */}
        </div>
      )}

      {error && ( // hvis error er true
        <div className="glass border-destructive/70 bg-destructive/20 text-destructive-foreground rounded-lg p-4 text-sm">
          {error}{/* feilmelding */}
        </div>
      )}

      {!loading && !error && guides.length === 0 && ( // hvis loading er false og error er false og guides.length er 0
        <div className="glass rounded-lg p-6 text-sm text-muted-foreground">
          No guides yet. Add rows to the{" "}
         
        </div>
      )}

      <section className="space-y-3">
        {guides.map((guide) => {
          const game = guide.games;

          return (
            <Link
              key={guide.id}
              href={game?.slug ? `/games/${game.slug}` : "#"}
              className="group glass-hover block rounded-lg border border-border/60 bg-secondary/70 p-4 text-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {guide.category || "Guide"}
                  </p>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary">
                    {guide.title}
                  </h3>
                  {game?.title && (
                    <p className="text-xs text-muted-foreground">
                      for{" "}
                      <span className="font-medium text-foreground">
                        {game.title}
                      </span>
                    </p>
                  )}
                  {guide.summary && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {guide.summary}
                    </p>
                  )}
                </div>
                <span className="mt-1 text-xs text-primary transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}

