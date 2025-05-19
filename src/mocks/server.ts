import { setupServer } from 'msw/node';
import { authHandlers } from './handlers/authHandlers';
import { videoHandlers } from './handlers/videosHanlder';

export const server = setupServer(...authHandlers, ...videoHandlers);
