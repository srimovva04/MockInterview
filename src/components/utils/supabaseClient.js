import { createClient } from "@supabase/supabase-js";

// Get these from your Supabase dashboard (⚠️ Never expose these in production without env protection)
const supabaseUrl = "https://yziyijvnxxerstenygzu.supabase.co/";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6aXlpanZueHhlcnN0ZW55Z3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDE1MDQsImV4cCI6MjA2NDg3NzUwNH0.0mTO-eOmozXlvw0w1FaDxCoXBZBvLiqrKOodHloGevQ";

export const supabase = createClient(supabaseUrl, supabaseKey);
