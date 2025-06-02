import { useRef, useCallback, useState, useEffect } from 'react';
import { AppShell, AppShellMain, ActionIcon, Stack, Modal } from '@mantine/core';
import { YouTubeEmbed } from '../../../components/YoutubeEmbed/YoutubeEmbed';
import type { YouTubeEmbedHandle } from '../../../components/YoutubeEmbed/YoutubeEmbed';
import { useVirtualizer } from '@tanstack/react-virtual';
import { VideoStationContext } from '../context/VideoStationContext';
import { MapLocation } from '../../../components/MapLocation/MapLocation';
import { SearchParamsForm } from '../../../components/SearchParamsForm/SearchParamsForm';
import { useVideoSearch } from '../hooks/useVideoSearch';
import { useVideoNavigation } from '../hooks/useVideoNavigation';
import { useLocationModal } from '../hooks/useLocationModal';
import { VideoStatistics } from '../../../components/VideoStatistics/VideoStatistics';
import { useModalLocationAndParams } from '../hooks/useModalLocationAndParams';
import { useVideoStats } from '../hooks/useVideoStats';
import styles from './VideoStation.module.css';
import { VideoOverlay } from '../../../components/VideoOverlay/VideoOverlay';
import { CopyVideoButton } from '../../../components/CopyVideoButton';

export function VideoStation() {
  // Video search, location, and params
  const { videos, location, setLocation, searchParams, setSearchParams, loading } =
    useVideoSearch();

  // Virtualizer setup
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = containerRef;
  const rowVirtualizer = useVirtualizer({
    count: videos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => window.innerHeight, // Each video is 100vh
    overscan: parseInt(import.meta.env.VITE_VSTATION_VISIBLE_VIDEOS || '6', 10),
  });
  const scrollToIndex = useCallback(
    (index: number) => {
      rowVirtualizer.scrollToIndex(index, { align: 'center' });
    },
    [rowVirtualizer],
  );

  // Video navigation (currentIndex, up/down, setting currentIndex)
  const { currentIndex, handleUp, handleDown, setCurrentIndex, shouldPlay, setShouldPlay } =
    useVideoNavigation(videos.length, scrollToIndex, loading);

  // Modal and location selection
  const { modalOpened, setModalOpened } = useLocationModal(setLocation);

  // Local state for modal (location and search params)
  const { modalLocation, setModalLocation, modalParams, setModalParams } =
    useModalLocationAndParams(location, searchParams, modalOpened);

  // Stats modal and video stats state
  const { statsModalOpened, setStatsModalOpened, statsIds } = useVideoStats(videos);

  // Ref for the current YouTubeEmbed
  const currentVideoRef = useRef<YouTubeEmbedHandle>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleOverlayClick = () => {
    currentVideoRef.current?.togglePlayPause?.();
  };

  useEffect(() => {
    if (shouldPlay) {
      currentVideoRef.current?.play();
      setShouldPlay(false);
    }
  }, [shouldPlay]);

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
          <Stack justify="center" align="center" className={styles['video-station-navbar']}>
            <ActionIcon 
              size="lg" 
              variant="light" 
              onClick={handleUp}
              disabled={loading || videos.length === 0 || currentIndex <= 0}
              className={loading || videos.length === 0 || currentIndex <= 0 ? styles['video-station-actionicon'] : ''}
              aria-disabled={loading || videos.length === 0 || currentIndex <= 0}
            >
              <span role="img" aria-label="Up Arrow">
                ⬆️
              </span>
            </ActionIcon>
            <ActionIcon 
              size="lg" 
              variant="light" 
              onClick={handleDown}
              disabled={loading || videos.length === 0 || currentIndex >= videos.length - 1}
              className={loading || videos.length === 0 || currentIndex >= videos.length - 1 ? styles['video-station-actionicon'] : ''}
              aria-disabled={loading || videos.length === 0 || currentIndex >= videos.length - 1}
            >
              <span role="img" aria-label="Down Arrow">
                ⬇️
              </span>
            </ActionIcon>
            <ActionIcon size="lg" variant="light" onClick={() => setModalOpened(true)}>
              <span role="img" aria-label="Search">
                🔍
              </span>
            </ActionIcon>
            <ActionIcon
              size="lg"
              variant="light"
              onClick={() => setStatsModalOpened(true)}
              disabled={loading}
              className={loading ? styles['video-station-actionicon'] : ''}
              aria-disabled={loading}
            >
              <span role="img" aria-label="Statistics">
                📊
              </span>
            </ActionIcon>
            <CopyVideoButton
              videoId={videos.length > 0 && currentIndex < videos.length ? videos[currentIndex] : null}
              disabled={loading || videos.length === 0}
            />
          </Stack>
        </AppShell.Navbar>

        <AppShellMain className={styles['video-station-main']}>
          {loading ? (
            <div className={styles['video-station-loading']}>Loading videos...</div>
          ) : videos.length === 0 ? (
            <div className={styles['video-station-empty']}>
              No recent videos were found. Try a different location!
            </div>
          ) : (
            <>
              <VideoOverlay onClick={handleOverlayClick} isPlaying={isPlaying} />
              <div ref={parentRef} className={styles['video-station-scroll']}>
                <div
                  className={styles['video-station-virtualizer']}
                  style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const videoId = videos[virtualRow.index];
                    const isCurrent = virtualRow.index === currentIndex;
                    return (
                      <div
                        key={videoId}
                        ref={(el) => rowVirtualizer.measureElement?.(el)}
                        className={styles['video-station-virtual-item']}
                        style={{
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <YouTubeEmbed
                          ref={isCurrent ? currentVideoRef : undefined}
                          videoId={videoId}
                          index={virtualRow.index}
                          setIsPlaying={setIsPlaying}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
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
        <div className={styles['video-station-modal-flex']}>
          <div style={{ flex: 1 }}>
            <MapLocation
              lat={modalLocation?.lat}
              lon={modalLocation?.lon}
              zoom={13}
              onChange={(coords) => setModalLocation(coords)}
            />
          </div>
          <div className={styles['video-station-modal-form']}>
            <SearchParamsForm values={modalParams} onChange={setModalParams} />
          </div>
        </div>
        <div className={styles['video-station-modal-footer']}>
          <button
            className={styles['video-station-modal-apply']}
            onClick={() => {
              if (modalLocation) setLocation(modalLocation);
              setSearchParams({
                maxResults: modalParams.maxResults,
                locationRadius: modalParams.radius,
                order: modalParams.orderBy,
              });
              setModalOpened(false);
            }}
          >
            Apply
          </button>
        </div>
      </Modal>
      <Modal
        keepMounted={true}
        opened={statsModalOpened}
        onClose={() => setStatsModalOpened(false)}
        title="Video Statistics"
        centered
        size="auto"
        styles={{
          content: { padding: 24, width: '80%' },
          body: { padding: 0 },
        }}
      >
        <div className={styles['video-station-stats-flex']}>
          {statsIds.length > 0 ? (
            <VideoStatistics
              ids={statsIds}
              onBarClick={(index) => {
                setCurrentIndex(index);
                scrollToIndex(index);
                setStatsModalOpened(false);
              }}
            />
          ) : (
            <div className={styles['video-station-stats-empty']}>No video statistics to show.</div>
          )}
        </div>
      </Modal>
    </VideoStationContext.Provider>
  );
}
