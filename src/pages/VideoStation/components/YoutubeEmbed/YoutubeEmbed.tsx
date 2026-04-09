// components/YoutubeVideo/YoutubeVideo.tsx
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AspectRatio } from '@mantine/core';
import { useVideoStationContext } from '../../context/VideoStationContext';

export type YouTubeEmbedHandle = {
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
};

export const YouTubeEmbed = forwardRef<
  YouTubeEmbedHandle,
  { videoId: string; index: number; setIsPlaying: any }
>(({ videoId, index, setIsPlaying }, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { currentIndex } = useVideoStationContext();
  const isCurrent = index === currentIndex;
  const [playing, setPlaying] = useState(false);
  const [showCover, setShowCover] = useState(true);

  // Reset cover whenever the video changes
  useEffect(() => {
    setShowCover(true);
  }, [videoId]);

  // Play/pause methods
  const play = () => {
    if (isCurrent) {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
        '*',
      );
      setPlaying(true);
      setShowCover(false);
    }
  };
  const pause = () => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
      '*',
    );
    setPlaying(false);
  };
  const togglePlayPause = () => {
    if (playing) {
      pause();
    } else {
      play();
    }
  };

  useEffect(() => {
    if (!isCurrent) {
      pause();
    }
  }, [isCurrent]);

  // Expose play, pause, and togglePlayPause methods to parent via ref
  useImperativeHandle(ref, () => ({ play, pause, togglePlayPause }), [isCurrent, playing]);

  useEffect(() => {
    if (isCurrent) {
      setIsPlaying(playing);
    }
  }, [playing]);

  return (
    <AspectRatio ratio={16 / 9} style={{ width: '100%', height: '100%' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&modestbranding=1&rel=0&playsinline=1&disablekb=1&fs=0&showinfo=0&controls=0`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, border: 0, width: '100%', height: '100%' }}
        />
        {showCover && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#000',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </AspectRatio>
  );
});
