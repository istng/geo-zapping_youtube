export async function devLogin(credentials: { email: string; password: string }) {
  console.log('Development mode: Auto-login with credentials:', credentials);
  localStorage.setItem('auth_token', 'dev_token');
  return { token: 'dev_token' };
}