'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MOCK_REVENUE_CHART_DATA, MOCK_MONTHLY_REVENUE_DATA } from '@/lib/mock-data';
import { formatUZS } from '@/lib/utils';

export function RevenueChart() {
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');

  const chartData = view === 'weekly'
    ? MOCK_REVENUE_CHART_DATA.map((item) => ({
        name: item.day,
        value: item.amount,
      }))
    : MOCK_MONTHLY_REVENUE_DATA.map((item) => ({
        name: item.month,
        value: item.revenue,
      }));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Kassaga tushumlar dinamikasi
          </span>
          <div className="text-xl font-extrabold text-white">
            {view === 'weekly' ? 'Haftalik Tushum: ~4,680,000 UZS' : 'Oxirgi 6 oylik o‘sish'}
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setView('weekly')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              view === 'weekly'
                ? 'bg-lime-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Haftalik
          </button>
          <button
            onClick={() => setView('monthly')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              view === 'monthly'
                ? 'bg-lime-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Oylik
          </button>
        </div>
      </div>

      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="limeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#84cc16" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#84cc16" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toLocaleString()}k`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#0f172a] border border-zinc-700/80 p-3 rounded-xl shadow-xl text-xs">
                      <p className="font-semibold text-zinc-400 mb-1">{label}</p>
                      <p className="font-bold text-lime-400 text-sm">
                        {formatUZS(Number(payload[0].value))}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#84cc16"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#limeGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
