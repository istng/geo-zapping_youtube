export async function getVideos(parameters: { location: {lat: number; lon: number}; search_query: string }): Promise<{ videos: string[] }> {

  if (import.meta.env.DEV && import.meta.env.VITE_BYPASS_AUTH === 'true') {
    const { devGetVideos } = await import('./devGetVideos');
    return devGetVideos(parameters);
  }
  
  const response = await fetch('/api/videos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(parameters),
  });

  if (!response.ok) {
    throw new Error('Videos not found');
  }

  const { videos } = await response.json();
  return { videos };
}
