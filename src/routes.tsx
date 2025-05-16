import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { Login } from './features/auth/components/Login';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
//import { Center } from '@mantine/core';

// Root route without component
const rootRoute = createRootRoute();

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => (
      <Login />
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <ProtectedRoute>
      <div>Protected Home Content</div>
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([loginRoute, homeRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
} 