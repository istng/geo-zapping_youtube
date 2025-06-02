import { http, HttpResponse } from 'msw';

export const videoHandlers = [
    http.post('/api/videos', async ({ request }) => {
        const { location, search_query } = await request.json() as { location: {lat: number; lon: number}; search_query: string };
        if (location.lat === 0 && location.lon === 0 && search_query === 'test') {
            return HttpResponse.json({ videos: ['PHzrDLguIy0', '3yWi8HkGnCg'] }, { status: 200 });
        } else {
            return HttpResponse.json({ error: 'No se encontraron videos' }, { status: 404 });
        }
    })
];
