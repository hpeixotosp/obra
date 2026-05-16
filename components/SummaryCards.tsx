"use client";

import { formatCurrency } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import {
  Wallet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowDownCircle,
  Scale,
} from "lucide-react";

interface SummaryCardsProps {
  totalExpenses: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  totalIncomes: number;
  balance: number;
  progress: number;
  expenseCount: number;
}

export function SummaryCards({
  totalExpenses,
  totalPaid,
  totalPending,
  totalOverdue,
  totalIncomes,
  balance,
  progress,
  expenseCount,
}: SummaryCardsProps) {
  const balancePositive = balance >= 0;

  const cards = [
    // ── Linha 1: Entradas / Despesas / Saldo ──────────────────────────────
    {
      label: "Total Entradas",
      value: formatCurrency(totalIncomes),
      sub: "Disponível em caixa",
      icon: ArrowDownCircle,
      gradient: "from-emerald-600/20 to-emerald-900/10",
      border: "border-emerald-500/20",
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      accent: "emerald",
    },
    {
      label: "Total da Reforma",
      value: formatCurrency(totalExpenses),
      sub: `${expenseCount} despesa${expenseCount !== 1 ? "s" : ""} cadastrada${expenseCount !== 1 ? "s" : ""}`,
      icon: Wallet,
      gradient: "from-indigo-600/20 to-indigo-900/10",
      border: "border-indigo-500/20",
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10",
      accent: "indigo",
    },
    {
      label: "Saldo Disponível",
      value: formatCurrency(Math.abs(balance)),
      sub: balancePositive ? "✅ Entradas cobrem as despesas pagas" : "⚠️ Saldo negativo",
      icon: Scale,
      gradient: balancePositive
        ? "from-emerald-600/20 to-emerald-900/10"
        : "from-red-600/20 to-red-900/10",
      border: balancePositive ? "border-emerald-500/20" : "border-red-500/20",
      iconColor: balancePositive ? "text-emerald-400" : "text-red-400",
      iconBg: balancePositive ? "bg-emerald-500/10" : "bg-red-500/10",
      accent: balancePositive ? "emerald" : "red",
      prefix: balancePositive ? "+" : "-",
    },
    // ── Linha 2: Pago / Pendente / Vencido ────────────────────────────────
    {
      label: "Total Pago",
      value: formatCurrency(totalPaid),
      sub: `${progress.toFixed(1)}% da reforma concluído`,
      icon: CheckCircle2,
      gradient: "from-sky-600/20 to-sky-900/10",
      border: "border-sky-500/20",
      iconColor: "text-sky-400",
      iconBg: "bg-sky-500/10",
      accent: "sky",
    },
    {
      label: "A Pagar",
      value: formatCurrency(totalPending),
      sub: "Parcelas ainda pendentes",
      icon: Clock,
      gradient: "from-amber-600/20 to-amber-900/10",
      border: "border-amber-500/20",
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10",
      accent: "amber",
    },
    {
      label: "Vencido",
      value: formatCurrency(totalOverdue),
      sub: totalOverdue > 0 ? "⚠️ Requer atenção imediata" : "Tudo em dia! 🎉",
      icon: totalOverdue > 0 ? AlertTriangle : TrendingUp,
      gradient:
        totalOverdue > 0
          ? "from-red-600/20 to-red-900/10"
          : "from-emerald-600/20 to-emerald-900/10",
      border: totalOverdue > 0 ? "border-red-500/20" : "border-emerald-500/20",
      iconColor: totalOverdue > 0 ? "text-red-400" : "text-emerald-400",
      iconBg: totalOverdue > 0 ? "bg-red-500/10" : "bg-emerald-500/10",
      accent: totalOverdue > 0 ? "red" : "emerald",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Row 1: Entradas · Total · Saldo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.slice(0, 3).map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`relative overflow-hidden rounded-2xl border ${card.border} bg-gradient-to-br ${card.gradient} backdrop-blur-sm p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30`}
            >
              <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-white tabular-nums">
                    {"prefix" in card && card.prefix ? (
                      <span className={card.iconColor}>{card.prefix}</span>
                    ) : null}
                    {card.value}
                  </p>
                </div>
                <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>
              <p className="text-xs text-gray-500">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Row 2: Pago · Pendente · Vencido */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.slice(3).map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`relative overflow-hidden rounded-2xl border ${card.border} bg-gradient-to-br ${card.gradient} backdrop-blur-sm p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30`}
            >
              <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-white tabular-nums">
                    {card.value}
                  </p>
                </div>
                <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>
              <p className="text-xs text-gray-500">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Progress bar global */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-300">
            Progresso geral da reforma
          </span>
          <span className="text-sm font-bold text-indigo-400">
            {progress.toFixed(1)}%
          </span>
        </div>
        <Progress
          value={progress}
          className="h-3 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-emerald-500 [&>div]:transition-all [&>div]:duration-700"
        />
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{formatCurrency(totalPaid)} pago</span>
          <span>{formatCurrency(totalPending)} restante</span>
        </div>
      </div>
    </div>
  );
}
