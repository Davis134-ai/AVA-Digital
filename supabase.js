import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://cglqomnrezcpfrnuhnhs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnbHFvbW5yZXpjcGZybnVobmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NDg3NjgsImV4cCI6MjA4NjMyNDc2OH0.XEwj9h-FFpnzUbjtXqnh6fRehf7ZwQEVTyJw20Mh1Zg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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