import { createClient } from "@supabase/supabase-js"; // henter createClient fra supabase

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // henter supabaseUrl fra .env filen
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // henter supabaseAnonKey fra .env filen

if (!supabaseUrl || !supabaseAnonKey) { // hvis supabaseUrl og supabaseAnonKey ikke er satt
  console.warn(
    "Supabase URL og API key er ikke satt." // printer en feilmelding
  ); // passer på at det er variabler i .env filen
}

export const supabase =
  supabaseUrl && supabaseAnonKey // hvis supabaseUrl og supabaseAnonKey er satt
    ? createClient(supabaseUrl, supabaseAnonKey) // lager en supabase client
    : null; // returner null hvis supabaseUrl og supabaseAnonKey ikke er satt

