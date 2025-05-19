import { useEffect, useState } from 'react';
import { AppShell, AppShellMain, ActionIcon, Stack } from '@mantine/core';
import { YouTubeEmbed } from '../../../components/YoutubeEmbed/YoutubeEmbed';
import { getVideos } from '../hooks/getVideos';

export function VideoStation() {
  const [videos, setVideos] = useState<string[]>([]);

  useEffect(() => {
    getVideos({ location: { lat: 0, lon: 0 }, search_query: 'test' }).then((videos) => {
      setVideos(videos.videos);
    });
  }, []);

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
          <ActionIcon size="lg" variant="light">
            Arriba
          </ActionIcon>
          <ActionIcon size="lg" variant="light">
            Abajo
          </ActionIcon>
        </Stack>
      </AppShell.Navbar>

      <AppShellMain style={{ height: '100vh', overflow: 'hidden' }}>
        <YouTubeEmbed videoId={videos[0]} />
      </AppShellMain>
    </AppShell>
  );
}
