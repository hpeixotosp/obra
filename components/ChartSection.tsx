"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Expense, CATEGORY_COLORS, formatCurrency } from "@/lib/data";

interface ChartSectionProps {
  expenses: Expense[];
}

const RADIAN = Math.PI / 180;

function renderCustomLabel({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}) {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs text-gray-400 mb-1">{payload[0].name}</p>
        <p className="text-white font-bold">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export function ChartSection({ expenses }: ChartSectionProps) {
  // ─── Pie: por categoria ───────────────────────────────────────────────────
  const categoryData = Object.entries(
    expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.totalAmount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // ─── Bar: pago vs pendente por categoria ─────────────────────────────────
  const barData = Object.entries(
    expenses.reduce((acc, e) => {
      const paid = e.installments
        .filter((i) => i.status === "pago")
        .reduce((s, i) => s + i.amount, 0);
      const pending = e.totalAmount - paid;
      if (!acc[e.category]) acc[e.category] = { pago: 0, pendente: 0 };
      acc[e.category].pago += paid;
      acc[e.category].pendente += pending;
      return acc;
    }, {} as Record<string, { pago: number; pendente: number }>)
  ).map(([name, vals]) => ({ name: name.length > 12 ? name.substring(0, 12) + "…" : name, ...vals }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Pie Chart */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-6">
          Distribuição por Categoria
        </h3>
        {categoryData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
            Nenhuma despesa cadastrada
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {categoryData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] ?? "#8b5cf6"}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4">
              {categoryData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] ?? "#8b5cf6",
                    }}
                  />
                  <span className="text-xs text-gray-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bar Chart */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-6">
          Pago vs Pendente por Categoria
        </h3>
        {barData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
            Nenhuma despesa cadastrada
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
                        <p className="text-xs text-gray-400 mb-2">{label}</p>
                        {payload.map((p) => (
                          <p key={p.name} className="text-sm font-semibold" style={{ color: p.color }}>
                            {p.name === "pago" ? "Pago" : "Pendente"}:{" "}
                            {formatCurrency(p.value as number)}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-xs text-gray-400 capitalize">
                    {value === "pago" ? "Pago" : "Pendente"}
                  </span>
                )}
              />
              <Bar dataKey="pago" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pendente" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
