import { http, HttpResponse } from 'msw';

export const videoHandlers = [
  http.get('https://www.googleapis.com/youtube/v3/search', ({ request }) => {
    const url = new URL(request.url);
    const location = url.searchParams.get('location');
    const maxResults = url.searchParams.get('maxResults');
    const locationRadius = url.searchParams.get('locationRadius');
    const order = url.searchParams.get('order');

    if (location === '0,0') {
      return HttpResponse.json({
        items: [
          { id: { videoId: 'PHzrDLguIy0' } },
          { id: { videoId: '3yWi8HkGnCg' } },
        ],
      });
    } else if (maxResults === '5' && locationRadius === '1000m' && order === 'relevance') {
      return HttpResponse.json({
        items: [
          { id: { videoId: 'abc123' } },
          { id: { videoId: 'def456' } },
        ],
      });
    } else {
      return HttpResponse.json({ items: [] });
    }
  }),
  http.get('https://www.googleapis.com/youtube/v3/videos', () => {
    return HttpResponse.json({
      items: [
        {
          id: 'PHzrDLguIy0',
          snippet: { title: 'Test Video 1', channelTitle: 'Test Channel 1' },
          statistics: { viewCount: '1000' },
        },
        {
          id: '3yWi8HkGnCg',
          snippet: { title: 'Test Video 2', channelTitle: 'Test Channel 2' },
          statistics: { viewCount: '2000' },
        },
      ],
    });
  }),
];
