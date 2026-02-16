'use client';

import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

export default function MissionSection() {
    return (
        <section id="mision" className="relative min-h-[80vh] flex items-center justify-center py-24 overflow-hidden">
            {/* Background Image - Team/Gym Atmosphere */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff"
                    alt="Crazy Boxing Team"
                    className="w-full h-full object-cover"
                />
                {/* Heavy Dark Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/60"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto text-center">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] font-bold tracking-[0.2em] text-xs uppercase mb-6">
                            Nuestra Filosofía (El Credo)
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight uppercase leading-tight">
                            NO ENTRENAMOS PARA EL ESPEJO. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white text-xl md:text-3xl block mt-2">
                                EL FISICO ES LA RECOMPENSA DE CONSOLACION
                            </span>
                        </h2>
                        <h3 className="text-[var(--accent)] text-xl md:text-2xl font-bold tracking-widest uppercase mt-4">
                            ENTRENAMOS PARA LA BATALLA DIARIA.
                        </h3>
                    </motion.div>

                    {/* Manifesto Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative mb-16"
                    >
                        <div className="space-y-6 text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
                            <p>
                                Vivimos en una sociedad adicta a la comodidad y a la queja. En <span className="text-white font-bold">Crazy Boxing</span>, elegimos la fricción.
                            </p>
                            <p>
                                Creemos que el ring es el único lugar donde no puedes mentirte a ti mismo. Allí arriba se caen las máscaras y solo queda tu verdad.
                                No buscamos "cuerpos perfectos", buscamos <span className="text-[var(--accent)] font-bold">caracteres indestructibles</span>.
                            </p>
                            <p>
                                Queremos que la fuerza que ganas aquí dentro sea la que uses fuera para proteger a los tuyos, liderar tu vida y mantenerte en pie cuando el mundo te golpee.
                            </p>
                            <p className="font-medium text-white pt-4">
                                Esto no es fitness. Esto es ingeniería humana basada en tres pilares innegociables:
                            </p>
                        </div>
                    </motion.div>

                    {/* Pillars Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/10">
                        {/* 1. IDENTIDAD */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.0 }}
                            viewport={{ once: true }}
                            className="space-y-3"
                        >
                            <div className="text-4xl mb-2">🛡️</div>
                            <h4 className="text-xl font-black text-white uppercase tracking-wider">IDENTIDAD</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Saber quién eres realmente cuando estás cansado, acorralado y bajo presión.
                            </p>
                        </motion.div>

                        {/* 2. RESILIENCIA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                            className="space-y-3"
                        >
                            <div className="text-4xl mb-2">⚓</div>
                            <h4 className="text-xl font-black text-white uppercase tracking-wider">RESILIENCIA</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                La capacidad de recibir el golpe más duro de la vida, sonreír y seguir avanzando.
                            </p>
                        </motion.div>

                        {/* 3. FE */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            viewport={{ once: true }}
                            className="space-y-3"
                        >
                            <div className="text-4xl mb-2">🙏</div>
                            <h4 className="text-xl font-black text-white uppercase tracking-wider">FE</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                La certeza absoluta de creer en ti mismo y en tu proceso, incluso antes de ver los resultados.
                            </p>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
