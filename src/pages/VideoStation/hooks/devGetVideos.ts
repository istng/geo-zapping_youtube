export async function devGetVideos(parameters: { location: {lat: number; lon: number}; search_query: string }): Promise<{ videos: string[] }> {
    console.log('Development mode: Auto-login with credentials:', parameters);
    return { videos: ['PHzrDLguIy0', '3yWi8HkGnCg'] };
  }