import { useVideoDetails } from './hooks/useVideoDetails';
import type { VideoStatistics as VideoStatisticsType } from './hooks/useVideoDetails';

interface VideoStatisticsProps {
  ids: string[];
}

export function VideoStatistics({ ids }: VideoStatisticsProps) {
  const { data, loading, error } = useVideoDetails(ids);

  if (loading) return <div>Loading video statistics...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data.length) return <div>No statistics found.</div>;

  return (
    <div>
      {data.map((video: VideoStatisticsType) => (
        <div key={video.id} style={{ marginBottom: 16 }}>
          <div><strong>{video.snippet.title}</strong></div>
          <div>Channel: {video.snippet.channelTitle}</div>
          <div>
            Stats: views: {video.statistics.viewCount ?? 'N/A'}, likes: {video.statistics.likeCount ?? 'N/A'}, favorites: {video.statistics.favoriteCount ?? 'N/A'}, comments: {video.statistics.commentCount ?? 'N/A'}
          </div>
        </div>
      ))}
    </div>
  );
}
