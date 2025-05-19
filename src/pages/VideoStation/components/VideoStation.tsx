import { useEffect, useState, useRef } from 'react';
import { AppShell, AppShellMain, ActionIcon, Stack } from '@mantine/core';
import { YouTubeEmbed } from '../../../components/YoutubeEmbed/YoutubeEmbed';
import { getVideos } from '../hooks/getVideos';

export function VideoStation() {
  const [videos, setVideos] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getVideos({ location: { lat: 0, lon: 0 }, search_query: 'test' }).then((res) => {
      setVideos(res.videos);
    });
  }, []);

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return;

    const child = containerRef.current.children[index] as HTMLElement;
    if (child) {
      child.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUp = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const handleDown = () => {
    if (currentIndex < videos.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        handleDown();
      } else if (event.key === 'ArrowUp') {
        handleUp();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDown, handleUp]);

  return (
    <AppShell
      padding={0}
      navbar={{
        width: 80,
        breakpoint: 'sm',
        collapsed: { mobile: false },
      }}
    >
      <AppShell.Navbar p="md">
        <Stack justify="center" align="center" style={{ height: '100%' }}>
          <ActionIcon size="lg" variant="light" onClick={handleUp}>
            Arriba
          </ActionIcon>
          <ActionIcon size="lg" variant="light" onClick={handleDown}>
            Abajo
          </ActionIcon>
        </Stack>
      </AppShell.Navbar>

      <AppShellMain style={{ height: '100vh', overflow: 'hidden' }}>
        <div
          ref={containerRef}
          style={{
            height: '100vh',
            overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
          }}
        >
          {videos.map((videoId) => (
            <div
              key={videoId}
              style={{
                height: '100vh',
                scrollSnapAlign: 'start',
              }}
            >
              <YouTubeEmbed videoId={videoId} />
            </div>
          ))}
        </div>
      </AppShellMain>
    </AppShell>
  );
}
