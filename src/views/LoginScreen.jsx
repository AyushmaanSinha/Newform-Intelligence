import React, { useState } from 'react';
import { ArrowRight, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginScreen({ onLogin }) {
  const [name, setName] = useState('');
  const [phrase, setPhrase] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('ALIAS IDENTIFIER IS REQUIRED');
      return;
    }
    setError('');
    onLogin(name.trim());
  };

  return (
    <div className="min-h-screen ambient-mesh-bg text-white flex flex-col justify-between p-6 md:p-[80px] relative overflow-hidden">
      
      {/* Background Decorative Ambient Blur (Floating Green/Blue Orbs) */}
      <div className="absolute top-[20%] left-[15%] w-72 h-72 rounded-full bg-voltage/10 blur-[120px] pointer-events-none select-none"></div>
      <div className="absolute bottom-[30%] right-[10%] w-96 h-96 rounded-full bg-blue-600/10 blur-[150px] pointer-events-none select-none"></div>

      {/* Top Banner */}
      <div className="flex justify-between items-start border-b border-white/10 pb-6 w-full text-xs tracking-[0.25em] font-sans text-white/50 select-none z-10">
        <span>BROADSHEET REGISTRATION // LOG-IN TERMINAL</span>
        <span>SYS.V4.02</span>
      </div>

      {/* Main Form Area */}
      <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full max-w-7xl mx-auto py-12 z-10">
        
        {/* Massive Headline (Left / Span 7) with dynamic fade-in slide-up */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 text-left select-none"
        >
          <h1 className="editorial-serif text-[68px] sm:text-[100px] md:text-[140px] lg:text-[150px] leading-[0.85] tracking-[-0.05em] text-white uppercase font-light">
            THE SIGNAL<br />
            OVER THE<br />
            NOISE.
          </h1>
          
          {/* Accent Line in Voltage Green */}
          <div className="w-16 h-[3px] bg-voltage mt-8 mb-4"></div>
          
          <p className="font-sans text-xs sm:text-sm tracking-[0.1em] text-white/60 uppercase max-w-md mt-6 leading-relaxed">
            A radical curation format rejecting standard layouts, box shadows, and cosmetic buffers. Align your vector profile. Receive raw signal intelligence.
          </p>
        </motion.div>

        {/* Inputs & Entry (Right / Span 5) - GLASSMORPHISM CARD with slide-left */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 text-left glass-panel p-6 md:p-10 rounded-[14px]"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <span className="text-xs font-bold tracking-[0.2em] text-white block border-b border-white/10 pb-2 uppercase">
              CREDENTIAL VECTORS
            </span>

            {/* Input 1: Alias */}
            <div className="space-y-2 relative">
              <label htmlFor="alias-input" className="text-[10px] tracking-[0.2em] font-bold text-white/60 uppercase block">
                01. ALIAS / NOM-DE-PLUME
              </label>
              <div className="flex items-center">
                <User size={14} className="text-white/40 absolute left-0" />
                <input
                  id="alias-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.G. CHRIS_STERLING"
                  className="w-full bg-transparent border-b border-white/20 py-2 pl-6 pr-2 text-sm text-white tracking-wider font-sans uppercase placeholder-white/20 focus:border-voltage outline-none transition-colors duration-200"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Input 2: Phrase */}
            <div className="space-y-2 relative">
              <label htmlFor="phrase-input" className="text-[10px] tracking-[0.2em] font-bold text-white/60 uppercase block">
                02. CRYPTO KEY PHRASE
              </label>
              <div className="flex items-center">
                <Lock size={14} className="text-white/40 absolute left-0" />
                <input
                  id="phrase-input"
                  type="password"
                  value={phrase}
                  onChange={(e) => setPhrase(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent border-b border-white/20 py-2 pl-6 pr-2 text-sm text-white tracking-wider font-sans placeholder-white/20 focus:border-voltage outline-none transition-colors duration-200"
                />
              </div>
            </div>

            {error && (
              <div className="text-xs font-mono text-red-400 tracking-wider">
                ! ERROR: {error}
              </div>
            )}

            {/* Voltage Green CTA Button with signature shadow */}
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                id="login-submit-btn"
                className="w-full bg-voltage text-linen font-sans font-bold text-sm tracking-[0.1em] py-5 px-12 rounded-[10px] uppercase shadow-voltage-glow hover:shadow-voltage-glow-hover transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer group focus:outline-none"
              >
                <span>ENTER NEWFORM</span>
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-200" />
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-t border-white/10 pt-6 w-full text-[10px] tracking-[0.2em] font-sans text-white/40 space-y-2 sm:space-y-0 text-center sm:text-left select-none z-10">
        <span>NEWFORM MAGAZINE INC © 2026 // ALL VECTORS SECURED</span>
        <span>BROADSIDE PRINTING HOUSE // COGNITIVE ALIGNMENT ENGINE</span>
      </div>
    </div>
  );
}
