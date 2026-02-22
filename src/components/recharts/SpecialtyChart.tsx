'use client';

import { PieChart, Pie, Legend, ResponsiveContainer, Sector } from 'recharts';

interface Props {
  data: { name: string; value: number; color: string }[];
}
interface LegendEntry {
  payload: {
    value: number;
  };
}

export default function SpecialtyChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          dataKey="value"
          shape={(props: unknown) => {
            const {
              cx,
              cy,
              innerRadius,
              outerRadius,
              startAngle,
              endAngle,
              index,
            } = props as {
              cx: number;
              cy: number;
              innerRadius: number;
              outerRadius: number;
              startAngle: number;
              endAngle: number;
              index: number;
            };
            return (
              <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={data[index]?.color}
              />
            );
          }}
        />
        <Legend
          formatter={(value, entry) => {
            const typed = entry as unknown as LegendEntry;
            return `${value} (${typed.payload.value})`;
          }}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
