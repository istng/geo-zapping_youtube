import '@testing-library/jest-dom';
import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { server } from '../mocks/server'; // adjust path to your MSW setup

// Set up VITE_MATTW_YT_API env var for MSW
if (!import.meta.env) {
  // @ts-ignore
  import.meta.env = {};
}
import.meta.env.VITE_MATTW_YT_API = '/api/videos';
import.meta.env.VITE_MATTW_YT_DETAILS_API = '/api/video-details';

// setupTests.ts
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
