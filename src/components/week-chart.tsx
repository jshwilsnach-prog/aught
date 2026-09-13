import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import type { DayHits } from "@/lib/tally";
import { formatCount, formatDay } from "@/lib/tally-format";

type Props = {
  days: DayHits[];
};

type TipProps = {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: DayHits }>;
};

function ChartTip({ active, payload }: TipProps) {
  if (!active || !payload?.[0]) return null;
  const row = payload[0].payload;
  const value = payload[0].value ?? 0;
  if (!row) return null;
  return (
    <div className="rounded-md bg-surface px-3 py-2 text-sm shadow-border">
      <p className="text-muted">{formatDay(row.day)}</p>
      <p className="font-medium tabular-nums text-fg">
        {formatCount(value)} {value === 1 ? "entry" : "entries"}
      </p>
    </div>
  );
}

export function WeekChart({ days }: Props) {
  const hasHits = days.some((d) => d.hits > 0);
  const ticks = [
    days[0]?.day,
    days[Math.floor((days.length - 1) / 2)]?.day,
    days[days.length - 1]?.day,
  ].filter(Boolean) as string[];

  if (!hasHits) {
    return (
      <div className="flex h-44 items-center justify-center rounded-lg bg-surface px-6 text-center">
        <p className="max-w-xs text-pretty text-sm text-muted">
          Days will fill in here as the door is opened.
        </p>
      </div>
    );
  }

  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={days} barCategoryGap="28%" margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
          <XAxis
            dataKey="day"
            ticks={ticks}
            tickFormatter={formatDay}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-muted)", fontSize: 12 }}
            interval={0}
          />
          <Tooltip
            cursor={{ fill: "color-mix(in oklab, var(--color-fg) 6%, transparent)" }}
            content={<ChartTip />}
            wrapperStyle={{ outline: "none" }}
          />
          <Bar
            dataKey="hits"
            fill="var(--color-accent)"
            radius={[3, 3, 0, 0]}
            maxBarSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
