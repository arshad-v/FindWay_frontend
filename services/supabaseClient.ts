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
      global: {
        fetch: async (url, options: RequestInit = {}) => {
          const clerkToken = await session?.getToken();
          
          return fetch(url, {
            ...options,
            headers: {
              'apikey': supabaseAnonKey,
              'Content-Type': 'application/json',
              ...options.headers,
              Authorization: clerkToken ? `Bearer ${clerkToken}` : `Bearer ${supabaseAnonKey}`,
            },
          });
        },
      },
      auth: {
        persistSession: false,
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
      global: {
        fetch: async (url, options: RequestInit = {}) => {
          const clerkToken = await session?.getToken();
          
          return fetch(url, {
            ...options,
            headers: {
              'apikey': supabaseAnonKey,
              'Content-Type': 'application/json',
              ...options.headers,
              Authorization: clerkToken ? `Bearer ${clerkToken}` : `Bearer ${supabaseAnonKey}`,
            },
          });
        },
      },
    }
  );
}
