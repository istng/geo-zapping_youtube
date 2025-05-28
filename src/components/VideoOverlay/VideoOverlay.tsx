import React from 'react';
import styles from './VideoOverlay.module.css';

interface VideoOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  zIndex?: number;
}

export const VideoOverlay: React.FC<VideoOverlayProps> = ({ zIndex = 10, style, ...props }) => (
  <div
    className={styles.overlay}
    style={{ zIndex, ...style }}
    {...props}
  />
);
