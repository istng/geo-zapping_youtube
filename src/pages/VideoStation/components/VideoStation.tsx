import { useEffect, useRef } from 'react';
import { AppShell, AppShellMain, ActionIcon, Stack, Modal } from '@mantine/core';
import { YouTubeEmbed } from '../../../components/YoutubeEmbed/YoutubeEmbed';
import { useVirtualizer } from '@tanstack/react-virtual';
import { VideoStationContext } from '../context/VideoStationContext';
import { MapLocation } from '../../../components/MapLocation/MapLocation';
import { SearchParamsForm } from '../../../components/SearchParamsForm/SearchParamsForm';
import { useVideoSearch } from '../hooks/useVideoSearch';
import { useVideoNavigation } from '../hooks/useVideoNavigation';
import { useLocationModal } from '../hooks/useLocationModal';

export function VideoStation() {
  // Video search, location, and params
  const {
    videos,
    location,
    setLocation,
    searchParams,
    setSearchParams,
    loading,
  } = useVideoSearch();

  // Virtualizer setup
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = containerRef;
  const rowVirtualizer = useVirtualizer({
    count: videos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => window.innerHeight, // Each video is 100vh
    overscan: parseInt(import.meta.env.VITE_VSTATION_VISIBLE_VIDEOS || '6', 10),
  });

  // Video navigation (currentIndex, up/down, scroll)
  const {
    currentIndex,
    handleUp,
    handleDown,
  } = useVideoNavigation(videos.length, rowVirtualizer);

  // Modal and location selection
  const {
    modalOpened,
    setModalOpened,
    handleSelectCoordinates,
  } = useLocationModal(setLocation);

  // Fix: scroll to the currentIndex when it changes
  useEffect(() => {
    if (videos.length > 0) {
      rowVirtualizer.scrollToIndex(currentIndex, { align: 'center' });
    }
  }, [currentIndex, videos.length]);

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
                <span role="img" aria-label="Search">🔍</span>
            </ActionIcon>
          </Stack>
        </AppShell.Navbar>

        <AppShellMain style={{ height: '100vh', overflow: 'hidden' }}>
          {loading ? (
            <div style={{
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              color: '#888',
              background: 'rgba(255,255,255,0.8)',
              zIndex: 10,
              position: 'absolute',
              width: '100%',
              left: 0,
              top: 0,
            }}>
              Loading videos...
            </div>
          ) : videos.length === 0 ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              fontSize: 22,
              color: '#888',
              textAlign: 'center',
              padding: 32,
            }}>
              No recent videos were found. Try a different location!
            </div>
          ) : (
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
          )}
        </AppShellMain>
      </AppShell>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Select location, customize search results!"
        centered
        size="auto"
        styles={{
          content: { padding: 0 },
          body: { padding: 0 },
        }}
      >
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <MapLocation lat={location?.lat} lon={location?.lon} zoom={13} onSelectCoordinates={handleSelectCoordinates} />
          </div>
          <div style={{ minWidth: 280, maxWidth: 320 }}>
            <SearchParamsForm
              initialValues={{
                radius: searchParams.locationRadius,
                orderBy: searchParams.order,
                maxResults: searchParams.maxResults,
              }}
              onSubmit={(data) => {
                setSearchParams({
                  maxResults: data.maxResults,
                  locationRadius: data.radius,
                  order: data.orderBy,
                });
                setModalOpened(false);
              }}
            />
          </div>
        </div>
      </Modal>
    </VideoStationContext.Provider>
  );
}
