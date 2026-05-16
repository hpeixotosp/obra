"use client";

import { formatCurrency, formatDate, getInstallmentStatus } from "@/lib/data";
import { Clock, ArrowRight } from "lucide-react";

interface UpcomingInstallment {
  id: string;
  number: number;
  dueDate: string;
  amount: number;
  status: string;
  expenseDescription: string;
  expenseId: string;
}

interface UpcomingPanelProps {
  installments: UpcomingInstallment[];
}

export function UpcomingPanel({ installments }: UpcomingPanelProps) {
  const today = new Date();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <Clock className="h-4 w-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
          Próximos Vencimentos
        </h3>
      </div>

      {installments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-gray-500">
          <Clock className="h-8 w-8 mb-2 opacity-30" />
          <p className="text-sm">Tudo pago! 🎉</p>
        </div>
      ) : (
        <div className="space-y-3">
          {installments.map((inst) => {
            const liveStatus = getInstallmentStatus(inst as { id: string; number: number; dueDate: string; amount: number; status: "pago" | "pendente" | "vencido" }, today);
            const isOverdue = liveStatus === "vencido";
            const [y, m, d] = inst.dueDate.split("-").map(Number);
            const due = new Date(y, m - 1, d);
            const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={inst.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isOverdue
                    ? "bg-red-500/10 border border-red-500/20"
                    : "bg-white/5 border border-white/5 hover:bg-white/8"
                }`}
              >
                <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${isOverdue ? "bg-red-500" : "bg-amber-400"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {inst.expenseDescription}
                  </p>
                  <p className="text-xs text-gray-500">
                    Parcela {inst.number}ª · {formatDate(inst.dueDate)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-white tabular-nums">
                    {formatCurrency(inst.amount)}
                  </p>
                  <p className={`text-xs ${isOverdue ? "text-red-400" : "text-gray-500"}`}>
                    {isOverdue
                      ? `${Math.abs(diffDays)}d atraso`
                      : diffDays === 0
                      ? "Hoje"
                      : `em ${diffDays}d`}
                  </p>
                </div>
              </div>
            );
          })}

          {installments.length === 5 && (
            <button className="w-full flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-indigo-400 transition-colors pt-1">
              Ver todos <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
