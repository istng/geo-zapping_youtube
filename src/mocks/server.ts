import { setupServer } from 'msw/node';
import { videoHandlers } from './handlers/videosHanlder';

export const server = setupServer(...videoHandlers);
