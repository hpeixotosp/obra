export type PaymentStatus = "pago" | "pendente" | "vencido";
export type Category =
  | "Materiais"
  | "Mao de Obra"
  | "Portas e Janelas"
  | "Estrutura"
  | "Outros";

export interface Installment {
  id: string;
  number: number;
  dueDate: string;
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

export interface Income {
  id: string;
  description: string;
  amount: number;
  date: string;
  notes?: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// Entradas / Receitas
export const initialIncomes: Income[] = [
  {
    id: "entrada-maio",
    description: "Entrada em caixa",
    amount: 8100.0,
    date: "2026-05-15",
    notes: "Disponivel integralmente para a reforma",
  },
];

// Despesas
export const initialExpenses: Expense[] = [

  // GM Portas - LC4 - 4 parcelas de R$334,50 - todas pendentes
  // 1a vence em 25/06, depois mensalmente
  {
    id: "gm-portas",
    description: "Porta Solida Curupixa 210x092 + Dobracas Inox",
    supplier: "GM Portas",
    category: "Portas e Janelas",
    totalAmount: 1338.0,
    notes: "Pedido 18641 - 4x cartao (LC4) - 1a parcela em 25/06",
    createdAt: "2026-05-14",
    installments: [
      { id: generateId(), number: 1, dueDate: "2026-06-25", amount: 334.5,  status: "pendente" },
      { id: generateId(), number: 2, dueDate: "2026-07-25", amount: 334.5,  status: "pendente" },
      { id: generateId(), number: 3, dueDate: "2026-08-25", amount: 334.5,  status: "pendente" },
      { id: generateId(), number: 4, dueDate: "2026-09-25", amount: 334.5,  status: "pendente" },
    ],
  },

  // Cobertura Retratil (Toldo)
  // Entrega estimada: 16/05 + 25 dias = 10/06/2026
  // Entrada na entrega: 10/06 -> R$ 3.600
  // Boletos: 30/60/90/120/150 dias apos entrega
  {
    id: "cobertura-retratil",
    description: "Cobertura Retratil 3 Modulos (5,30 x 1,70) - Policarbonato Alveolar",
    supplier: "Cobertura Retratil",
    category: "Estrutura",
    totalAmount: 9000.0,
    notes: "Aluminio branco - Policarbonato Prata Refletivo - Entrega estimada 10/06 - Entrada na entrega + 5 boletos mensais",
    createdAt: "2026-05-16",
    installments: [
      { id: generateId(), number: 1, dueDate: "2026-06-10", amount: 3600.0, status: "pendente" },
      { id: generateId(), number: 2, dueDate: "2026-07-10", amount: 1080.0, status: "pendente" },
      { id: generateId(), number: 3, dueDate: "2026-08-09", amount: 1080.0, status: "pendente" },
      { id: generateId(), number: 4, dueDate: "2026-09-08", amount: 1080.0, status: "pendente" },
      { id: generateId(), number: 5, dueDate: "2026-10-08", amount: 1080.0, status: "pendente" },
      { id: generateId(), number: 6, dueDate: "2026-11-07", amount: 1080.0, status: "pendente" },
    ],
  },

  // Pedreiro
  // 50% (R$1.500) em 18/05 (segunda-feira)
  // 50% (R$1.500) em 23/05 (5 dias corridos apos 18/05)
  {
    id: "pedreiro",
    description: "Servico de Pedreiro - Reforma Geral",
    supplier: "Pedreiro",
    category: "Mao de Obra",
    totalAmount: 3000.0,
    notes: "50% em 18/05 + 50% em 23/05",
    createdAt: "2026-05-16",
    installments: [
      { id: generateId(), number: 1, dueDate: "2026-05-18", amount: 1500.0, status: "pendente" },
      { id: generateId(), number: 2, dueDate: "2026-05-23", amount: 1500.0, status: "pendente" },
    ],
  },

  // OBRAMAX - Janelas
  // Janela 2FLS C/GR AL BR 100x150cm (2un) R$1.300 + Janela 4FLS C/GD AL BR 120x200cm (1un) R$999,90
  // Total: R$2.299,90 - 3x mensais a partir de 25/06
  {
    id: "obramax-janelas",
    description: "Janelas - 2FLS 100x150cm (x2) e 4FLS 120x200cm (x1)",
    supplier: "OBRAMAX",
    category: "Portas e Janelas",
    totalAmount: 2299.90,
    notes: "3x cartao - 1a parcela em 25/06 - Janela 2FLS x2 (R$1.300) + Janela 4FLS x1 (R$999,90)",
    createdAt: "2026-05-16",
    installments: [
      { id: generateId(), number: 1, dueDate: "2026-06-25", amount: 766.63, status: "pendente" },
      { id: generateId(), number: 2, dueDate: "2026-07-25", amount: 766.63, status: "pendente" },
      { id: generateId(), number: 3, dueDate: "2026-08-25", amount: 766.64, status: "pendente" },
    ],
  },

  // OBRAMAX - Materiais de Construcao
  // Areia, Cimento, Gesso, Lajota Ceramica, Lona Plastica, Massa Corrida, Tabua Pinus, Tijolo Ceramico
  // Total: R$800,10 - 3x mensais a partir de 25/06
  {
    id: "obramax-materiais",
    description: "Materiais de Construcao",
    supplier: "OBRAMAX",
    category: "Materiais",
    totalAmount: 800.10,
    notes: "3x cartao - 1a parcela em 25/06 - Areia, Cimento, Gesso, Lajota, Lona, Massa, Tabua, Tijolo",
    createdAt: "2026-05-16",
    installments: [
      { id: generateId(), number: 1, dueDate: "2026-06-25", amount: 266.70, status: "pendente" },
      { id: generateId(), number: 2, dueDate: "2026-07-25", amount: 266.70, status: "pendente" },
      { id: generateId(), number: 3, dueDate: "2026-08-25", amount: 266.70, status: "pendente" },
    ],
  },
];

export const CATEGORY_COLORS: Record<Category, string> = {
  "Materiais":        "#6366f1",
  "Mao de Obra":      "#f59e0b",
  "Portas e Janelas": "#10b981",
  "Estrutura":        "#3b82f6",
  "Outros":           "#8b5cf6",
};

export const CATEGORIES: Category[] = [
  "Materiais",
  "Mao de Obra",
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
