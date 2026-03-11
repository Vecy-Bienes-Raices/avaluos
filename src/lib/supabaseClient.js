import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a tolerant client that doesn't crash the app if keys are missing
// Instead, it will log a warning and return a dummy client if needed, or let calls fail gracefully.
let supabaseClient;

if (supabaseUrl && supabaseAnonKey) {
    try {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
        console.error('Supabase Init Error:', e);
    }
} else {
    console.warn('⚠️ Supabase credentials NOT found. Database features will be disabled.');
}

// Export the client (or a safe proxy/null if failed)
// Export the client (or a safe proxy/null if failed)
export const supabase = supabaseClient || {
    from: () => ({ 
        select: () => ({ data: [], error: { message: 'Supabase not initialized' } }),
        insert: () => ({ select: () => ({ data: [], error: { message: 'Database mode disabled' } }) })
    }),
    functions: {
        invoke: () => Promise.resolve({ data: null, error: { message: 'Functions disabled' } })
    },
    auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        msg: "Auth disabled"
    }
};
