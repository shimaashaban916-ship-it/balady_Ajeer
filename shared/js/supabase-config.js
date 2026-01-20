/**
 * Supabase Configuration for Ajeer Contracts
 *
 * TODO: Replace with your actual Supabase anon key
 * Get it from: Project Settings > API > anon public
 */

const SUPABASE_URL = 'https://bwzcjmnfngxvwhgtwiiy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3emNqbW5mbmd4dndoZ3R3aWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODA5NDcsImV4cCI6MjA4MzU1Njk0N30.vGxghBu9SOocS6wR2UycDcV6MrduK5MQ8s_Tpsk_0KY'; // ⚠️ Replace this!

// Initialize Supabase Client
let supabaseClient = null;
let isSupabaseEnabled = false;

try {
    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        isSupabaseEnabled = true;
        console.log('✅ Supabase connected successfully');
        console.log('🌐 Supabase Mode: Active - Data will be shared across all devices');
    } else {
        console.warn('⚠️ Supabase library not loaded - using LocalStorage');
        isSupabaseEnabled = false;
    }
} catch (error) {
    console.error('❌ Supabase initialization error:', error);
    console.warn('⚠️ Falling back to LocalStorage');
    isSupabaseEnabled = false;
}
