export async function login(credentials: { email: string; password: string }) {
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
  
    return response.json();
  }
  