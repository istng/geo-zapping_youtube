import { render } from '@testing-library/react';
import { YouTubeEmbed } from './YoutubeEmbed';
import { it, expect, describe } from 'vitest';
import { MantineProvider } from '../../libs/mantine/MantineProvider';

describe('VideoStation', () => {
  it('checks for video element', async () => {
    const { container } = render(
      <MantineProvider>
        <YouTubeEmbed videoId="PHzrDLguIy0" />
      </MantineProvider>
    );
    const video = container.querySelector('iframe');
    expect(video).toBeInTheDocument();
  });
});
