"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

function GuidesList({ guides }) {
  if (!guides.length) {
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
      {guides.map((guide) => (
        <article
          key={guide.id}
          className="glass-hover rounded-lg border border-border/60 bg-secondary/70 p-3 text-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {guide.category || "Guide"}
          </p>
          <h3 className="mt-1 text-base font-semibold text-foreground">
            {guide.title}
          </h3>
          {guide.summary && (
            <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">
              {guide.summary}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}

function InteractiveMap({ game, markers }) {
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
          {markers.length} markers
        </p>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-lg border border-border/60 bg-secondary">
        {/* Background map image */}
        {game.map_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.map_image_url}
            alt={`${game.title} map`}
            className="h-full w-full object-cover opacity-80"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Add a{" "}
            <span className="mx-1 font-mono text-foreground/90">
              map_image_url
            </span>{" "}
            for this game in Supabase to show a background map image.
          </div>
        )}

        {/* Markers overlay */}
        <div className="pointer-events-none absolute inset-0">
          {markers.map((marker) => (
            <button
              key={marker.id}
              type="button"
              className="pointer-events-auto group absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground shadow-lg shadow-primary/40"
              style={{
                left: `${marker.x_percent}%`,
                top: `${marker.y_percent}%`,
              }}
              title={marker.label}
            >
              {marker.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GameDetailPage() {
  const { slug } = useParams();
  const [game, setGame] = useState(null);
  const [guides, setGuides] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadGame() {
      if (!supabase) {
        setError("Supabase is not configured yet.");
        setLoading(false);
        return;
      }

      const { data: gameData, error: gameError } = await supabase
        .from("games")
        .select(
          "id, slug, title, subtitle, description, cover_image_url, map_image_url"
        )
        .eq("slug", slug)
        .single();

      if (gameError || !gameData) {
        console.error(gameError);
        setError("Could not find this game in Supabase.");
        setLoading(false);
        return;
      }

      setGame(gameData);

      const [{ data: guidesData }, { data: markersData }] = await Promise.all([
        supabase
          .from("guides")
          .select("id, title, summary, category, order_index")
          .eq("game_id", gameData.id)
          .order("order_index", { ascending: true }),
        supabase
          .from("map_markers")
          .select(
            "id, label, description, x_percent, y_percent, category, order_index"
          )
          .eq("game_id", gameData.id)
          .order("order_index", { ascending: true }),
      ]);

      setGuides(guidesData || []);
      setMarkers(markersData || []);
      setLoading(false);
    }

    if (slug) {
      loadGame();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading game...
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-lg p-4 text-sm text-destructive-foreground">
        {error}
      </div>
    );
  }

  if (!game) {
    return null;
  }

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Game header similar to RE4 hero area */}
      <section className="relative overflow-hidden rounded-xl border border-border/60 bg-card/80">
        <div className="relative grid gap-4 p-4 md:grid-cols-[2fr,3fr] md:p-6">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-border/50 bg-secondary/60">
            {game.cover_image_url ? (
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
              {game.subtitle && (
                <p className="text-sm text-muted-foreground">{game.subtitle}</p>
              )}
            </div>

            {game.description && (
              <p className="max-w-prose text-sm text-muted-foreground">
                {game.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-secondary px-3 py-1">
                {guides.length} guides
              </span>
              <span className="rounded-full bg-secondary px-3 py-1">
                {markers.length} map markers
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
            becomes a card in this list. You can group them using the{" "}
            <span className="font-mono text-foreground/90">category</span>{" "}
            field.
          </p>
          <GuidesList guides={guides} />
        </div>

        <div className="glass rounded-xl p-4">
          <InteractiveMap game={game} markers={markers} />
        </div>
      </section>
    </div>
  );
}

