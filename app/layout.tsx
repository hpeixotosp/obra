import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Reforma em Controle · Dashboard Financeiro",
  description:
    "Dashboard financeiro para controle de despesas da reforma. Gerencie parcelas, acompanhe pagamentos e visualize o progresso da sua obra.",
  keywords: ["reforma", "controle financeiro", "dashboard", "obra", "despesas"],
  openGraph: {
    title: "Reforma em Controle",
    description: "Dashboard financeiro para controle de despesas da obra.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
