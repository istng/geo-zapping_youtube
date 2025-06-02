import { useState } from 'react';
import { ActionIcon } from '@mantine/core';
import styles from './CopyVideoButton.module.css';

interface CopyVideoButtonProps {
  videoId: string | null;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'filled' | 'light' | 'outline' | 'transparent' | 'white' | 'subtle' | 'default';
}

export function CopyVideoButton({ 
  videoId, 
  disabled = false, 
  size = 'lg', 
  variant = 'light' 
}: CopyVideoButtonProps) {
  const [showCopiedPopup, setShowCopiedPopup] = useState(false);

  const handleCopyVideoLink = async () => {
    if (!videoId) return;
    
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    try {
      await navigator.clipboard.writeText(videoUrl);
      setShowCopiedPopup(true);
      setTimeout(() => setShowCopiedPopup(false), 2000);
      console.log('Video link copied to clipboard:', videoUrl);
    } catch (err) {
      console.error('Failed to copy video link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = videoUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopiedPopup(true);
      setTimeout(() => setShowCopiedPopup(false), 2000);
    }
  };

  return (
    <>
      <ActionIcon
        size={size}
        variant={variant}
        onClick={handleCopyVideoLink}
        disabled={disabled || !videoId}
        className={disabled || !videoId ? styles['copy-button-disabled'] : ''}
        aria-disabled={disabled || !videoId}
      >
        <span role="img" aria-label="Copy Video Link">
          🔗
        </span>
      </ActionIcon>
      
      <div 
        className={`${styles['copied-popup']} ${showCopiedPopup ? styles.show : ''}`}
      >
        Copied!
      </div>
    </>
  );
} 