import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://gvrqvbeeejfgmdahfwnb.supabase.co'
const supabaseAnonKey = 'sb_publishable_mmx8f3BdL64ag7RVO9ijfQ_zl5ugIZV'

// Session lasts 1 week (Supabase JWT expiry set to 604800 seconds)
// persistSession and autoRefreshToken ensure the user stays logged in across page reloads
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,    // keeps session stored in localStorage
        autoRefreshToken: true,  // automatically refreshes JWT before expiry
    }
})

// Helper: Get user profile
export async function getProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
    if (error) throw error
    return data
}

// Helper: Update profile
export async function updateProfile(userId, updates) {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
    if (error) throw error
    return data
}

// Helper: Get videos
export async function getVideos() {
    const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('active', true)
    if (error) throw error
    return data
}

// Helper: Record video watch
export async function recordWatch(userId, videoId, watchDuration, reward) {
    const { data, error } = await supabase
        .from('user_videos')
        .insert({
            user_id: userId,
            video_id: videoId,
            watch_duration: watchDuration,
            reward_earned: reward
        })
    if (error) throw error
    return data
}

// Helper: Create payment request
export async function createPaymentRequest(userId, type, amount, phone, tier = null) {
    const { data, error } = await supabase
        .from('payment_requests')
        .insert({
            user_id: userId,
            type,
            amount,
            phone,
            tier
        })
    if (error) throw error
    return data
}