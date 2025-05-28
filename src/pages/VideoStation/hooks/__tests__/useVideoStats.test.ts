import { renderHook, act } from '@testing-library/react';
import { useVideoStats } from '../useVideoStats';
import { describe, it, expect } from 'vitest';

describe('useVideoStats', () => {
  const initialVideos = ['a', 'b', 'c'];

  it('should initialize with modal closed and empty statsIds', () => {
    const { result } = renderHook(() => useVideoStats(initialVideos));
    expect(result.current.statsModalOpened).toBe(false);
    expect(result.current.statsIds).toEqual([]);
  });

  it('should set statsIds to videos when modal is opened', () => {
    const { result } = renderHook(() => useVideoStats(initialVideos));
    act(() => {
      result.current.setStatsModalOpened(true);
    });
    // Simulate effect
    act(() => {});
    expect(result.current.statsIds).toEqual(initialVideos);
  });

  it('should update statsIds if videos change while modal is open', () => {
    let videos = ['a', 'b', 'c'];
    const { result, rerender } = renderHook(() => useVideoStats(videos));
    act(() => {
      result.current.setStatsModalOpened(true);
    });
    // Simulate effect
    act(() => {});
    expect(result.current.statsIds).toEqual(['a', 'b', 'c']);
    // Change videos
    videos = ['d', 'e'];
    rerender();
    // Simulate effect
    act(() => {});
    expect(result.current.statsIds).toEqual(['d', 'e']);
  });

  it('should not update statsIds if videos do not change while modal is open', () => {
    const { result } = renderHook(() => useVideoStats(initialVideos));
    act(() => {
      result.current.setStatsModalOpened(true);
    });
    // Simulate effect
    act(() => {});
    expect(result.current.statsIds).toEqual(['a', 'b', 'c']);
    // Open again with same videos
    act(() => {
      result.current.setStatsModalOpened(true);
    });
    // Simulate effect
    act(() => {});
    expect(result.current.statsIds).toEqual(['a', 'b', 'c']);
  });
});
