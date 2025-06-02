import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { Login } from './pages/Login/Login';
import { ProtectedRoute } from './providers/ProtectedRoute/ProtectedRoute';
import { VideoStation } from './pages/VideoStation/VideoStation';
//import { Center } from '@mantine/core';

// Root route without component
const rootRoute = createRootRoute();

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => <Login />,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <ProtectedRoute>
      <VideoStation />
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
