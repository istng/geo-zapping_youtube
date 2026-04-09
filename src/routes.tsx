import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { VideoStation } from './pages/VideoStation/VideoStation';

const rootRoute = createRootRoute();

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <VideoStation />,
});

const routeTree = rootRoute.addChildren([homeRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
