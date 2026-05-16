"use client";

import { useState } from "react";
import {
  Expense,
  formatCurrency,
  formatDate,
  CATEGORY_COLORS,
  getInstallmentStatus,
} from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Trash2,
  FileText,
} from "lucide-react";

interface ExpenseTableProps {
  expenses: Expense[];
  onToggleInstallment: (expenseId: string, installmentId: string) => void;
  onRemove: (expenseId: string) => void;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "pago")
    return (
      <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 gap-1 text-xs px-2">
        <CheckCircle2 className="h-3 w-3" />
        Pago
      </Badge>
    );
  if (status === "vencido")
    return (
      <Badge className="bg-red-500/15 text-red-400 border border-red-500/30 gap-1 text-xs px-2">
        <AlertTriangle className="h-3 w-3" />
        Vencido
      </Badge>
    );
  return (
    <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 gap-1 text-xs px-2">
      <Clock className="h-3 w-3" />
      Pendente
    </Badge>
  );
}

function ExpenseRow({
  expense,
  onToggle,
  onRemove,
}: {
  expense: Expense;
  onToggle: (installmentId: string) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const today = new Date();

  const paidAmount = expense.installments
    .filter((i) => i.status === "pago")
    .reduce((s, i) => s + i.amount, 0);
  const paidCount = expense.installments.filter((i) => i.status === "pago").length;
  const totalCount = expense.installments.length;
  const color = CATEGORY_COLORS[expense.category] ?? "#8b5cf6";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden transition-all duration-200 hover:border-white/20">
      {/* Header row */}
      <div className="flex items-center gap-4 p-4 sm:p-5">
        {/* Category dot */}
        <div
          className="hidden sm:block w-1.5 h-10 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-semibold text-white truncate text-sm sm:text-base">
              {expense.description}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ color, backgroundColor: color + "20" }}
            >
              {expense.category}
            </span>
            <span className="text-xs text-gray-500">{expense.supplier}</span>
            {expense.notes && (
              <span className="text-xs text-gray-600 hidden sm:block truncate max-w-[200px]">
                <FileText className="h-3 w-3 inline mr-1" />
                {expense.notes}
              </span>
            )}
          </div>
        </div>

        {/* Amounts */}
        <div className="text-right flex-shrink-0 hidden sm:block">
          <p className="font-bold text-white tabular-nums">
            {formatCurrency(expense.totalAmount)}
          </p>
          <p className="text-xs text-gray-500">
            {formatCurrency(paidAmount)} pago
          </p>
        </div>

        {/* Progress mini */}
        <div className="text-center flex-shrink-0">
          <div className="text-xs text-gray-400 mb-1">
            {paidCount}/{totalCount} parcelas
          </div>
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(paidCount / totalCount) * 100}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(!expanded)}
            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 text-gray-600 hover:text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Installments */}
      {expanded && (
        <div className="border-t border-white/5 bg-black/20">
          <div className="p-4 sm:p-5 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Parcelas
            </p>
            {expense.installments.map((inst) => {
              const liveStatus = getInstallmentStatus(inst, today);
              return (
                <div
                  key={inst.id}
                  className="flex items-center gap-3 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
                >
                  <span className="text-xs text-gray-500 w-6 tabular-nums text-right">
                    {inst.number}ª
                  </span>
                  <span className="text-xs text-gray-400 flex-1">
                    Venc. {formatDate(inst.dueDate)}
                  </span>
                  <span className="text-sm font-semibold text-white tabular-nums">
                    {formatCurrency(inst.amount)}
                  </span>
                  <StatusBadge status={liveStatus} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggle(inst.id)}
                    className={`text-xs h-7 px-3 rounded-lg transition-all ${
                      inst.status === "pago"
                        ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        : "text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                    }`}
                  >
                    {inst.status === "pago" ? "Desfazer" : "Marcar pago"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function ExpenseTable({
  expenses,
  onToggleInstallment,
  onRemove,
}: ExpenseTableProps) {
  const [filter, setFilter] = useState<"todos" | "pendente" | "pago">("todos");

  const filtered =
    filter === "todos"
      ? expenses
      : expenses.filter((e) => {
          if (filter === "pago")
            return e.installments.every((i) => i.status === "pago");
          return e.installments.some((i) => i.status !== "pago");
        });

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["todos", "pendente", "pago"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
              filter === f
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {f === "todos" ? "Todas" : f === "pendente" ? "Pendentes" : "Pagas"}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-500 self-center">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Rows */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-gray-500 text-sm">Nenhuma despesa encontrada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((expense) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              onToggle={(instId) => onToggleInstallment(expense.id, instId)}
              onRemove={() => onRemove(expense.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
