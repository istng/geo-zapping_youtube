import { http, HttpResponse } from 'msw';

export const authHandlers = [
    http.post('/api/login', async ({ request }) => {
        const { email, password } = await request.json() as { email: string; password: string };
        if (email === 'usuario@ejemplo.com' && password === 'contraseña_correcta') {
            return HttpResponse.json({ token: 'expected_token' }, { status: 200 });
        } else {
            return HttpResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }
    })
];
