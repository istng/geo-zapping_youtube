import React from 'react';
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
