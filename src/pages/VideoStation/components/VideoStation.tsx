import { useEffect, useRef, useState, useCallback } from 'react';
import { AppShell, AppShellMain, ActionIcon, Stack, Modal } from '@mantine/core';
import { YouTubeEmbed } from '../../../components/YoutubeEmbed/YoutubeEmbed';
import { getVideos } from '../hooks/getVideos';
import { useVirtualizer } from '@tanstack/react-virtual';
import { VideoStationContext } from '../context/VideoStationContext';
import { MapLocation } from '../../../components/MapLocation/MapLocation';

export function VideoStation() {
  const [videos, setVideos] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    if (!location) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {
          setLocation({ lat: -34.6089399, lon: -58.3896266 });
        }
      );
    }
  }, [location]);

  useEffect(() => {
    if (location) {
      getVideos({ location, search_query: 'test' }).then((res) => {
        setVideos(res.videos);
        console.log('Videos:', res.videos);
      });
    }
  }, [location]);

  // Virtualizer setup
  const parentRef = containerRef;
  const rowVirtualizer = useVirtualizer({
    count: videos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => window.innerHeight, // Each video is 100vh
    overscan: parseInt(import.meta.env.VITE_VSTATION_VISIBLE_VIDEOS || '6', 10),
  });

  // Fix: scroll to the currentIndex when it changes
  useEffect(() => {
    if (videos.length > 0) {
      rowVirtualizer.scrollToIndex(currentIndex, { align: 'center' });
    }
  }, [currentIndex, videos.length]);


  const scrollToIndex = useCallback((index: number) => {
    rowVirtualizer.scrollToIndex(index, { align: 'center' });
  }, [rowVirtualizer]);

  const handleUp = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  }, [currentIndex, scrollToIndex]);

  const handleDown = useCallback(() => {
    if (currentIndex < videos.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  }, [currentIndex, scrollToIndex, videos.length]);

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

  // Handler to update location from MapLocation
  const handleSelectCoordinates = useCallback((coords: { lat: number; lon: number }) => {
    setLocation(coords);
    setModalOpened(false); // Optionally close modal after selection
  }, []);

  return (
    <VideoStationContext.Provider value={{ currentIndex }}>
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
              <span role="img" aria-label="Up Arrow">⬆️</span>
            </ActionIcon>
            <ActionIcon size="lg" variant="light" onClick={handleDown}>
              <span role="img" aria-label="Down Arrow">⬇️</span>
            </ActionIcon>
            <ActionIcon size="lg" variant="light" onClick={() => setModalOpened(true)}>
              <span role="img" aria-label="Info">ℹ️</span>
            </ActionIcon>
          </Stack>
        </AppShell.Navbar>

        <AppShellMain style={{ height: '100vh', overflow: 'hidden' }}>
          <div
            ref={parentRef}
            style={{
              height: '100vh',
              overflowY: 'scroll',
              scrollSnapType: 'y mandatory',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map(virtualRow => {
                const videoId = videos[virtualRow.index];
                return (
                  <div
                    key={videoId}
                    ref={el => rowVirtualizer.measureElement?.(el)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      scrollSnapAlign: 'start',
                    }}
                  >
                    <YouTubeEmbed videoId={videoId} index={virtualRow.index} />
                  </div>
                );
              })}
            </div>
          </div>
        </AppShellMain>
      </AppShell>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Search for a location, or select one on the map"
        centered
      >
        {/* Modal content goes here */}
        <div>
          <MapLocation lat={location?.lat} lon={location?.lon} zoom={13} onSelectCoordinates={handleSelectCoordinates} />
        </div>
      </Modal>
    </VideoStationContext.Provider>
  );
}
