import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Login } from '../components/Login';
import { server } from '../../../mocks/server';
import { beforeAll, afterEach, afterAll, test, expect } from 'vitest';

// Configurar el servidor de MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('shows error message when invalid credentials are provided', async () => {
  const queryClient = new QueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <Login />
    </QueryClientProvider>
  );

  await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'usuario@ejemplo.com');
  await userEvent.type(screen.getByLabelText(/contraseña/i), 'contraseña_incorrecta');
  await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('Credenciales inválidas');
  });
});

test('shows success message when valid credentials are provided', async () => {
  const queryClient = new QueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <Login />
    </QueryClientProvider>
  );

  await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'usuario@ejemplo.com');
  await userEvent.type(screen.getByLabelText(/contraseña/i), 'contraseña_correcta');
  await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

  await waitFor(() => {
    expect(window.location.pathname).toBe('/welcome');
  });
});
