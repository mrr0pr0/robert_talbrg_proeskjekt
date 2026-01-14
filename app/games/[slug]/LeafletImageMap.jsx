"use client"; // klient-komponent i Next.js

import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet"; // kart-komponenter fra react-leaflet
import L from "leaflet"; // hovedbiblioteket Leaflet
import "leaflet/dist/leaflet.css"; // css for Leaflet-kartet
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png"; // ikon (retina)
import iconUrl from "leaflet/dist/images/marker-icon.png"; // vanlig ikon
import shadowUrl from "leaflet/dist/images/marker-shadow.png"; // skygge til ikon

// fikser standard ikon i Next.js
L.Icon.Default.mergeOptions({
  iconRetinaUrl, // ikon (retina)
  iconUrl, // ikon
  shadowUrl, // skygge
});

// enkelt 0–100 koordinatsystem
const BOUNDS = [
  [0, 0], // venstre / topp
  [100, 100], // høyre / nederst
];

export default function LeafletImageMap({ game, markers }) { // kart-komponent for ett spill
  if (!game?.map_image_url) { // hvis ingen kart-url, vis beskjed
    return (
      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">{/* senterer teksten */}
        Add a{" "}
        <span className="mx-1 font-mono text-foreground/90">map_image_url</span>{" "}
        to the game in Supabase{/* forteller hvor feltet må legges til */}
      </div>
    );
  }

  // lager posisjoner til Leaflet
  const markerPositions = (markers || []).map((marker) => ({ // fallback til tom liste
    ...marker, // beholder alle felter
    position: [marker.y_percent, marker.x_percent], // [lat, lng] fra prosent
  }));

  return ( // jsx for kartet
    <div className="h-full w-full">{/* kartet fyller hele flaten */}
      <MapContainer
        key={game?.id || game?.slug || "leaflet-image-map"} // tvinger remount når spill endres
        crs={L.CRS.Simple} // enkelt koordinatsystem for bilde
        bounds={BOUNDS} // bruker 0–100-grenser
        minZoom={-1} // kan zoome litt ut
        maxZoom={4} // maks zoom inn
        style={{ width: "100%", height: "100%" }} // fyller container
        zoomControl={true} // viser zoom-knapper
      >{/* start kart */}
        <ImageOverlay url={game.map_image_url} bounds={BOUNDS} />{/* legger bildet på kartet */}

        {markerPositions.map((marker) => ( // render alle markører
          <Marker key={marker.id} position={marker.position}>{/* markør på kartet */}
            <Popup>{/* vises ved klikk */}
              <div className="space-y-1 text-xs">{/* liten tekst / spacing */}
                <p className="font-semibold">{marker.label}</p>{/* navn på markør */}
                {marker.description && ( // bare hvis beskrivelse finnes
                  <p className="text-muted-foreground">{marker.description}</p> // tekst i dempet farge
                )}
                {marker.category && ( // bare hvis kategori finnes
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{/* liten label */}
                    {marker.category}{/* kategorinavn */}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

// tok at den skal visses fra et eldre prosjekt dette var sammerbedidet med alexsander yang. han sa det var greit å bruke koden. så etter linje 40