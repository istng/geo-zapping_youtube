import { fireEvent, render, screen } from '@testing-library/react';
import { expect, describe, it, vi, beforeEach } from 'vitest';
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
  beforeEach(() => {
    renderVideoStation();
  });

  it("renders ActionIcons and YouTubeEmbed", async () => {
    expect(screen.getByText('Arriba')).toBeInTheDocument();
    expect(screen.getByText('Abajo')).toBeInTheDocument();
    
    expect(await screen.findByTitle('YouTube video player')).toBeInTheDocument();
  })

  it("handles key strokes", async () => {
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(await screen.findByTitle('YouTube video player')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    expect(await screen.findByTitle('YouTube video player')).toBeInTheDocument();
  })

  it("handles button clicks", async () => {
    fireEvent.click(screen.getByText('Arriba'));
    expect(await screen.findByTitle('YouTube video player')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Abajo'));
    expect(await screen.findByTitle('YouTube video player')).toBeInTheDocument();
  })
});
