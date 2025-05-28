import { useMemo } from 'react';

export class VideoApiService {
  // Fetch videos (search)
  async getVideos(params: {
    location: { lat: number; lon: number };
    maxResults?: number;
    locationRadius?: number;
    order?: string;
  }) {
    console.log('Fetching videos with params:',
      JSON.stringify({
        lat: params.location.lat,
        lon: params.location.lon,
        maxResults: params.maxResults ?? 20,
        locationRadius: params.locationRadius ?? 3000,
        order: params.order ?? 'date',
      }));
    const response = await fetch(import.meta.env.VITE_MATTW_YT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lat: params.location.lat,
        lon: params.location.lon,
        maxResults: params.maxResults ?? 20,
        locationRadius: params.locationRadius ?? 3000,
        order: params.order ?? 'date',
      }),
    });
    if (!response.ok) throw new Error('Videos not found');
    const videos = await response.json();
    return { videos };
  }

  // Fetch video statistics/details
  async getVideoDetails(ids: string[]) {
    const response = await fetch(import.meta.env.VITE_MATTW_YT_DETAILS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) throw new Error('Failed to fetch video details');
    const json = await response.json();
    return json.items || [];
  }
}

export function useVideoApi() {
  const service = useMemo(() => new VideoApiService(), []);
  return {
    getVideos: service.getVideos.bind(service),
    getVideoDetails: service.getVideoDetails.bind(service),
  };
}
