import { useMemo } from 'react';

const YT_API_BASE = 'https://www.googleapis.com/youtube/v3';

export class VideoApiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getVideos(params: {
    location: { lat: number; lon: number };
    maxResults?: number;
    locationRadius?: number;
    order?: string;
    excludeShorts?: boolean;
  }) {
    const { lat, lon } = params.location;
    const maxResults = params.maxResults ?? 20;
    const locationRadius = params.locationRadius ?? 3000;
    const order = params.order ?? 'date';

    const url = new URL(`${YT_API_BASE}/search`);
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('type', 'video');
    url.searchParams.set('location', `${lat},${lon}`);
    url.searchParams.set('locationRadius', `${locationRadius}m`);
    url.searchParams.set('maxResults', String(maxResults));
    url.searchParams.set('order', order);
    url.searchParams.set('key', this.apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Videos not found');
    const data = await response.json();
    const ids = (data.items ?? [])
      .map((item: { id: { videoId?: string } }) => item.id.videoId)
      .filter(Boolean) as string[];

    if (!params.excludeShorts || ids.length === 0) return { videos: ids };

    // Fetch snippet thumbnails to detect vertical (Short) videos by aspect ratio
    const snippetUrl = new URL(`${YT_API_BASE}/videos`);
    snippetUrl.searchParams.set('part', 'snippet');
    snippetUrl.searchParams.set('id', ids.join(','));
    snippetUrl.searchParams.set('key', this.apiKey);

    const snippetResponse = await fetch(snippetUrl.toString());
    if (!snippetResponse.ok) return { videos: ids }; // fall back to unfiltered

    const snippetData = await snippetResponse.json();
    const nonShortIds = new Set<string>(
      (snippetData.items ?? [])
        .filter((item: any) => {
          const t = item.snippet?.thumbnails;
          const thumb = t?.maxres ?? t?.standard ?? t?.high ?? t?.medium;
          if (thumb?.width && thumb?.height) return thumb.height <= thumb.width;
          return true; // can't tell → keep it
        })
        .map((item: any) => item.id as string),
    );

    return { videos: ids.filter((id) => nonShortIds.has(id)) };
  }

  async getVideoDetails(ids: string[]) {
    const url = new URL(`${YT_API_BASE}/videos`);
    url.searchParams.set('part', 'snippet,statistics');
    url.searchParams.set('id', ids.join(','));
    url.searchParams.set('key', this.apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch video details');
    const json = await response.json();
    return json.items || [];
  }
}

export function useVideoApi() {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY ?? '';
  const service = useMemo(() => new VideoApiService(apiKey), [apiKey]);
  return {
    getVideos: service.getVideos.bind(service),
    getVideoDetails: service.getVideoDetails.bind(service),
  };
}
