import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const contributors = [
  {
    name: "HELENA VANCE",
    role: "CHIEF CORRESPONDENT // MACRO & CLIMATE",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "DR. KAELEN THORNE",
    role: "DIRECTOR // COGNITIVE LABS & COMPUTATION",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "EVELYN STERLING",
    role: "SPATIAL RESEARCHER // TECTONICS & URBAN STRATA",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "MARCUS FINCH",
    role: "FIELD INFORMANTER // NAVAL VECTORS & CHOKEPOINTS",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "AMARA COLE",
    role: "CULTURE ANCHOR // ALGORITHMIC STARDOM & MEDIA",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
  }
];

export default function EditorialBoard() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Track mouse coordinates for image follower
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for a high-end elastic follow effect
  const springConfig = { stiffness: 200, damping: 25, mass: 0.6 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Position relative to the container element
    mouseX.set(e.clientX - rect.left - 120); // Offset half width to center the cursor
    mouseY.set(e.clientY - rect.top - 160);  // Offset half height to center the cursor
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative max-w-7xl mx-auto px-6 md:px-[50px] py-24 select-none overflow-visible"
    >
      {/* Editorial Header */}
      <div className="flex justify-between items-baseline font-sans text-xs tracking-[0.25em] text-sage uppercase border-b border-obsidian/15 pb-4 mb-12">
        <span>NEWFORM EDITORIAL BOARD // CONTRIBUTOR INDEX</span>
        <span>SYS.CONTRIB.05</span>
      </div>

      <div className="flex flex-col relative z-10">
        {contributors.map((member, idx) => {
          const isHovered = hoveredIndex === idx;
          const isAnyHovered = hoveredIndex !== null;
          
          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="py-8 md:py-10 border-b border-obsidian/10 flex flex-col md:flex-row md:items-center justify-between cursor-pointer transition-all duration-300 relative group"
            >
              {/* Tall Display text, inspired by Chorus-Tokyo spacing */}
              <h3 
                className={`condensed-display text-4xl sm:text-5xl md:text-7xl font-bold uppercase transition-all duration-300 leading-none tracking-tighter ${
                  isHovered 
                    ? 'text-voltage translate-x-4' 
                    : isAnyHovered 
                      ? 'text-obsidian/25' 
                      : 'text-obsidian'
                }`}
              >
                {member.name}
              </h3>

              <span 
                className={`font-sans text-[10px] sm:text-xs tracking-[0.15em] font-bold uppercase mt-4 md:mt-0 transition-all duration-300 ${
                  isHovered 
                    ? 'text-obsidian' 
                    : isAnyHovered 
                      ? 'text-sage/35' 
                      : 'text-sage'
                }`}
              >
                {member.role}
              </span>
            </div>
          );
        })}
      </div>

      {/* Floating Image Follower with spring physics and rotation reveals */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          pointerEvents: 'none',
          position: 'absolute',
          width: '240px',
          height: '320px',
          zIndex: 50,
          left: 0,
          top: 0
        }}
        animate={{
          opacity: hoveredIndex !== null ? 1 : 0,
          scale: hoveredIndex !== null ? 1 : 0.8,
          rotate: hoveredIndex !== null ? 3 : -3
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block overflow-hidden bg-obsidian pointer-events-none rounded-[10px] shadow-2xl border border-white/10"
      >
        {contributors.map((member, idx) => (
          <img
            key={idx}
            src={member.image}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 transition-opacity duration-300"
            style={{
              opacity: hoveredIndex === idx ? 1 : 0,
              transform: hoveredIndex === idx ? 'scale(1)' : 'scale(1.15)',
              transition: 'opacity 0.25s ease-in-out, transform 0.4s ease-out'
            }}
          />
        ))}
      </motion.div>
    </section>
  );
}
