"use client";

import { useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { SummaryCards } from "@/components/SummaryCards";
import { ExpenseTable } from "@/components/ExpenseTable";
import { ChartSection } from "@/components/ChartSection";
import { UpcomingPanel } from "@/components/UpcomingPanel";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { IncomePanel } from "@/components/IncomePanel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  PlusCircle,
  HardHat,
  RefreshCcw,
  BarChart3,
  LayoutList,
  ArrowDownCircle,
} from "lucide-react";

export default function DashboardPage() {
  const {
    expenses,
    incomes,
    hydrated,
    totalExpenses,
    totalPaid,
    totalPending,
    totalOverdue,
    totalIncomes,
    balance,
    progress,
    upcomingInstallments,
    toggleInstallmentStatus,
    addExpense,
    removeExpense,
    addIncome,
    removeIncome,
    resetToDefaults,
  } = useExpenses();

  const [addOpen, setAddOpen] = useState(false);
  const [view, setView] = useState<"overview" | "list" | "financeiro">("overview");

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#080b14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-gray-500 text-sm">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b14] text-white">
      {/* Background decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-emerald-600/6 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <header className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 bg-indigo-500/15 rounded-xl border border-indigo-500/20">
                <HardHat className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Reforma em{" "}
                  <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    Controle
                  </span>
                </h1>
                <p className="text-gray-500 text-sm">
                  Dashboard financeiro · Rua Carlos Gomes, 224 – Santos/SP
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefaults}
              className="text-gray-500 hover:text-gray-300 hover:bg-white/5 text-xs gap-1.5"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Restaurar padrão
            </Button>
            <Button
              onClick={() => setAddOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="h-4 w-4" />
              Nova Despesa
            </Button>
          </div>
        </header>

        <Separator className="bg-white/5" />

        {/* ── Summary Cards ────────────────────────────────────────────── */}
        <SummaryCards
          totalExpenses={totalExpenses}
          totalPaid={totalPaid}
          totalPending={totalPending}
          totalOverdue={totalOverdue}
          totalIncomes={totalIncomes}
          balance={balance}
          progress={progress}
          expenseCount={expenses.length}
        />

        {/* ── View Toggle ───────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
          <button
            onClick={() => setView("overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === "overview"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Visão Geral
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === "list"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <LayoutList className="h-4 w-4" />
            Despesas
          </button>
          <button
            onClick={() => setView("financeiro")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === "financeiro"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <ArrowDownCircle className="h-4 w-4" />
            Entradas
          </button>
        </div>

        {/* ── Main Content ─────────────────────────────────────────────── */}
        {view === "overview" && (
          <div className="space-y-6">
            <ChartSection expenses={expenses} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-5">
                    Todas as Despesas
                  </h2>
                  <ExpenseTable
                    expenses={expenses}
                    onToggleInstallment={toggleInstallmentStatus}
                    onRemove={removeExpense}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <UpcomingPanel installments={upcomingInstallments} />
                <IncomePanel
                  incomes={incomes}
                  onAdd={addIncome}
                  onRemove={removeIncome}
                />
              </div>
            </div>
          </div>
        )}

        {view === "list" && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
                Gerenciar Despesas
              </h2>
              <Button
                onClick={() => setAddOpen(true)}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold gap-1.5 text-xs"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Adicionar
              </Button>
            </div>
            <ExpenseTable
              expenses={expenses}
              onToggleInstallment={toggleInstallmentStatus}
              onRemove={removeExpense}
            />
          </div>
        )}

        {view === "financeiro" && (
          <div className="max-w-2xl">
            <IncomePanel
              incomes={incomes}
              onAdd={addIncome}
              onRemove={removeIncome}
            />
          </div>
        )}

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer className="text-center py-4 border-t border-white/5">
          <p className="text-xs text-gray-600">
            Reforma em Controle · Dados salvos localmente no seu navegador
          </p>
        </footer>
      </div>

      <AddExpenseModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={addExpense}
      />
    </div>
  );
}
