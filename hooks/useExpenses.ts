"use client";

import { useState, useEffect, useCallback } from "react";
import { Expense, Installment, initialExpenses, PaymentStatus } from "@/lib/data";

const STORAGE_KEY = "reforma-dashboard-expenses-v2";

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Limpa versões antigas do cache ao detectar nova versão
    localStorage.removeItem("reforma-dashboard-expenses");
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setExpenses(JSON.parse(stored));
      } else {
        setExpenses(initialExpenses);
      }
    } catch {
      setExpenses(initialExpenses);
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Expense[]) => {
    setExpenses(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

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
          amount: i === installmentCount - 1
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
      persist([...expenses, newExpense]);
    },
    [expenses, persist]
  );

  const removeExpense = useCallback(
    (expenseId: string) => {
      persist(expenses.filter((e) => e.id !== expenseId));
    },
    [expenses, persist]
  );

  const resetToDefaults = useCallback(() => {
    persist(initialExpenses);
  }, [persist]);

  // ─── Computed stats ────────────────────────────────────────────────────────
  const totalAmount = expenses.reduce((sum, e) => sum + e.totalAmount, 0);
  const totalPaid = expenses.reduce(
    (sum, e) =>
      sum + e.installments.filter((i) => i.status === "pago").reduce((s, i) => s + i.amount, 0),
    0
  );
  const totalPending = totalAmount - totalPaid;
  const progress = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

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
    .slice(0, 5);

  return {
    expenses,
    hydrated,
    totalAmount,
    totalPaid,
    totalPending,
    totalOverdue,
    progress,
    upcomingInstallments,
    toggleInstallmentStatus,
    addExpense,
    removeExpense,
    resetToDefaults,
  };
}
