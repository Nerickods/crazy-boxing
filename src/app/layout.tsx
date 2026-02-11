import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ChatWidget from "@/features/chat/components/ChatWidget";
import { ThemeProvider } from "@/shared/components/ThemeProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mejor Academia de MMA en Guadalajara - Crazy Boxing | Visita GRATIS",
  description: "Entrena Artes Marciales Mixtas en Guadalajara. Clases de Jiu-Jitsu, Muay Thai y Boxeo para todos los niveles. ¡Reserva tu visita gratuita hoy!",
  keywords: "MMA Guadalajara, Jiu Jitsu Guadalajara, Muay Thai Guadalajara, boxeo Guadalajara, artes marciales mixtas Guadalajara, entrenamiento MMA, Crazy Boxing",
  openGraph: {
    title: "Crazy Boxing - Academia de MMA en Guadalajara",
    description: "Domina el combate y transforma tu físico. Primera visita gratuita en la mejor academia de Guadalajara.",
    type: "website",
    locale: "es_MX",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-['Poppins'] bg-white dark:bg-black min-h-screen relative overflow-x-hidden transition-colors duration-300`} suppressHydrationWarning>
        <ThemeProvider>
          {/* Global Mesh Gradient Background - Dark Mode */}
          <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_50%_0%,rgba(60,60,60,0.4),rgba(0,0,0,0)_70%),linear-gradient(180deg,rgba(0,0,0,1)_0%,rgba(20,20,20,1)_100%)] pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500" />

          {/* Light Mode Background - Warm/Luxury */}
          <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.1),rgba(255,255,255,0)_70%),linear-gradient(180deg,#f8f8f8_0%,#ffffff_100%)] pointer-events-none opacity-100 dark:opacity-0 transition-opacity duration-500" />

          {/* Subtle Ambient Glows - Liquid Glass Effect */}
          <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 dark:bg-purple-900/10 blur-[120px] rounded-full pointer-events-none z-[-1] animate-pulse-slow opacity-0 dark:opacity-100" />
          <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 dark:bg-blue-900/10 blur-[120px] rounded-full pointer-events-none z-[-1] animate-pulse-slow opacity-0 dark:opacity-100" style={{ animationDelay: '2s' }} />

          {/* Light Mode Ambient Glows - Yellow/Red as requested */}
          <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none z-[-1] animate-pulse-slow opacity-100 dark:opacity-0" />
          <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-[-1] animate-pulse-slow opacity-100 dark:opacity-0" style={{ animationDelay: '2s' }} />

          {children}
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
