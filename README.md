
## Development

```bash
pnpm build
pnpm start
```

---

## Bildereferanser (Image Sources)

- `https://www.reddit.com/r/residentevil/comments/12dhewd/map_of_leons_route_through_village_chapters_16_of/`
- `https://eldenring.wiki.fextralife.com/Interactive+Map`

---

## AI‑bruk (Use of AI)

AI ble brukt til **all informasjon om de forskjellige spillene**.  
Dette ble gjort for å spare tid, og betyr at teksten ikke viser egen kompetanse på å skrive beskrivelser av spillene. alt av tekst er også skrevet ai på nettsiden dette er for å spare tid siden jeg hadde ikke tid til alt på planenen hvis jeg også skulle dokumentere

---

## Prompt til SQL‑generering (RE4R)

**Original prompt:**

```text
fill this talbe with the game re4r not image link; eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpZmhiY2p1amxsYXF6d25vcGZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODM3Mjg4NiwiZXhwIjoyMDgzOTQ4ODg2fQ.JFPEO-0oabwYIscGczCKIIOHDU0A7wKoO9ZidXVKRBE
```

**Tidspunkt:** 9:50 AM  
AI‑responsen forklarte at service role‑nøkkelen ikke kunne brukes direkte i samtalen av sikkerhetsgrunner, men at det var mulig å generere `INSERT`‑setninger for Resident Evil 4 Remake (RE4R).

---

## SQL‑kode for å legge inn RE4R‑data

Nedenfor er SQL‑skriptet som ble generert for å sette inn RE4R‑data i tabellene.

```sql
-- Insert the game
INSERT INTO public.games (slug, title, subtitle, short_description, description, release_year)
VALUES (
  're4r',
  'Resident Evil 4 Remake',
  'Survival is just the beginning',
  'A reimagining of the 2005 classic, featuring modernized gameplay and stunning visuals.',
  'Resident Evil 4 Remake is a survival horror game that follows special agent Leon S. Kennedy as he investigates the disappearance of the President''s daughter in a remote European village. Featuring over-the-shoulder shooting, resource management, and intense combat against the Los Illuminados cult, this remake updates the beloved classic with modern graphics, expanded story elements, and refined gameplay mechanics while maintaining the spirit of the original.',
  2023
);

-- Get the game_id for reference (you'll need this)
-- You can find it by running: SELECT id FROM public.games WHERE slug = 're4r';

-- Insert some guides (replace YOUR_GAME_ID with the actual UUID)
INSERT INTO public.guides (game_id, title, summary, content, category, order_index)
VALUES 
(
  (SELECT id FROM public.games WHERE slug = 're4r'),
  'Getting Started',
  'Essential tips for beginning your journey',
  'Welcome to Resident Evil 4 Remake! Here are some key tips:\n\n1. **Conserve Ammo**: Headshots are crucial. Aim carefully and don''t waste bullets.\n2. **Use Your Knife**: The knife is now durable and can parry attacks. Master this skill early.\n3. **Manage Inventory**: Your attaché case is limited. Sell unnecessary items to the Merchant.\n4. **Explore Everything**: Breaking crates and barrels often yields valuable resources.\n5. **Save Often**: Use typewriters whenever you find them.',
  'Beginner Tips',
  1
),
(
  (SELECT id FROM public.games WHERE slug = 're4r'),
  'Combat Guide',
  'Master the art of survival combat',
  'Combat in RE4R requires strategy and precision:\n\n**Weapon Priority**: Start with the handgun, upgrade to the Punisher or Red9. Get the shotgun ASAP for crowd control.\n\n**Enemy Weaknesses**: Shoot legs to stagger enemies, then perform melee attacks. Ganados go down with headshots, but Los Illuminados parasites require different tactics.\n\n**Boss Strategies**: Each boss has patterns. Learn them, exploit weaknesses, and stock up on healing items before major encounters.\n\n**Resource Management**: Craft ammo when needed, but don''t overspend. The Merchant offers good deals on upgrades.',
  'Combat',
  2
),
(
  (SELECT id FROM public.games WHERE slug = 're4r'),
  'Treasure Locations',
  'Find all valuable treasures to maximize profit',
  'Treasures are your primary source of income:\n\n**Chapter 1-3**: Focus on the Village area - check houses, wells, and hidden areas.\n\n**The Castle**: Most lucrative area. Don''t miss the Gallery treasures and Elegant Crown pieces.\n\n**The Island**: Final push for resources. The mine area has multiple high-value items.\n\n**Tip**: Combine treasure sets (crown + jewels) for maximum value. Sell to the Merchant for pesetas to buy weapon upgrades.',
  'Collectibles',
  3
);

-- Insert some map markers (replace YOUR_GAME_ID)
INSERT INTO public.map_markers (game_id, label, description, category, x_percent, y_percent, order_index)
VALUES
(
  (SELECT id FROM public.games WHERE slug = 're4r'),
  'Village Chief''s Manor',
  'Important story location. Contains the Insignia Key needed to progress.',
  'Story Location',
  35.500,
  42.750,
  1
),
(
  (SELECT id FROM public.games WHERE slug = 're4r'),
  'Merchant - First Encounter',
  'Your first meeting with the Merchant. Stock up on supplies and sell treasures here.',
  'Merchant',
  28.250,
  55.100,
  2
),
(
  (SELECT id FROM public.games WHERE slug = 're4r'),
  'Blue Medallion #1',
  'Shoot this blue medallion as part of the optional challenge. Reward: Spinel.',
  'Collectible',
  45.800,
  38.250,
  3
),
(
  (SELECT id FROM public.games WHERE slug = 're4r'),
  'Treasure: Elegant Bangle',
  'Hidden treasure worth 5,000 pesetas. Found inside a cabinet.',
  'Treasure',
  52.300,
  61.500,
  4
);
```

**Slik kjører du dette:**

1. Gå til Supabase Dashboard  
2. Naviger til **SQL Editor**  
3. Lim inn SQL‑koden over  
4. Klikk **"Run"**  

Dataene vil bli satt inn med riktige foreign key‑referanser. Om du trenger flere guider, kartmarkører eller annet innhold, kan det utvides på samme måte.

---

## Notater om nøkkelbruk

### jeg ga den annon key siden den kan da lese av hva de forskjelige colomsene er selvom den sier den ikke gjør det

---

## Stechflow AI

`stechflow ai` kan du legge koden din i, flytte og endre på kommentarer, og be AI‑en om å **improve the layout**.  
Da gjør den det og gir tilbake koden med det forbedret. Du må bare ha skrevet `global.css`.

---

## CSS‑fokus og Cursor AI

På grunn av at hovedfokuset ikke er på CSS, ble **Cursor AI med Developer‑funksjonen** brukt til å justere CSS mens man så på siden.  
Dette gjorde at layout og styling kunne forbedres raskt uten at prosjektet trengte detaljert manuell CSS‑utvikling.

---

## SQL‑prompt fra ChatGPT

sql promt form chat gpt  
`https://chatgpt.com/share/69678b36-b42c-800c-9fce-f768f0f80d48`

## skrevet i curosor pro version

dette har vært gjort med autocomplete av linjer med curosr men jeg har lest gjenom og forstårr før jeg har trykket på tab. Nesten alt av teskt er skrevet med ai på siden pga min spårk er så dårlig og jeg orket ikke å skriv det. 

## tidsberening ##

jeg rakk alt på plannen men jeg hadde ikke rekket det hvis jeg måtte levere på ondsdag så hadde jeg ikke rekket det siden jeg trodde ikek vi skulle gjøre dette skole realtert så jeg satt ikke at tid til å lage readme eller komentere koden siden dette tar evighetster med tid. men på ferdag så fikk jeg skrevet ferdig readme filen og komenert page.js som jeg fikk litt dårlgi tid til. jeg snakket ikek med noen siden jeg regnet med at det var ikek mye de kunne si som kunne forbedres pga rt tar så lang tid å endre små ting i react. jeg rakk akruratt å lage auth men ikke debugge den helt ferdig men jeg har skrevet det før så jeg regnet veldig med at det fungerer jeg har kommenrt den og jeg så ingen feil.  