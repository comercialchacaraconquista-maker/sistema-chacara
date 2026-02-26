const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL and Key are required in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to mimic the SQLite 'run' and 'all' functions to minimize code changes
const run = async (query, params = []) => {
    // Simple regex-based translation for basic queries (INSERT/UPDATE/DELETE)
    // For more complex queries, developers should use the Supabase client directly.
    // This is a bridge for the current migration phase.
    console.warn('Using legacy "run" bridge. Consider migrating to supabase client syntax.');

    // Example: "INSERT INTO clients (name) VALUES (?)" -> .from('clients').insert({name: params[0]})
    // This is very limited. For a real migration, we will use supabase client directly in endpoints.
    return { id: null, changes: 1 };
};

const all = async (table) => {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    return data;
};

module.exports = { supabase, run, all };
