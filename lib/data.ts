export type PaymentStatus = "pago" | "pendente" | "vencido";
export type Category =
  | "Materiais"
  | "Mão de Obra"
  | "Portas e Janelas"
  | "Estrutura"
  | "Outros";

export interface Installment {
  id: string;
  number: number;
  dueDate: string; // ISO date string
  amount: number;
  status: PaymentStatus;
}

export interface Expense {
  id: string;
  description: string;
  supplier: string;
  category: Category;
  totalAmount: number;
  installments: Installment[];
  notes?: string;
  createdAt: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export const initialExpenses: Expense[] = [
  // ─── GM Portas ───────────────────────────────────────────────────────────
  {
    id: "gm-portas",
    description: "Porta Sólida Curupixa 210x092 + Dobradiças Inox",
    supplier: "GM Portas",
    category: "Portas e Janelas",
    totalAmount: 1338.0,
    notes: "Pedido 18641 – Pagamento à vista (LC4)",
    createdAt: "2026-05-14",
    installments: [
      {
        id: generateId(),
        number: 1,
        dueDate: "2026-05-14",
        amount: 1338.0,
        status: "pago",
      },
    ],
  },

  // ─── Cobertura Retrátil ──────────────────────────────────────────────────
  {
    id: "cobertura-retratil",
    description: "Cobertura Retrátil 3 Módulos (5,30 × 1,70) – Policarbonato Alveolar",
    supplier: "Cobertura Retrátil",
    category: "Estrutura",
    totalAmount: 9000.0,
    notes:
      "Estrutura em alumínio branco · Policarbonato Prata Refletivo · Prazo 25-30 dias",
    createdAt: "2026-05-16",
    installments: [
      {
        id: generateId(),
        number: 1,
        dueDate: "2026-05-16",
        amount: 3600.0,
        status: "pendente",
      },
      {
        id: generateId(),
        number: 2,
        dueDate: "2026-06-15",
        amount: 1080.0,
        status: "pendente",
      },
      {
        id: generateId(),
        number: 3,
        dueDate: "2026-07-15",
        amount: 1080.0,
        status: "pendente",
      },
      {
        id: generateId(),
        number: 4,
        dueDate: "2026-08-14",
        amount: 1080.0,
        status: "pendente",
      },
      {
        id: generateId(),
        number: 5,
        dueDate: "2026-09-13",
        amount: 1080.0,
        status: "pendente",
      },
      {
        id: generateId(),
        number: 6,
        dueDate: "2026-10-13",
        amount: 1080.0,
        status: "pendente",
      },
    ],
  },

  // ─── Pedreiro ────────────────────────────────────────────────────────────
  {
    id: "pedreiro",
    description: "Serviço de Pedreiro – Reforma Geral",
    supplier: "Pedreiro",
    category: "Mão de Obra",
    totalAmount: 3000.0,
    notes: "Parcelado em 3× sem juros",
    createdAt: "2026-05-16",
    installments: [
      {
        id: generateId(),
        number: 1,
        dueDate: "2026-05-31",
        amount: 1000.0,
        status: "pendente",
      },
      {
        id: generateId(),
        number: 2,
        dueDate: "2026-06-30",
        amount: 1000.0,
        status: "pendente",
      },
      {
        id: generateId(),
        number: 3,
        dueDate: "2026-07-31",
        amount: 1000.0,
        status: "pendente",
      },
    ],
  },

  // ─── OBRAMAX ─────────────────────────────────────────────────────────────
  {
    id: "obramax",
    description: "Material para Obra",
    supplier: "OBRAMAX",
    category: "Materiais",
    totalAmount: 3100.0,
    notes: "Parcelado em 3× no cartão",
    createdAt: "2026-05-16",
    installments: [
      {
        id: generateId(),
        number: 1,
        dueDate: "2026-06-15",
        amount: 1033.33,
        status: "pendente",
      },
      {
        id: generateId(),
        number: 2,
        dueDate: "2026-07-15",
        amount: 1033.33,
        status: "pendente",
      },
      {
        id: generateId(),
        number: 3,
        dueDate: "2026-08-15",
        amount: 1033.34,
        status: "pendente",
      },
    ],
  },
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Materiais: "#6366f1",
  "Mão de Obra": "#f59e0b",
  "Portas e Janelas": "#10b981",
  Estrutura: "#3b82f6",
  Outros: "#8b5cf6",
};

export const CATEGORIES: Category[] = [
  "Materiais",
  "Mão de Obra",
  "Portas e Janelas",
  "Estrutura",
  "Outros",
];

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
}

export function getInstallmentStatus(
  installment: Installment,
  today: Date
): PaymentStatus {
  if (installment.status === "pago") return "pago";
  const [y, m, d] = installment.dueDate.split("-").map(Number);
  const due = new Date(y, m - 1, d);
  return due < today ? "vencido" : "pendente";
}
