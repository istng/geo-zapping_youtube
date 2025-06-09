import { useVideoDetails } from './hooks/useVideoDetails';
import type { VideoStatistics as VideoStatisticsType } from './hooks/useVideoDetails';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useMantineTheme, useComputedColorScheme } from '@mantine/core';

interface VideoStatisticsProps {
  ids: string[];
}

export function VideoStatistics({ ids }: VideoStatisticsProps) {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const { data, loading, error } = useVideoDetails(ids);

  if (loading) return <div>Loading video statistics...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data.length) return <div>No statistics found.</div>;

  // Prepare chart data
  const chartData = data.map((video: VideoStatisticsType) => ({
    name: video.snippet.title,
    channel: video.snippet.channelTitle,
    viewCount: Number(video.statistics.viewCount ?? 0),
  }));

  const labelColor = colorScheme === 'dark' ? theme.white : theme.black;
  const labelShadow = colorScheme === 'dark'
    ? '1px 1px 4px rgba(0,0,0,0.8)'
    : '1px 1px 4px rgba(255,255,255,0.7)';

  const renderBarLabel = (props: any) => {
    const { x, y, height, index } = props;
    const title = chartData[index]?.name;
    return (
      <text
        x={x + 8} // 8px right of the bar start
        y={y + height / 2 + 5}
        textAnchor="start"
        fontSize={13}
        fill={labelColor}
        style={{ fontWeight: 500, pointerEvents: 'none', textShadow: labelShadow }}
      >
        {title}
      </text>
    );
  };

  const renderCustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={4} textAnchor="end" fontSize={13} fill={labelColor}>
          {chartData[payload.index]?.channel ?? ''}
        </text>
      </g>
    );
  };

  // Custom shape for non-clickable bar
  const FullRowBar = (props: any) => {
    const { y, height } = props;
    return (
      <g>
        <rect
          x={0}
          y={y}
          width="100%"
          height={height}
          fill="transparent"
        />
        <rect
          x={props.x}
          y={y}
          width={props.width}
          height={height}
          fill={props.fill}
          rx={2}
          ry={2}
        />
        {renderBarLabel(props)}
      </g>
    );
  };

  return (
    <div style={{ width: '100%', minHeight: 400, height: 530 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 16, right: 64, left: 32, bottom: 32 }}
          barCategoryGap={16}
          barSize={48}
        >
          <XAxis 
            type="number" 
            allowDecimals={false} 
            tick={{ fill: labelColor }}
            label={{
              value: 'View count',
              position: 'insideBottom',
              offset: -10,
              fill: labelColor,
              fontSize: 15,
              fontWeight: 600
            }}
          />
          <YAxis
            type="category"
            dataKey="channel"
            width={180}
            tick={renderCustomYAxisTick}
            interval={0}
          />
          <Tooltip 
            formatter={(value, name) => {
                const labelMap: Record<string, string> = {
                  viewCount: 'View count',
                };
                return [value, labelMap[name] || name];
            }}
          />
          <Bar 
            dataKey="viewCount" 
            fill="#8884d8" 
            radius={[2, 2, 2, 2]} 
            label={false}
            shape={FullRowBar}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
