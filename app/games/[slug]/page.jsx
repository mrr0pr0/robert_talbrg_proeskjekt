"use client"; // klient-komponent

import { useEffect, useState } from "react"; // react hooks
import { useParams } from "next/navigation"; // henter url-parametre
import Link from "next/link";
import dynamic from "next/dynamic"; // dynamisk import
import { supabase } from "../../../lib/supabaseClient"; // supabase-klient

const LeafletImageMap = dynamic(() => import("./LeafletImageMap"), {
  ssr: false, // bare på klient, ikke server-render
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
      Loading interactive map...
    </div>
  ), // vises mens kartet laster
});

function GuidesList({ guides }) { // liste med tekst-guider
  if (!guides.length) { // ingen guider enda
    return (
      <div className="glass rounded-lg p-4 text-sm text-muted-foreground">
        No guides created yet for this game. Add rows to the{" "}
        <span className="font-mono text-foreground/90">guides</span> table in
        Supabase.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {guides.map((guide) => ( // render én artikkel per guide
        <Link
          key={guide.id}
          href={`/guides/${guide.id}`}
          className="block rounded-lg border border-border/60 bg-secondary/70 p-3 text-sm transition-colors hover:border-primary/40"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {guide.category || "Guide"}
          </p>
          <h3 className="mt-1 text-base font-semibold text-foreground">
            {guide.title}
          </h3>
          {guide.summary && ( // bare hvis oppsummering finnes
            <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">
              {guide.summary}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}

function InteractiveMap({ game, markers }) { // wrapper rundt kartet
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Interactive Map
          </p>
          <h3 className="text-lg font-bold text-foreground">
            {game.title} Map
          </h3>
        </div>
        <p className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
          {markers.length} markers{/* teller hvor mange markører */}
        </p>
      </div>

      {/* Fast 16:9-forhold gjør at kartet ser mindre "strukket" ut og holder en
          mer naturlig høyde uansett skjermstørrelse. */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/60 bg-secondary">
        <LeafletImageMap game={game} markers={markers} />{/* selve kart-komponenten */}
      </div>
    </div>
  );
}

export default function GameDetailPage() { // hovedside for ett spill
  const { slug } = useParams(); // slug fra URL
  const [game, setGame] = useState(null); // lagrer spillet
  const [guides, setGuides] = useState([]); // lagrer guider
  const [markers, setMarkers] = useState([]); // lagrer kart-markører
  const [loading, setLoading] = useState(true); // loader-state
  const [error, setError] = useState(null); // feil-melding

  useEffect(() => {
    async function loadGame() { // henter data fra supabase
      if (!supabase) { // hvis klienten ikke er satt opp
        setError("Supabase is not sett.");
        setLoading(false);
        return;
      }

      const { data: gameData, error: gameError } = await supabase
        .from("games")
        .select(
          "id, slug, title, subtitle, description, cover_image_url, map_image_url"
        ) // feltene vi trenger
        .eq("slug", slug) // finn riktig spill
        .single(); // forventer én rad

      if (gameError || !gameData) { // hvis ikke fant spill
        console.error(gameError);
        setError("Could not find this game 404 error");
        setLoading(false);
        return;
      }

      setGame(gameData); // lagre spillet

      const [{ data: guidesData }, { data: markersData }] = await Promise.all([
        supabase
          .from("guides")
          .select("id, title, summary, category, order_index")
          .eq("game_id", gameData.id)
          .order("order_index", { ascending: true }), // sortert på rekkefølge
        supabase
          .from("map_markers")
          .select(
            "id, label, description, x_percent, y_percent, category, order_index"
          )
          .eq("game_id", gameData.id)
          .order("order_index", { ascending: true }), // sortert på kartet også
      ]);

      setGuides(guidesData || []); // fallback til tom liste
      setMarkers(markersData || []);
      setLoading(false); // ferdig lastet
    }

    if (slug) { // bare hvis vi har slug
      loadGame();
    }
  }, [slug]); // kjør når slug endrer seg

  if (loading) { // viser loader
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading game...
      </div>
    );
  }

  if (error) { // viser feil
    return (
      <div className="glass rounded-lg p-4 text-sm text-destructive-foreground">
        {error}
      </div>
    );
  }

  if (!game) { // sikkerhet, ingenting å vise
    return null;
  }

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Game header spillekartet */}
      <section className="relative overflow-hidden rounded-xl border border-border/60 bg-card/80">
        <div className="relative grid gap-4 p-4 md:grid-cols-[2fr,3fr] md:p-6">
          <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg border border-border/50 bg-secondary/60">
            {game.cover_image_url ? ( // viser cover-bilde hvis det finnes
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={game.cover_image_url}
                alt={game.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                No cover image
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Game Guide
              </p>
              <h2 className="text-3xl font-bold text-gradient-primary glow-red">
                {game.title}
              </h2>
              {game.subtitle && ( // valgfri under-tittel
                <p className="text-sm text-muted-foreground">{game.subtitle}</p>
              )}
            </div>

            {game.description && ( // valgfri beskrivelse
              <p className="max-w-prose text-sm text-muted-foreground">
                {game.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-secondary px-3 py-1">
                {guides.length} guides{/* antall guider */}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1">
                {markers.length} map markers{/* antall markører */}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Two-column layout: guides list + interactive map */}
      <section className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[2fr,3fr]">
        <div className="glass rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Guides
          </p>
          <h3 className="mt-2 text-lg font-bold text-foreground">
            Main walkthrough & categories
          </h3>
          <p className="mb-3 mt-1 text-xs text-muted-foreground">
            Each row in the{" "}
            <span className="font-mono text-foreground/90">guides</span> table
            read the game and what the guide is about{" "}
            <span className="font-mono text-foreground/90">category</span>{" "}
            field.
          </p>
          <GuidesList guides={guides} />{/* liste med alle guider som hentes fra supabase */}
        </div>

        <div className="glass rounded-xl p-4">
          <InteractiveMap game={game} markers={markers} />{/* kart med markører som hentes fra supabase */}
        </div>
      </section>
    </div>
  );
}

