import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Reforma Elegante e Sincera na Residencia da Lady",
  description:
    "Dashboard financeiro para controle de despesas da reforma na residencia da Lady. Gerencie parcelas, acompanhe pagamentos e visualize o progresso da obra.",
  keywords: ["reforma", "controle financeiro", "dashboard", "obra", "despesas"],
  openGraph: {
    title: "Reforma Elegante e Sincera na Residencia da Lady",
    description: "Dashboard financeiro para controle de despesas da reforma.",
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
