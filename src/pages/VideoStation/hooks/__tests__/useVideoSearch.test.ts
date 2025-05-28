import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeAll, describe, it, expect } from 'vitest';
import { useVideoSearch } from '../useVideoSearch';

describe('useVideoSearch', () => {
  beforeAll(() => {
    // Mock geolocation for tests
    Object.defineProperty(window.navigator, 'geolocation', {
      value: {
        getCurrentPosition: (success: (pos: { coords: { latitude: number; longitude: number } }) => void) => {
          success({ coords: { latitude: 0, longitude: 0 } });
        },
        watchPosition: () => 0,
        clearWatch: () => {},
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
      expect(result.current.location).toEqual({ lat: 0, lon: 0 });
    });
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    await waitFor(() => {
      console.log('Videos fetched:', result.current);
      expect(result.current.videos).toEqual(['PHzrDLguIy0', '3yWi8HkGnCg']);
    });
  });

  it('should update searchParams and fetch new videos', async () => {
    const { result } = renderHook(() => useVideoSearch());
    act(() => {
      result.current.setLocation({ lat: 1, lon: 2 });
      result.current.setSearchParams({ maxResults: 5, locationRadius: 1000, order: 'relevance' });
    });
    await waitFor(() => {
      console.log('After update:', result.current);
      expect(result.current.location).toEqual({ lat: 1, lon: 2 });
      expect(result.current.searchParams).toEqual({ maxResults: 5, locationRadius: 1000, order: 'relevance' });
    });
    await waitFor(() => {
      console.log('Videos after update:', result.current.videos);
      expect(result.current.videos).toEqual(['abc123', 'def456']);
    });
  });
});
