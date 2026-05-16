# 🏗️ Reforma em Controle

> Dashboard financeiro para controle de despesas de obra — construído com Next.js 15, React 19 e shadcn/ui.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SEU_USUARIO/reforma-dashboard)

---

## ✨ Funcionalidades

- **Cards de resumo** — Total, pago, pendente e vencido em tempo real
- **Barra de progresso global** — Visualize o avanço da reforma
- **Gráficos interativos** — Distribuição por categoria e pago vs pendente
- **Tabela expansível** — Parcelas detalhadas por despesa
- **Marcar como pago/pendente** — Clique em cada parcela
- **Adicionar/remover despesas** — Modal completo com validação
- **Próximos vencimentos** — Painel lateral com alertas de atraso
- **Persistência local** — Dados salvos no localStorage

## 📦 Despesas Pré-cadastradas

| Despesa | Valor | Pagamento |
|---|---|---|
| GM Portas – Porta + Dobradiças | R$ 1.338,00 | À vista |
| Cobertura Retrátil (5,30×1,70) | R$ 9.000,00 | R$3.600 entrada + 5× R$1.080 |
| Pedreiro | R$ 3.000,00 | 3× R$1.000 |
| Material OBRAMAX | R$ 3.100,00 | 3× R$1.033 |

## 🚀 Rodando localmente

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy no Vercel

1. Suba o projeto para o GitHub
2. Acesse [vercel.com](https://vercel.com) → **Add New Project**
3. Importe o repositório
4. Clique em **Deploy** — sem variáveis de ambiente necessárias!

## 🛠️ Stack

- [Next.js 15](https://nextjs.org/) — App Router
- [React 19](https://react.dev/)
- [shadcn/ui](https://ui.shadcn.com/) — Componentes acessíveis
- [Recharts](https://recharts.org/) — Gráficos
- [Lucide React](https://lucide.dev/) — Ícones
- [Tailwind CSS v4](https://tailwindcss.com/)
