import { renderHook, act, waitFor } from '@testing-library/react';
import { useVideoSearch } from '../useVideoSearch';
import { vi, beforeAll, describe, it, expect } from 'vitest';

vi.mock('../getVideos', () => ({
  getVideos: vi.fn().mockResolvedValue({ videos: ['abc123', 'def456'] }),
}));

describe('useVideoSearch', () => {
  beforeAll(() => {
    Object.defineProperty(window.navigator, 'geolocation', {
      value: {
        getCurrentPosition: (success: (pos: { coords: { latitude: number; longitude: number } }) => void) => {
          success({ coords: { latitude: 1, longitude: 2 } });
        },
      },
      configurable: true,
    });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useVideoSearch());
    expect(result.current.videos).toEqual([]);
    expect(result.current.searchParams).toEqual({
      maxResults: 20,
      locationRadius: 3000,
      order: 'date',
    });
  });

  it('should set location from geolocation and fetch videos', async () => {
    const { result } = renderHook(() => useVideoSearch());
    await waitFor(() => {
      expect(result.current.location).toEqual({ lat: 1, lon: 2 });
    });
    await waitFor(() => {
      expect(result.current.videos).toEqual(['abc123', 'def456']);
    });
  });

  it('should update searchParams and fetch new videos', async () => {
    const { result } = renderHook(() => useVideoSearch());
    await waitFor(() => {
      expect(result.current.location).toEqual({ lat: 1, lon: 2 });
    });
    await waitFor(() => {
      expect(result.current.videos).toEqual(['abc123', 'def456']);
    });
    act(() => {
      result.current.setSearchParams({ maxResults: 5, locationRadius: 1000, order: 'relevance' });
    });
    await waitFor(() => {
      expect(result.current.searchParams).toEqual({ maxResults: 5, locationRadius: 1000, order: 'relevance' });
    });
  });
});
