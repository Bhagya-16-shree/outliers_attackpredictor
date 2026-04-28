import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface TimelinePoint {
  t: string;
  logins: number;
  files: number;
  network: number;
}

interface ActivityTimelineProps {
  data: TimelinePoint[];
}

const ActivityTimeline = ({ data }: ActivityTimelineProps) => {
  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="g-logins" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="g-files" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.6} />
              <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="g-net" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.6} />
              <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" opacity={0.4} />
          <XAxis
            dataKey="t"
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "hsl(var(--muted-foreground))" }}
          />
          <Area
            type="monotone"
            dataKey="logins"
            name="Login attempts"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#g-logins)"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="files"
            name="File access"
            stroke="hsl(var(--secondary))"
            strokeWidth={2}
            fill="url(#g-files)"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="network"
            name="Network anomaly"
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            fill="url(#g-net)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityTimeline;
