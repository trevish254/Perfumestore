/* Public browser configuration only. Never put secret/service-role keys here. */
window.SUPABASE_CONFIG = {
  url: 'https://ccqkutfeuxywxhvgjbre.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcWt1dGZldXh5d3hodmdqYnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDMyNDMsImV4cCI6MjEwNTYxOTI0M30.GadZfrvsOn88D5sAOBBD9tynHODyVjbp3S2YUvEhU0Y',
  cloudinaryCloudName: 'bai3mzvl',
  cloudinaryUploadPreset: 'perfume_products'
};
window.supabaseRequest = async (path, options = {}) => {
  const response = await fetch(`${window.SUPABASE_CONFIG.url}/rest/v1/${path}`, { ...options, headers: { apikey: window.SUPABASE_CONFIG.anonKey, Authorization: `Bearer ${window.SUPABASE_CONFIG.anonKey}`, 'Content-Type': 'application/json', ...(options.headers || {}) } });
  if (!response.ok) throw new Error(await response.text() || `Supabase request failed (${response.status})`);
  return response.status === 204 ? null : response.json();
};
