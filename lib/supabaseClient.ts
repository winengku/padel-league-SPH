import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://fedukezbnckpkiothcej.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlZHVrZXpibmNrcGtpb3RoY2VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyODc0ODEsImV4cCI6MjA4Mzg2MzQ4MX0.4YXHpCVjVtGKT2sR_fm7fg-I2fPNCNMTqoEpaGULuGY"
);
