"use client";

import { useEffect, useState } from "react"; // importerer useEffect og useState fra react
import { useParams, useRouter } from "next/navigation"; // importerer useParams og useRouter fra next/navigation
import Link from "next/link"; // importerer Link fra next/link
import { supabase } from "../../../lib/supabaseClient"; // importerer supabase fra ../../../lib/supabaseClient

export default function GuideDetailPage() {
  const { id } = useParams(); // id fra URL
  const router = useRouter(); // router fra next/navigation

  const [guide, setGuide] = useState(null); // lagrer guide i state
  const [loading, setLoading] = useState(true); // lagrer loading i state
  const [error, setError] = useState(null); // lagrer error i state

  useEffect(() => {
    async function loadGuide() { // funksjon for å laste guide
      if (!supabase) { // hvis supabase ikke er satt
        setError("Supabase is not set."); // setter error til "Supabase is not set." 
        setLoading(false); // setter loading til false
        return;
      }

      const { data, error } = await supabase // henter data og error fra supabase
        .from("guides") // henter data fra guides tabellen
        .select( // henter data fra guides tabellen feltene vi trenger
          `
          id,
          title,
          summary,
          content,
          category,
          order_index,
          games!inner (
            id,
            slug,
            title
          )
        `
        )
        .eq("id", id) // finn riktig guide
        .single();

      if (error || !data) { // hvis det er en error eller data ikke er satt
        console.error(error); // printer error
        setError("Could not find this guide."); // setter error til "Could not find this guide."
        setLoading(false); // setter loading til false
        return;
      }

      setGuide(data); // setter guide til data
      setLoading(false); // setter loading til false
    }

    if (id) { // hvis id er satt
      loadGuide();
    }
  }, [id]);

  if (loading) { // hvis loading er true
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading guide...{/* laster guide */}
      </div>
    );
  }

  if (error) { // hvis error er true
    return (
      <div className="glass rounded-lg p-4 text-sm text-destructive-foreground">
        {error}{/* feilmelding */}
      </div>
    );
  }

  if (!guide) { // hvis guide ikke er satt
    return null; // returnerer null
  }

  const game = guide.games; // henter spillet fra guide games tabellen

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Top bar with back navigation */}{/* topp bar med tilbakeknapp */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← Back{/* tilbake */}
        </button>

        {game?.slug && (
          <Link
            href={`/games/${game.slug}`} // lenker til spillet
            className="text-xs text-primary hover:underline"
          >
            View game page{/* vis spilleside */}
          </Link>
        )}
      </div>

      {/* Header */}{/* header */}
      <header className="glass rounded-xl border border-border/60 bg-card/80 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          {guide.category || "Guide"}{/* kategori */}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gradient-gold glow-red">
          {guide.title}{/* tittel */}
        </h1>
        {game?.title && (
          <p className="mt-2 text-xs text-muted-foreground">
            for{" "}{/* for */}
            <Link
              href={`/games/${game.slug}`} // lenker til spillet
              className="font-medium text-foreground hover:underline"
            >
              {game.title}{/* spilltittel */}
            </Link>
          </p>
        )}
        {guide.summary && (
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            {guide.summary}{/* oppsummering */}
          </p>
        )}
      </header>

      {/* Content */}
      <section className="glass prose prose-invert max-w-none rounded-xl border border-border/60 bg-secondary/70 p-5 text-sm leading-relaxed">
        {/* content is stored as markdown-like text in the SQL script; simple rendering as paragraphs/line breaks */}
        {guide.content ? (
          <article className="whitespace-pre-wrap">{guide.content}</article>
        ) : (
          <p className="text-muted-foreground">
            This guide does not have any detailed content yet.{/* denne guiden har ikke noe detaljert innhold enda. */}
          </p>
        )}
      </section>
    </div>
  );
}

