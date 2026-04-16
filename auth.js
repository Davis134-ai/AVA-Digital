import { supabase } from './supabase.js'

// Register with phone + password
export async function register(phone, password, referralCode = null) {
  // Create email from phone
  const email = phone.replace(/[^0-9]/g, '') + '@gmail.com'
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError) throw authError;

  const user = authData.user;
  if (!user) throw new Error('Registration failed')

  // Look up referrer first if code provided
  let referrerId = null;
  if (referralCode) {
    const { data: referrer } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', referralCode)
      .single();
    if (referrer) referrerId = referrer.id;
  }

  // Create profile with referred_by included from the start
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      phone,
      referral_code: 'AVA-' + Math.random().toString(36).substr(2, 6).toUpperCase(), // ← Updated prefix
      tier: 'free',
      daily_limit: 0,
      balance: 0,
      referred_by: referrerId
    });
  if (profileError) throw profileError;

  return user
}

// Login with phone + password
export async function login(phone, password) {
  const email = phone.replace(/[^0-9]/g, '') + '@gmail.com'
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data.user
}

// Logout
export function logout() {
  return supabase.auth.signOut()
}

// Get current user
export function getCurrentUser() {
  return supabase.auth.getUser()
}