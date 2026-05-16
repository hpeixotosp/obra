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
  ReferenceLine,
} from "recharts";
import { Expense, Income, CATEGORY_COLORS, formatCurrency } from "@/lib/data";

interface ChartSectionProps {
  expenses: Expense[];
  incomes: Income[];
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
  cx?: number; cy?: number; midAngle?: number;
  innerRadius?: number; outerRadius?: number; percent?: number;
}) {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

const TooltipBox = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; color?: string }[] }) => {
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

const PT_MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

export function ChartSection({ expenses, incomes }: ChartSectionProps) {

  // ── Gráfico 1: Pizza por categoria ───────────────────────────────────────
  const categoryData = Object.entries(
    expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.totalAmount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // ── Gráfico 2: Despesas previstas por mês ────────────────────────────────
  // Agrega TODAS as parcelas (pagas ou não) por mês/ano
  const monthMap: Record<string, number> = {};

  expenses.forEach((exp) => {
    exp.installments.forEach((inst) => {
      const [y, m] = inst.dueDate.split("-").map(Number);
      const key = `${y}-${String(m).padStart(2, "0")}`;
      monthMap[key] = (monthMap[key] || 0) + inst.amount;
    });
  });

  // Receitas por mês (para linha de referência acumulada)
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);

  const monthlyData = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, total]) => {
      const [, m] = key.split("-").map(Number);
      return {
        mes: PT_MONTHS[m - 1],
        total: Math.round(total * 100) / 100,
        label: formatCurrency(total),
      };
    });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

      {/* ── Pizza: Distribuição por Categoria ─────────────────────────── */}
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
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={95}
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
                <Tooltip content={<TooltipBox />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-4">
              {categoryData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] ?? "#8b5cf6" }} />
                  <span className="text-xs text-gray-400">{entry.name}</span>
                  <span className="text-xs text-gray-600">({formatCurrency(entry.value)})</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Barras: Despesas Previstas por Mês ───────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
              Despesas Previstas por Mês
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">Fluxo de caixa · todas as parcelas</p>
          </div>
          {totalIncome > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Caixa disponível</p>
              <p className="text-sm font-bold text-emerald-400">{formatCurrency(totalIncome)}</p>
            </div>
          )}
        </div>

        {monthlyData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
            Nenhuma despesa cadastrada
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData} margin={{ top: 20, right: 4, left: -14, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="mes"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                axisLine={false} tickLine={false}
                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
                        <p className="text-xs text-gray-400 mb-1">{label} / 2026</p>
                        <p className="text-white font-bold text-base">
                          {formatCurrency(payload[0].value as number)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">previsto a pagar</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Linha de referência = total disponível em caixa */}
              {totalIncome > 0 && (
                <ReferenceLine
                  y={totalIncome}
                  stroke="#10b981"
                  strokeDasharray="5 3"
                  strokeWidth={1.5}
                  label={{
                    value: "Caixa disponível",
                    position: "insideTopRight",
                    fill: "#10b981",
                    fontSize: 10,
                  }}
                />
              )}
              <Bar
                dataKey="total"
                name="Previsto"
                radius={[6, 6, 0, 0]}
                maxBarSize={52}
              >
                {monthlyData.map((entry, index) => {
                  // Meses com alto valor ficam em vermelho / laranja
                  const color =
                    entry.total > (totalIncome * 0.6)
                      ? "#f87171"
                      : entry.total > (totalIncome * 0.3)
                      ? "#fb923c"
                      : "#6366f1";
                  return <Cell key={index} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Mini legenda de cores */}
        <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#f87171]" />
            <span className="text-xs text-gray-500">&gt; 60% do caixa</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#fb923c]" />
            <span className="text-xs text-gray-500">&gt; 30% do caixa</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#6366f1]" />
            <span className="text-xs text-gray-500">Controlado</span>
          </div>
          {totalIncome > 0 && (
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="w-4 h-0.5 bg-emerald-500" style={{ borderTop: "2px dashed #10b981" }} />
              <span className="text-xs text-emerald-500/70">Saldo disponível</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
