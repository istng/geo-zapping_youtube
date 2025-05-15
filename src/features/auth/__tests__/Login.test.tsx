import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Login } from '../components/Login';
import { server } from '../../../mocks/server';
import { beforeAll, afterEach, afterAll, it, expect, describe, vi } from 'vitest';
import { mockLocalStorage } from '../../../mocks/storage/localStorage';
// Configurar el servidor de MSW
beforeAll(() => {
  localStorage.clear();
  vi.clearAllMocks();
  server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

const renderLogin = () => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <Login />
    </QueryClientProvider>
  );
}

const userLogin = async (email: string, password: string) => {
  await userEvent.type(screen.getByLabelText(/correo electrónico/i), email);
  await userEvent.type(screen.getByLabelText(/contraseña/i), password);
  await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
}

describe('Login', () => {
  it('shows error message when invalid credentials are provided', async () => {
    renderLogin();

    await userLogin('usuario@ejemplo.com', 'contraseña_incorrecta');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Credenciales inválidas');
    });
  });

  it('shows success message when valid credentials are provided', async () => {
    renderLogin();

    await userLogin('usuario@ejemplo.com', 'contraseña_correcta');

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'expected_token')
    });
  });
});
