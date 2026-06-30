import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const words = [
  "HELLO",       // English
  "BONJOUR",     // French
  "CIAO",        // Italian
  "HOLA",        // Spanish
  "GUTEN TAG",   // German
  "ALOHA",       // Hawaiian
  "NEWFORM"      // Brand
];

export default function Preloader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index === words.length - 1) return;
    const timeout = setTimeout(() => {
      setIndex(prev => prev + 1);
    }, index === 0 ? 380 : 260); // Hold first word slightly longer
    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: index === words.length - 1 ? "-100vh" : 0 }}
      transition={{ 
        duration: 0.85, 
        delay: 0.35, // small delay on the brand word
        ease: [0.76, 0, 0.24, 1] 
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian text-linen select-none pointer-events-none"
      style={{ backgroundColor: '#202c1b' }} // Organic deep forest background
    >
      <div className="text-center relative z-10 flex flex-col items-center">
        {/* Soft pulsing light-green indicator dot */}
        <div className="w-2.5 h-2.5 bg-[#96b38a] rounded-full mb-6 animate-pulse"></div>
        
        {/* Animated word wrapper */}
        <div className="h-16 overflow-hidden relative flex items-center justify-center w-80">
          <motion.p
            key={index}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
            className="font-sans font-extrabold tracking-[0.25em] text-3xl sm:text-4xl text-linen text-center uppercase"
            style={{ color: '#faf6f0' }}
          >
            {words[index]}
          </motion.p>
        </div>
        
        <span className="text-[9px] tracking-[0.4em] text-[#e2d4c0]/55 uppercase mt-4 block">
          CALIBRATING COGNITIVE RECONSTRUCTORS
        </span>
      </div>
    </motion.div>
  );
}
