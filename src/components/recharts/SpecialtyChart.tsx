'use client';

import { PieChart, Pie, Legend, ResponsiveContainer, Sector } from 'recharts';

interface Props {
  data: { name: string; value: number; color: string }[];
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
          content={() => (
            <ul className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-2">
              {data.map((entry) => (
                <li
                  key={entry.name}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name} ({entry.value})
                </li>
              ))}
            </ul>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
