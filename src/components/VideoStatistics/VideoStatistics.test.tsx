import { render, screen } from '@testing-library/react';
import { expect, describe, it, vi, afterEach } from 'vitest';
import { MantineProvider } from '../../libs/mantine/MantineProvider';

// Only mock ResponsiveContainer to avoid jsdom SVG issues
vi.mock('recharts', async () => {
  const actual = await vi.importActual<any>('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: any) => <svg>{children}</svg>,
  };
});

const renderVideoStatistics = async (props = {}) => {
    const { VideoStatistics } = await import('./VideoStatistics');
    render(
    <MantineProvider>
        <VideoStatistics ids={['id1', 'id2']} {...props} />
    </MantineProvider>
    );
};

describe('VideoStatistics', () => {
    afterEach(() => {
        vi.resetModules();
    });

  it('renders loading state', async () => {
    vi.doMock('./hooks/useVideoDetails', () => ({
      useVideoDetails: () => ({ data: [], loading: true, error: null }),
    }));
    await renderVideoStatistics();
    expect(screen.getByText(/Loading video statistics/i)).toBeInTheDocument();
  });

  it('renders error state', async () => {
    vi.doMock('./hooks/useVideoDetails', () => ({
      useVideoDetails: () => ({ data: [], loading: false, error: 'fail' }),
    }));
    await renderVideoStatistics();
    expect(screen.getByText(/Error: fail/i)).toBeInTheDocument();
  });
});
