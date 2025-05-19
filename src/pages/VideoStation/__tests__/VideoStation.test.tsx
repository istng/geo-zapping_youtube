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
  })

  it("shows the first video by default", async () => {
    const iframes = await screen.findAllByTitle('YouTube video player');
    expect(iframes[0]).toBeVisible();
    // Optionally, check src contains first video id
    expect(iframes[0].getAttribute('src')).toContain('PHzrDLguIy0');
  });

  it("shows the next video after clicking 'Abajo'", async () => {
    fireEvent.click(screen.getByText('Abajo'));
    const iframes = await screen.findAllByTitle('YouTube video player');
    expect(iframes[1]).toBeVisible();
    expect(iframes[1].getAttribute('src')).toContain('3yWi8HkGnCg');
  });

  it("shows the previous video after clicking 'Arriba' from second video", async () => {
    fireEvent.click(screen.getByText('Abajo'));
    fireEvent.click(screen.getByText('Arriba'));
    const iframes = await screen.findAllByTitle('YouTube video player');
    expect(iframes[0]).toBeVisible();
    expect(iframes[0].getAttribute('src')).toContain('PHzrDLguIy0');
  });

  it("does not go above first video", async () => {
    fireEvent.click(screen.getByText('Arriba'));
    const iframes = await screen.findAllByTitle('YouTube video player');
    expect(iframes[0]).toBeVisible();
  });

  it("does not go below last video", async () => {
    fireEvent.click(screen.getByText('Abajo'));
    fireEvent.click(screen.getByText('Abajo'));
    const iframes = await screen.findAllByTitle('YouTube video player');
    expect(iframes[1]).toBeVisible();
  });

  it("shows the next video after ArrowDown key", async () => {
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    const iframes = await screen.findAllByTitle('YouTube video player');
    expect(iframes[1]).toBeVisible();
  });

  it("shows the previous video after ArrowUp key", async () => {
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    const iframes = await screen.findAllByTitle('YouTube video player');
    expect(iframes[0]).toBeVisible();
  });
});
