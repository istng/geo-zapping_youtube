// components/YoutubeVideo/YoutubeVideo.tsx
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { AspectRatio } from '@mantine/core';
import { useVideoStationContext } from '../../pages/VideoStation/context/VideoStationContext';

export type YouTubeEmbedHandle = {
  play: () => void;
  pause: () => void;
};

export const YouTubeEmbed = forwardRef<YouTubeEmbedHandle, { videoId: string; index: number }>(
  ({ videoId, index }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { currentIndex } = useVideoStationContext();
    const isCurrent = index === currentIndex;

    // Play/pause methods
    const play = () => {
      if (isCurrent) {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*'
        );
      }
    };
    const pause = () => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
        '*'
      );
    };

    // Expose play and pause methods to parent via ref
    useImperativeHandle(ref, () => ({ play, pause }), [isCurrent]);

    // Effect: play if current, pause if not
    useEffect(() => {
      if (isCurrent) {
        play();
      } else {
        pause();
      }
    }, [isCurrent]);

    return (
      <AspectRatio ratio={16 / 9} style={{ width: '100%', height: '100%' }}>
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&modestbranding=1&rel=0&playsinline=1&disablekb=1&fs=0&showinfo=0&controls=0`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 0, width: '100%', height: '100%' }}
        />
      </AspectRatio>
    );
  }
);
