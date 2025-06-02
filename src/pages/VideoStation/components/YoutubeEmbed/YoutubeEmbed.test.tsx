import { render, act } from '@testing-library/react';
import { YouTubeEmbed } from './YoutubeEmbed';
import type { YouTubeEmbedHandle } from './YoutubeEmbed';
import { it, expect, describe, vi, beforeEach, afterEach } from 'vitest';
import { MantineProvider } from '../../../../libs/mantine/MantineProvider';
import { VideoStationContext } from '../../context/VideoStationContext';
import { useState, useRef } from 'react';

const TestWrapper = ({
  initialIndex,
  videoIndex,
  setIsPlaying,
}: {
  initialIndex: number;
  videoIndex: number;
  setIsPlaying?: any;
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const embeddRef = useRef<YouTubeEmbedHandle>(null);
  (window as any).setTestCurrentIndex = setCurrentIndex;
  (window as any).testEmbedRef = embeddRef;
  const mockSetIsPlaying = setIsPlaying || vi.fn();

  return (
    <MantineProvider>
      <VideoStationContext.Provider value={{ currentIndex }}>
        <YouTubeEmbed 
          ref={embeddRef}
          videoId="PHzrDLguIy0" 
          index={videoIndex} 
          setIsPlaying={mockSetIsPlaying} 
        />
      </VideoStationContext.Provider>
    </MantineProvider>
  );
};

describe('YouTubeEmbed', () => {
  let postMessageMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    postMessageMock = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete (window as any).setTestCurrentIndex;
    delete (window as any).testEmbedRef;
  });

  it('renders iframe with correct src and properties', () => {
    const { container } = render(<TestWrapper initialIndex={0} videoIndex={0} />);

    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe?.src).toContain('https://www.youtube.com/embed/PHzrDLguIy0');
    expect(iframe?.src).toContain('enablejsapi=1');
    expect(iframe?.src).toContain('controls=0');
  });

  it('calls pauseVideo when becoming not current', () => {
    const { container } = render(<TestWrapper initialIndex={0} videoIndex={0} />);

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
      '*',
    );
  });

  it('exposes play method through ref that works only when current', () => {
    const { container } = render(<TestWrapper initialIndex={0} videoIndex={0} />);

    const iframe = container.querySelector('iframe')!;
    Object.defineProperty(iframe, 'contentWindow', {
      value: { postMessage: postMessageMock },
      writable: true,
    });

    act(() => {
      (window as any).testEmbedRef.current?.play();
    });

    expect(postMessageMock).toHaveBeenCalledWith(
      JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
      '*',
    );
  });

  it('does not call playVideo when play() is called but not current', () => {
    const { container } = render(<TestWrapper initialIndex={1} videoIndex={0} />); // not current

    const iframe = container.querySelector('iframe')!;
    Object.defineProperty(iframe, 'contentWindow', {
      value: { postMessage: postMessageMock },
      writable: true,
    });

    act(() => {
      (window as any).testEmbedRef.current?.play();
    });

    expect(postMessageMock).not.toHaveBeenCalledWith(
      JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
      '*',
    );
  });

  it('exposes pause method through ref', () => {
    const { container } = render(<TestWrapper initialIndex={0} videoIndex={0} />);

    const iframe = container.querySelector('iframe')!;
    Object.defineProperty(iframe, 'contentWindow', {
      value: { postMessage: postMessageMock },
      writable: true,
    });

    act(() => {
      (window as any).testEmbedRef.current?.pause();
    });

    expect(postMessageMock).toHaveBeenCalledWith(
      JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
      '*',
    );
  });

  it('togglePlayPause method plays when not playing', () => {
    const { container } = render(<TestWrapper initialIndex={0} videoIndex={0} />);

    const iframe = container.querySelector('iframe')!;
    Object.defineProperty(iframe, 'contentWindow', {
      value: { postMessage: postMessageMock },
      writable: true,
    });

    act(() => {
      (window as any).testEmbedRef.current?.togglePlayPause();
    });

    expect(postMessageMock).toHaveBeenCalledWith(
      JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
      '*',
    );
  });

  it('togglePlayPause method pauses when playing', () => {
    const { container } = render(<TestWrapper initialIndex={0} videoIndex={0} />);

    const iframe = container.querySelector('iframe')!;
    Object.defineProperty(iframe, 'contentWindow', {
      value: { postMessage: postMessageMock },
      writable: true,
    });

    // First play to set playing state
    act(() => {
      (window as any).testEmbedRef.current?.play();
    });

    postMessageMock.mockClear();

    // Then toggle should pause
    act(() => {
      (window as any).testEmbedRef.current?.togglePlayPause();
    });

    expect(postMessageMock).toHaveBeenCalledWith(
      JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
      '*',
    );
  });

  it('calls setIsPlaying when playing state changes and is current', () => {
    const mockSetIsPlaying = vi.fn();
    const { container } = render(
      <TestWrapper initialIndex={0} videoIndex={0} setIsPlaying={mockSetIsPlaying} />
    );

    const iframe = container.querySelector('iframe')!;
    Object.defineProperty(iframe, 'contentWindow', {
      value: { postMessage: postMessageMock },
      writable: true,
    });

    act(() => {
      (window as any).testEmbedRef.current?.play();
    });

    expect(mockSetIsPlaying).toHaveBeenCalledWith(true);

    act(() => {
      (window as any).testEmbedRef.current?.pause();
    });

    expect(mockSetIsPlaying).toHaveBeenCalledWith(false);
  });

  it('does not call setIsPlaying when not current', () => {
    const mockSetIsPlaying = vi.fn();
    const { container } = render(
      <TestWrapper initialIndex={1} videoIndex={0} setIsPlaying={mockSetIsPlaying} />
    );

    const iframe = container.querySelector('iframe')!;
    Object.defineProperty(iframe, 'contentWindow', {
      value: { postMessage: postMessageMock },
      writable: true,
    });

    act(() => {
      (window as any).testEmbedRef.current?.pause();
    });

    // setIsPlaying should not be called since the video is not current
    expect(mockSetIsPlaying).not.toHaveBeenCalled();
  });

  it('maintains playing state correctly across play/pause cycles', () => {
    const mockSetIsPlaying = vi.fn();
    const { container } = render(
      <TestWrapper initialIndex={0} videoIndex={0} setIsPlaying={mockSetIsPlaying} />
    );

    const iframe = container.querySelector('iframe')!;
    Object.defineProperty(iframe, 'contentWindow', {
      value: { postMessage: postMessageMock },
      writable: true,
    });

    // Start playing
    act(() => {
      (window as any).testEmbedRef.current?.play();
    });
    expect(mockSetIsPlaying).toHaveBeenLastCalledWith(true);

    // Pause
    act(() => {
      (window as any).testEmbedRef.current?.pause();
    });
    expect(mockSetIsPlaying).toHaveBeenLastCalledWith(false);

    // Play again
    act(() => {
      (window as any).testEmbedRef.current?.play();
    });
    expect(mockSetIsPlaying).toHaveBeenLastCalledWith(true);
  });
});
