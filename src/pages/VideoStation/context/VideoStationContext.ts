import { createContext, useContext } from 'react';

export type VideoStationContextType = { currentIndex: number };

export const VideoStationContext = createContext<VideoStationContextType | undefined>(undefined);

export function useVideoStationContext(): VideoStationContextType {
  const ctx = useContext(VideoStationContext);
  if (!ctx) throw new Error('useVideoStationContext must be used within VideoStationContext.Provider');
  return ctx;
}
