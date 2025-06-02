import { render, act } from '@testing-library/react';
import { YouTubeEmbed } from './YoutubeEmbed';
import { it, expect, describe, vi, beforeEach, afterEach } from 'vitest';
import { MantineProvider } from '../../libs/mantine/MantineProvider';
import { VideoStationContext } from '../../pages/VideoStation/context/VideoStationContext';
import { useState } from 'react';

const TestWrapper = ({ initialIndex, videoIndex }: { initialIndex: number; videoIndex: number }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  (window as any).setTestCurrentIndex = setCurrentIndex;

  return (
    <MantineProvider>
      <VideoStationContext.Provider value={{ currentIndex }}>
        <YouTubeEmbed videoId="PHzrDLguIy0" index={videoIndex} />
      </VideoStationContext.Provider>
    </MantineProvider>
  );
};

describe('YouTubeEmbed with context', () => {
  let postMessageMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    postMessageMock = vi.fn();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('reacts to context currentIndex change', () => {
    const { container } = render(<TestWrapper initialIndex={0} videoIndex={0} />);

    const video = container.querySelector('iframe');
    expect(video).toBeInTheDocument();

    act(() => {
      (window as any).setTestCurrentIndex(1);
    });
    expect(video).toBeInTheDocument();
  });

  it('calls playVideo when it becomes current', () => {
    const { container } = render(<TestWrapper initialIndex={1} videoIndex={0} />); // not current

    const iframe = container.querySelector('iframe')!;
    Object.defineProperty(iframe, 'contentWindow', {
      value: { postMessage: postMessageMock },
      writable: true,
    });

    act(() => {
      (window as any).setTestCurrentIndex(0); // now it's current
    });

    expect(postMessageMock).toHaveBeenCalledWith(
      JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
      '*'
    );
  });

  it('calls pauseVideo when it becomes not current', () => {
    const { container } = render(<TestWrapper initialIndex={0} videoIndex={0} />); // is current

    const iframe = container.querySelector('iframe')!;
    Object.defineProperty(iframe, 'contentWindow', {
      value: { postMessage: postMessageMock },
      writable: true,
    });

    act(() => {
      (window as any).setTestCurrentIndex(1); // now it's not current
    });

    expect(postMessageMock).toHaveBeenCalledWith(
      JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
      '*'
    );
  });
});
