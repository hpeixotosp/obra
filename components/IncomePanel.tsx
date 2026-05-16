"use client";

import { Income, formatCurrency, formatDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownCircle, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

interface IncomePanelProps {
  incomes: Income[];
  onAdd: (data: { description: string; amount: number; date: string; notes?: string }) => void;
  onRemove: (id: string) => void;
}

export function IncomePanel({ incomes, onAdd, onRemove }: IncomePanelProps) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [error, setError] = useState("");

  const total = incomes.reduce((s, i) => s + i.amount, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(form.amount.replace(",", "."));
    if (!form.description.trim() || isNaN(amount) || amount <= 0) {
      setError("Preencha descrição e valor válido.");
      return;
    }
    onAdd({
      description: form.description.trim(),
      amount,
      date: form.date,
      notes: form.notes.trim() || undefined,
    });
    setForm({ description: "", amount: "", date: new Date().toISOString().split("T")[0], notes: "" });
    setError("");
    setAdding(false);
  }

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ArrowDownCircle className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
            Entradas / Receitas
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-emerald-400 tabular-nums">
            {formatCurrency(total)}
          </span>
          <Button
            size="sm"
            onClick={() => setAdding(!adding)}
            className={`h-7 px-3 text-xs gap-1.5 transition-all ${
              adding
                ? "bg-white/10 text-gray-300 hover:bg-white/15"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {adding ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
            {adding ? "Cancelar" : "Adicionar"}
          </Button>
        </div>
      </div>

      {/* Add form */}
      {adding && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-gray-400">Descrição *</Label>
              <Input
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-8 text-sm focus:border-emerald-500"
                placeholder="Ex: Transferência, Renda, Venda..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Valor (R$) *</Label>
              <Input
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-8 text-sm focus:border-emerald-500"
                placeholder="0,00"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Data *</Label>
              <Input
                type="date"
                className="bg-white/5 border-white/10 text-white h-8 text-sm focus:border-emerald-500"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-gray-400">Observação</Label>
              <Input
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-8 text-sm focus:border-emerald-500"
                placeholder="Opcional..."
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <Button
            type="submit"
            size="sm"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8"
          >
            <Plus className="h-3 w-3 mr-1.5" />
            Registrar Entrada
          </Button>
        </form>
      )}

      {/* Income list */}
      {incomes.length === 0 ? (
        <div className="text-center py-8 text-gray-600 text-sm">
          Nenhuma entrada registrada
        </div>
      ) : (
        <div className="space-y-2">
          {incomes
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((income) => (
              <div
                key={income.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-emerald-500/10 hover:bg-white/8 transition-colors"
              >
                <div className="w-1.5 h-8 rounded-full bg-emerald-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {income.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(income.date)}
                    {income.notes && ` · ${income.notes}`}
                  </p>
                </div>
                <p className="text-sm font-bold text-emerald-400 tabular-nums flex-shrink-0">
                  +{formatCurrency(income.amount)}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(income.id)}
                  className="h-7 w-7 text-gray-600 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
