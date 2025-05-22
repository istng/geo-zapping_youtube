import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Login } from '../components/Login';
import { beforeAll, beforeEach, it, expect, describe, vi } from 'vitest';
import { mockLocalStorage } from '../../../mocks/storage/localStorage';
import { MantineProvider } from '../../../libs/mantine/MantineProvider';

const mockNavigate = vi.fn();

// Mock router navigation
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: vi.fn().mockReturnValue({
      pathname: "/",
    }),
  };
});

// Configurar el servidor de MSW
beforeAll(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

const renderLogin = () => {
  const queryClient = new QueryClient();
  
  return render(
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Login />
      </MantineProvider>
    </QueryClientProvider>
  );
}

const userLogin = async (email: string, password: string) => {
  await userEvent.type(screen.getByLabelText(/email/i), email);
  await userEvent.type(screen.getByLabelText(/password/i), password);
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
}

describe('Login', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('shows error message when invalid credentials are provided', async () => {
    renderLogin();

    await userLogin('usuario@ejemplo.com', 'contraseña_incorrecta');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Credenciales inválidas');
    });
  });

  it('successfully login when valid credentials are provided', async () => {
    renderLogin();

    await userLogin('usuario@ejemplo.com', 'contraseña_correcta');

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'expected_token');
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/' });
    });
  });
});
