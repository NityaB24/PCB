import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const clientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
};

const getRequiredEnv = (value, name) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const createSupabaseRlsClient = () => {
  return createClient(
    getRequiredEnv(SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnv(SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    clientOptions,
  );
};

export const createSupabaseServiceClient = () => {
  return createClient(
    getRequiredEnv(SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnv(SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY"),
    clientOptions,
  );
};