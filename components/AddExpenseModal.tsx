"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, type Expense } from "@/lib/data";
import { PlusCircle, Loader2 } from "lucide-react";

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: {
    description: string;
    supplier: string;
    category: Expense["category"];
    totalAmount: number;
    installmentCount: number;
    startDate: string;
    notes?: string;
  }) => void;
}

export function AddExpenseModal({ open, onClose, onAdd }: AddExpenseModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    description: "",
    supplier: "",
    category: "" as Expense["category"] | "",
    totalAmount: "",
    installmentCount: "1",
    startDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.description.trim()) e.description = "Descrição obrigatória";
    if (!form.supplier.trim()) e.supplier = "Fornecedor obrigatório";
    if (!form.category) e.category = "Categoria obrigatória";
    const amount = parseFloat(form.totalAmount.replace(",", "."));
    if (isNaN(amount) || amount <= 0) e.totalAmount = "Valor inválido";
    const count = parseInt(form.installmentCount);
    if (isNaN(count) || count < 1 || count > 60) e.installmentCount = "Entre 1 e 60";
    if (!form.startDate) e.startDate = "Data obrigatória";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    onAdd({
      description: form.description.trim(),
      supplier: form.supplier.trim(),
      category: form.category as Expense["category"],
      totalAmount: parseFloat(form.totalAmount.replace(",", ".")),
      installmentCount: parseInt(form.installmentCount),
      startDate: form.startDate,
      notes: form.notes.trim() || undefined,
    });
    setForm({ description: "", supplier: "", category: "", totalAmount: "", installmentCount: "1", startDate: new Date().toISOString().split("T")[0], notes: "" });
    setErrors({});
    setLoading(false);
    onClose();
  }

  function field(key: string) {
    return (val: string) => setForm((f) => ({ ...f, [key]: val }));
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] bg-[#0f1117] border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
            <PlusCircle className="h-5 w-5 text-indigo-400" />
            Nova Despesa
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            {/* Descrição */}
            <div className="col-span-2 space-y-1">
              <Label className="text-gray-300 text-sm">Descrição *</Label>
              <Input
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500"
                placeholder="Ex: Cimento, Tinta, Elétrica..."
                value={form.description}
                onChange={(e) => field("description")(e.target.value)}
              />
              {errors.description && <p className="text-red-400 text-xs">{errors.description}</p>}
            </div>

            {/* Fornecedor */}
            <div className="space-y-1">
              <Label className="text-gray-300 text-sm">Fornecedor *</Label>
              <Input
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500"
                placeholder="Ex: Leroy Merlin"
                value={form.supplier}
                onChange={(e) => field("supplier")(e.target.value)}
              />
              {errors.supplier && <p className="text-red-400 text-xs">{errors.supplier}</p>}
            </div>

            {/* Categoria */}
            <div className="space-y-1">
              <Label className="text-gray-300 text-sm">Categoria *</Label>
              <Select value={form.category} onValueChange={(val) => val && field("category")(val)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-indigo-500">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1d27] border-white/10 text-white">
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="focus:bg-white/10 focus:text-white">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-400 text-xs">{errors.category}</p>}
            </div>

            {/* Valor */}
            <div className="space-y-1">
              <Label className="text-gray-300 text-sm">Valor Total (R$) *</Label>
              <Input
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500"
                placeholder="0,00"
                value={form.totalAmount}
                onChange={(e) => field("totalAmount")(e.target.value)}
              />
              {errors.totalAmount && <p className="text-red-400 text-xs">{errors.totalAmount}</p>}
            </div>

            {/* Parcelas */}
            <div className="space-y-1">
              <Label className="text-gray-300 text-sm">Nº de Parcelas *</Label>
              <Input
                type="number"
                min={1}
                max={60}
                className="bg-white/5 border-white/10 text-white focus:border-indigo-500"
                value={form.installmentCount}
                onChange={(e) => field("installmentCount")(e.target.value)}
              />
              {errors.installmentCount && <p className="text-red-400 text-xs">{errors.installmentCount}</p>}
            </div>

            {/* Data Início */}
            <div className="space-y-1">
              <Label className="text-gray-300 text-sm">1ª Parcela em *</Label>
              <Input
                type="date"
                className="bg-white/5 border-white/10 text-white focus:border-indigo-500"
                value={form.startDate}
                onChange={(e) => field("startDate")(e.target.value)}
              />
              {errors.startDate && <p className="text-red-400 text-xs">{errors.startDate}</p>}
            </div>

            {/* Observações */}
            <div className="col-span-2 space-y-1">
              <Label className="text-gray-300 text-sm">Observações</Label>
              <Input
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500"
                placeholder="Detalhes adicionais..."
                value={form.notes}
                onChange={(e) => field("notes")(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <PlusCircle className="h-4 w-4 mr-2" />}
              Adicionar Despesa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
