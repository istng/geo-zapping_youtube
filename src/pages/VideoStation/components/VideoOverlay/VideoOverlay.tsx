import React from 'react';
import styles from './VideoOverlay.module.css';

interface VideoOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  zIndex?: number;
  isPlaying?: boolean;
  showPersistentPlay?: boolean;
}

export const VideoOverlay: React.FC<VideoOverlayProps> = ({
  zIndex = 10,
  style,
  isPlaying,
  showPersistentPlay = false,
  ...props
}) => {
  const [showIcon, setShowIcon] = React.useState<null | 'play' | 'pause'>(null);
  const [iconVisible, setIconVisible] = React.useState(false);

  React.useEffect(() => {
    if (isPlaying === undefined) return;
    setShowIcon(isPlaying ? 'play' : 'pause');
    setIconVisible(true);
    const timeout = setTimeout(() => setIconVisible(false), 250);
    return () => clearTimeout(timeout);
  }, [isPlaying]);

  return (
    <div className={styles.overlay} style={{ zIndex, ...style }} {...props}>
      {/* Persistent play button when user hasn't interacted */}
      {showPersistentPlay && (
        <img
          src="/play.svg"
          alt="Click to play"
          className={`${styles.iconOverlay} ${styles.persistent}`}
          draggable={false}
        />
      )}
      
      {/* Temporary feedback icons */}
      <img
        src="/play.svg"
        alt="Play"
        className={
          styles.iconOverlay + ' ' + (showIcon === 'play' && iconVisible ? styles.visible : '')
        }
        draggable={false}
      />
      <img
        src="/pause.svg"
        alt="Pause"
        className={
          styles.iconOverlay + ' ' + (showIcon === 'pause' && iconVisible ? styles.visible : '')
        }
        draggable={false}
      />
    </div>
  );
};
