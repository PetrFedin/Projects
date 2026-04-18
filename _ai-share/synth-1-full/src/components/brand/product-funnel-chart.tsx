'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, FunnelChart, Funnel, Tooltip, LabelList, Cell } from 'recharts';

interface ProductFunnelChartProps {
  data: { name: string; value: number; fill: string }[];
}

export function ProductFunnelChart({ data }: ProductFunnelChartProps) {
  const dataWithConversion = data.map((entry, index) => {
    const conversion = index > 0 ? (entry.value / data[index - 1].value) * 100 : 100;
    return { ...entry, conversion };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Воронка продаж</CardTitle>
        <CardDescription>Конверсия на каждом этапе взаимодействия с товаром.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart layout="vertical">
              <Tooltip
                formatter={(value, name) => [
                  typeof value === 'number' ? value.toLocaleString('ru-RU') : value,
                  name,
                ]}
              />
              <Funnel dataKey="value" data={dataWithConversion} isAnimationActive>
                <LabelList
                  position="right"
                  dataKey="name"
                  formatter={(label: string, props: any[]) => {
                    // The `props` argument is an array of props for the labels. We need the first one.
                    if (!props || props.length === 0) return label;
                    const entry = props[0];
                    if (!entry || !entry.payload) return label;

                    const { value, conversion } = entry.payload;
                    const formattedValue =
                      typeof value === 'number' ? value.toLocaleString('ru-RU') : value;

                    if (conversion === undefined || conversion === 100)
                      return `${label}: ${formattedValue}`;

                    return `${label}: ${formattedValue} (${conversion.toFixed(1)}%)`;
                  }}
                  className="fill-foreground text-sm"
                />
                {dataWithConversion.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
