"use client"

import { Line, LineChart, CartesianGrid, XAxis, Tooltip } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface SentimentChartProps {
  data: {
    date: string;
    sentiment: number;
  }[];
}

const chartConfig = {
  sentiment: {
    label: "Sentiment",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function SentimentChart({ data }: SentimentChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={
            <ChartTooltipContent
              formatter={(value) => (value as number).toFixed(2)}
              indicator="dot"
              labelClassName="font-bold"
            />
          }
          cursor={{
            stroke: "hsl(var(--accent))",
            strokeWidth: 2,
            strokeDasharray: "3 3",
          }}
        />
        <Line
          type="monotone"
          dataKey="sentiment"
          stroke="var(--color-sentiment)"
          strokeWidth={2}
          dot={{
            r: 4,
            fill: "var(--color-sentiment)",
            stroke: "hsl(var(--background))",
            strokeWidth: 2,
          }}
          activeDot={{
            r: 6,
            fill: "var(--color-sentiment)",
            stroke: "hsl(var(--background))",
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ChartContainer>
  )
}
