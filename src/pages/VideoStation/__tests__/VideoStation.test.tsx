import { render, screen } from '@testing-library/react';
import { expect, describe, it, vi, beforeEach, beforeAll } from 'vitest';
import { VideoStation } from '../components/VideoStation';
import { MantineProvider } from '../../../libs/mantine/MantineProvider';

//use vi.mock to mock the getVideos hook
vi.mock('../hooks/getVideos', () => ({
  getVideos: vi.fn().mockResolvedValue({ videos: ['PHzrDLguIy0', '3yWi8HkGnCg'] }),
}));

const renderVideoStation = () => {
  return render(
    <MantineProvider>
      <VideoStation />
    </MantineProvider>
  );
}

describe('VideoStation', async () => {
  beforeAll(() => {
    // Mock geolocation for tests
    Object.defineProperty(window.navigator, 'geolocation', {
      value: {
        getCurrentPosition: (success: (pos: { coords: { latitude: number; longitude: number } }) => void) => {
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

  it("renders ActionIcons and YouTubeEmbed", async () => {
    expect(screen.getByText('⬆️')).toBeInTheDocument();
    expect(screen.getByText('⬇️')).toBeInTheDocument();
    expect(screen.getByText('🔍')).toBeInTheDocument();
  })
});
