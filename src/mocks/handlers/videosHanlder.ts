import { http, HttpResponse } from 'msw';

export const videoHandlers = [
    http.post('/api/videos', async ({ request }) => {
        const requestBody = await request.json() as { lat: number; lon: number, maxResults: number, locationRadius: number, order: string };
        if (requestBody && requestBody.lat === 0 && requestBody.lon === 0) {
            return HttpResponse.json(['PHzrDLguIy0', '3yWi8HkGnCg']);
        } else if (requestBody && requestBody.maxResults === 5 && requestBody.locationRadius === 1000 && requestBody.order === 'relevance') {
            return HttpResponse.json(['abc123', 'def456']);
        } else {
            return HttpResponse.json({ error: 'No se encontraron videos' }, { status: 404 });
        }
    })
];
