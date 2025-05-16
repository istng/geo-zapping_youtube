export async function login(credentials: { email: string; password: string }) {

  if (import.meta.env.DEV && import.meta.env.VITE_BYPASS_AUTH === 'true') {
    const { devLogin } = await import('./devAuthService');
    return devLogin(credentials);
  }
  
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }

  const { token } = await response.json();
  localStorage.setItem('auth_token', token);
  return { token };
}
