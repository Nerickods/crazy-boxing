'use client';

import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { motion } from "framer-motion";

interface LegalLayoutProps {
    children: React.ReactNode;
}

export default function LegalLayout({ children }: LegalLayoutProps) {
    return (
        <div className="min-h-screen bg-black text-white font-['Poppins'] selection:bg-[var(--accent)] selection:text-black">
            <Header />

            <main className="relative min-h-screen flex flex-col justify-center items-center py-32 px-6">
                {/* Background Layer (Individual pages will provide the image) */}
                <div className="fixed inset-0 z-0">
                    <div className="absolute inset-0 bg-black/60 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-20" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-30 w-full max-w-4xl"
                >
                    {children}
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
