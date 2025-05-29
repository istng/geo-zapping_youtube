import React, { useEffect } from 'react';
import styles from './VideoOverlay.module.css';

interface VideoOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  zIndex?: number;
  isPlaying?: boolean;
}

export const VideoOverlay: React.FC<VideoOverlayProps> = ({
  zIndex = 10,
  style,
  isPlaying,
  ...props
}) => {
  useEffect(() => {
    if (isPlaying !== undefined) {
      console.log(`Video is now ${isPlaying ? 'playing' : 'paused'}`);
    }
  }, [isPlaying]);

  return <div className={styles.overlay} style={{ zIndex, ...style }} {...props} />;
};
