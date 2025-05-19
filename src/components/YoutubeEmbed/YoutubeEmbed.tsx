// components/YoutubeVideo/YoutubeVideo.tsx
import { AspectRatio } from '@mantine/core';

export function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <AspectRatio ratio={16 / 9} style={{ width: '100%', height: '100%' }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&playsinline=1`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ border: 0, width: '100%', height: '100%' }}
      />
    </AspectRatio>
  );
}
