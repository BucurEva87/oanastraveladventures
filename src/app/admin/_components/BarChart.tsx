"use client"

import {
  Bar,
  BarChart as BarGraph,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import { useTheme } from "next-themes"
import { ChartData } from "../ordersMethods"

export default function BarChart({ data }: { data: ChartData }) {
  const { theme } = useTheme()

  return (
    <ResponsiveContainer
      width={"100%"}
      height={350}
    >
      <BarGraph data={data}>
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="total"
          radius={[4, 4, 0, 0]}
          fill={theme === "light" ? "black" : "white"}
        />
      </BarGraph>
    </ResponsiveContainer>
  )
}
