"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Expense,
  Income,
  Installment,
  initialExpenses,
  initialIncomes,
  PaymentStatus,
} from "@/lib/data";

const STORAGE_KEY = "reforma-dashboard-expenses-v3";
const INCOME_KEY = "reforma-dashboard-incomes-v3";

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Limpa versões antigas do cache
    localStorage.removeItem("reforma-dashboard-expenses");
    localStorage.removeItem("reforma-dashboard-expenses-v2");
    localStorage.removeItem("reforma-dashboard-incomes-v2");

    try {
      const storedExpenses = localStorage.getItem(STORAGE_KEY);
      const storedIncomes = localStorage.getItem(INCOME_KEY);
      setExpenses(storedExpenses ? JSON.parse(storedExpenses) : initialExpenses);
      setIncomes(storedIncomes ? JSON.parse(storedIncomes) : initialIncomes);
    } catch {
      setExpenses(initialExpenses);
      setIncomes(initialIncomes);
    }
    setHydrated(true);
  }, []);

  const persistExpenses = useCallback((next: Expense[]) => {
    setExpenses(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const persistIncomes = useCallback((next: Income[]) => {
    setIncomes(next);
    localStorage.setItem(INCOME_KEY, JSON.stringify(next));
  }, []);

  // ── Expenses actions ────────────────────────────────────────────────────────
  const toggleInstallmentStatus = useCallback(
    (expenseId: string, installmentId: string) => {
      setExpenses((prev) => {
        const next = prev.map((exp) => {
          if (exp.id !== expenseId) return exp;
          return {
            ...exp,
            installments: exp.installments.map((inst) => {
              if (inst.id !== installmentId) return inst;
              const newStatus: PaymentStatus =
                inst.status === "pago" ? "pendente" : "pago";
              return { ...inst, status: newStatus };
            }),
          };
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const addExpense = useCallback(
    (data: {
      description: string;
      supplier: string;
      category: Expense["category"];
      totalAmount: number;
      installmentCount: number;
      startDate: string;
      notes?: string;
    }) => {
      const { description, supplier, category, totalAmount, installmentCount, startDate, notes } = data;
      const perInstallment = totalAmount / installmentCount;
      const installments: Installment[] = Array.from({ length: installmentCount }, (_, i) => {
        const [y, m, d] = startDate.split("-").map(Number);
        const due = new Date(y, m - 1 + i, d);
        const dueDate = `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, "0")}-${String(due.getDate()).padStart(2, "0")}`;
        return {
          id: generateId(),
          number: i + 1,
          dueDate,
          amount:
            i === installmentCount - 1
              ? totalAmount - perInstallment * (installmentCount - 1)
              : perInstallment,
          status: "pendente" as PaymentStatus,
        };
      });

      const newExpense: Expense = {
        id: generateId(),
        description,
        supplier,
        category,
        totalAmount,
        installments,
        notes,
        createdAt: new Date().toISOString().split("T")[0],
      };
      persistExpenses([...expenses, newExpense]);
    },
    [expenses, persistExpenses]
  );

  const removeExpense = useCallback(
    (expenseId: string) => {
      persistExpenses(expenses.filter((e) => e.id !== expenseId));
    },
    [expenses, persistExpenses]
  );

  // ── Income actions ──────────────────────────────────────────────────────────
  const addIncome = useCallback(
    (data: { description: string; amount: number; date: string; notes?: string }) => {
      const newIncome: Income = { id: generateId(), ...data };
      persistIncomes([...incomes, newIncome]);
    },
    [incomes, persistIncomes]
  );

  const removeIncome = useCallback(
    (incomeId: string) => {
      persistIncomes(incomes.filter((i) => i.id !== incomeId));
    },
    [incomes, persistIncomes]
  );

  const resetToDefaults = useCallback(() => {
    persistExpenses(initialExpenses);
    persistIncomes(initialIncomes);
  }, [persistExpenses, persistIncomes]);

  // ── Computed stats ──────────────────────────────────────────────────────────
  const totalExpenses = expenses.reduce((sum, e) => sum + e.totalAmount, 0);
  const totalPaid = expenses.reduce(
    (sum, e) =>
      sum + e.installments.filter((i) => i.status === "pago").reduce((s, i) => s + i.amount, 0),
    0
  );
  const totalPending = totalExpenses - totalPaid;
  const progress = totalExpenses > 0 ? (totalPaid / totalExpenses) * 100 : 0;

  const totalIncomes = incomes.reduce((sum, i) => sum + i.amount, 0);
  const balance = totalIncomes - totalPaid; // saldo disponível (entradas - já pago)

  const today = new Date();
  const totalOverdue = expenses.reduce(
    (sum, e) =>
      sum +
      e.installments
        .filter((i) => {
          if (i.status === "pago") return false;
          const [y, m, d] = i.dueDate.split("-").map(Number);
          return new Date(y, m - 1, d) < today;
        })
        .reduce((s, i) => s + i.amount, 0),
    0
  );

  const upcomingInstallments = expenses
    .flatMap((e) =>
      e.installments
        .filter((i) => i.status !== "pago")
        .map((i) => ({ ...i, expenseDescription: e.description, expenseId: e.id }))
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 6);

  return {
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
  };
}
