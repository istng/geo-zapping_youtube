/// <reference types="vite/client" />

declare module '*?inline' {
  const content: { [key: string]: any };
  export * from './devAuthService';
  export default content;
} 