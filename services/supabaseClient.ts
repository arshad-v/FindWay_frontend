import { createClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/clerk-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key are required. Make sure to set them in your .env file.");
}

// Basic Supabase client (for non-authenticated operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a custom Supabase client that injects the Clerk session token
export function createClerkSupabaseClient(session: any) {
  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      // Supabase will call this to attach the Authorization header automatically
      accessToken: async () =>
        (await session?.getToken({ template: 'supabase' }))
          || (await session?.getToken())
          || null,
      auth: {
        // Prevent creating multiple GoTrue clients with shared storage keys
        storageKey: 'sb-clerk',
        // We don't need Supabase to manage its own session in the browser
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}

// Hook to create authenticated Supabase client
export function useSupabaseClient() {
  const { session } = useSession();
  
  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      accessToken: async () =>
        (await session?.getToken({ template: 'supabase' }))
          || (await session?.getToken())
          || null,
      auth: {
        storageKey: 'sb-clerk',
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}
