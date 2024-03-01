"use client";

import React from "react";
import { formatPrice } from "@/lib/utils";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

type Props = {
  data: { name: string; total: number }[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-300">
        <p className="text-sm text-violet-500">{`${label} : ${formatPrice(
          payload[0].value,
          { currency: "GBP" }
        )}`}</p>
      </div>
    );
  }

  return null;
};

const RevenueGraph = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          axisLine
          fontSize={12}
          tickLine={false}
        />

        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine
          tickFormatter={(value) => `$${value}`}
        />

        <Tooltip content={<CustomTooltip />} />

        <Legend align="right" verticalAlign="top" />

        <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueGraph;
