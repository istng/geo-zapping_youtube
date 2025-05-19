import { useEffect, useState } from 'react';
import { AppShell, AppShellMain, ActionIcon, Stack } from '@mantine/core';
import { YouTubeEmbed } from '../../../components/YoutubeEmbed/YoutubeEmbed';
import { getVideos } from '../hooks/getVideos';

export function VideoStation() {
  const [videos, setVideos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getVideos({ location: { lat: 0, lon: 0 }, search_query: 'test' }).then((videos) => {
      setVideos(videos.videos);
      setCurrentIndex(0); // reset index when new videos load
    });
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (videos.length ? (prev + 1) % videos.length : 0));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (videos.length ? (prev - 1 + videos.length) % videos.length : 0));
  };

  const currentVideoId = videos[currentIndex];

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
          <ActionIcon size="lg" variant="light" onClick={handlePrev}>
            Arriba
          </ActionIcon>
          <ActionIcon size="lg" variant="light" onClick={handleNext}>
            Abajo
          </ActionIcon>
        </Stack>
      </AppShell.Navbar>

      <AppShellMain style={{ height: '100vh', overflow: 'hidden' }}>
        {currentVideoId && <YouTubeEmbed videoId={currentVideoId} />}
      </AppShellMain>
    </AppShell>
  );
}
