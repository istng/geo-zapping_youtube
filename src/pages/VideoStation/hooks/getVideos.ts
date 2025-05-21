export async function getVideos(parameters: { location: {lat: number; lon: number}; search_query: string; maxResults?: number; locationRadius?: number; order?: string }) {
  const response = await fetch(import.meta.env.VITE_MATTW_YT_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      lat: parameters.location.lat,
      lon: parameters.location.lon,
      search_query: parameters.search_query,
      maxResults: parameters.maxResults ?? 20,
      locationRadius: parameters.locationRadius ?? 3000,
      order: parameters.order ?? 'date',
    }),
  });

  if (!response.ok) {
    throw new Error('Videos not found');
  }

  // The backend returns a list of items (videos)
  const videos = await response.json();
  return { videos };
}
