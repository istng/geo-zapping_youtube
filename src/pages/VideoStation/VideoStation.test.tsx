import { render, screen } from '@testing-library/react';
import { expect, describe, it, vi, beforeEach, beforeAll } from 'vitest';
import { VideoStation } from './VideoStation';
import { MantineProvider } from '../../libs/mantine/MantineProvider';

const renderVideoStation = () => {
  return render(
    <MantineProvider>
      <VideoStation />
    </MantineProvider>,
  );
};

describe('VideoStation', async () => {
  beforeAll(() => {
    // Mock geolocation for tests
    Object.defineProperty(window.navigator, 'geolocation', {
      value: {
        getCurrentPosition: (
          success: (pos: { coords: { latitude: number; longitude: number } }) => void,
        ) => {
          success({ coords: { latitude: 0, longitude: 0 } });
        },
        watchPosition: () => 0,
        clearWatch: () => {},
      },
      configurable: true,
    });
  });

  beforeEach(() => {
    renderVideoStation();
  });

  it('renders ActionIcons and YouTubeEmbed', async () => {
    expect(screen.getByText('⬆️')).toBeInTheDocument();
    expect(screen.getByText('⬇️')).toBeInTheDocument();
    expect(screen.getByText('🔍')).toBeInTheDocument();
    expect(screen.getByText('📊')).toBeInTheDocument();
  });

  it('greys and disables statistics button while loading', async () => {
    // Mock useVideoSearch to return loading: true
    vi.doMock('../hooks/useVideoSearch', () => ({
      useVideoSearch: () => ({
        videos: ['PHzrDLguIy0', '3yWi8HkGnCg'],
        location: { lat: 0, lon: 0 },
        setLocation: vi.fn(),
        searchParams: { maxResults: 20, locationRadius: 3000, order: 'date' },
        setSearchParams: vi.fn(),
        loading: true,
      }),
    }));
    const statsButton = screen.getByRole('button', { name: /Statistics/i });
    expect(statsButton).toBeDisabled();
    expect(statsButton).toHaveStyle('color: #bbb');
    expect(statsButton).toHaveStyle('cursor: not-allowed');
  });
});
