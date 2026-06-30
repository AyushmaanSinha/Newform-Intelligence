import React, { useState } from 'react';
import { ArrowRight, Check, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OnboardingScreen({ userPreferences, onPreferencesSaved }) {
  // Dynamically initialize selection states from userPreferences prop
  const [preferences, setPreferences] = useState(() => {
    const initial = {};
    Object.keys(userPreferences).forEach(key => {
      initial[key] = userPreferences[key] > 0;
    });
    return initial;
  });

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    const newWeights = {};
    let selectedCount = 0;
    
    Object.keys(preferences).forEach(key => {
      newWeights[key] = preferences[key] ? 1.0 : 0.0;
      if (preferences[key]) selectedCount++;
    });

    // Fallback: If nothing is selected, default all to 1.0 (balanced feed)
    if (selectedCount === 0) {
      Object.keys(newWeights).forEach(key => {
        newWeights[key] = 1.0;
      });
    }

    onPreferencesSaved(newWeights);
  };

  return (
    <div className="w-full min-h-screen bg-linen flex flex-col justify-between py-12 px-6 md:px-[50px] text-obsidian">
      
      {/* Top Section */}
      <div className="max-w-7xl mx-auto w-full flex justify-between items-start border-b border-obsidian/15 pb-6 text-xs tracking-[0.25em] font-sans text-sage select-none">
        <span>CURATE PROFILE // SIGNAL WEIGHTING ALIGNMENT</span>
        <span>STEP 02 OF 02</span>
      </div>

      {/* Main Grid */}
      <div className="my-auto max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 py-12 items-start">
        
        {/* Left Column (Span 7) - Topic Selector */}
        <div className="lg:col-span-7 space-y-10 text-left">
          <div className="space-y-4">
            <h2 className="editorial-serif text-5xl md:text-7xl text-obsidian font-light tracking-tight uppercase select-none">
              SELECT THEMATIC VECTORS.
            </h2>
            <p className="text-xs font-sans text-sage tracking-wider uppercase font-bold select-none">
              ACTIVATE EACH BEAT TO INFLUENCE THE COGNITIVE RECONSTRUCTION ENGINE.
            </p>
          </div>

          {/* Interactive Tags - 2-Column Responsive Grid with Frosted Glass Panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(preferences).map((category, index) => {
              const active = preferences[category];
              return (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => togglePreference(category)}
                  className={`w-full text-left p-5 rounded-[12px] flex justify-between items-center cursor-pointer focus:outline-none transition-all duration-300 ${
                    active 
                      ? 'bg-voltage/15 border-2 border-voltage shadow-voltage-glow' 
                      : 'glass-panel hover:bg-obsidian/5 border border-obsidian/10'
                  }`}
                  id={`onboarding-vector-${index}`}
                >
                  <div className="flex items-baseline space-x-4">
                    <span className="font-mono text-[10px] text-sage select-none">
                      {String(index + 1).padStart(2, '0')}.
                    </span>
                    
                    {/* Big title that lights up with active colors */}
                    <span 
                      className={`font-serif text-lg tracking-[-0.03em] uppercase transition-colors duration-200 relative ${
                        active 
                          ? 'text-voltage font-bold' 
                          : 'text-obsidian'
                      }`}
                    >
                      {category}
                    </span>
                  </div>

                  {/* Circle check indicator */}
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    active 
                      ? 'border-voltage bg-voltage/10 text-voltage' 
                      : 'border-obsidian/20 text-transparent group-hover:border-obsidian/45'
                  }`}>
                    <Check size={10} strokeWidth={active ? 3 : 1.5} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right Column (Span 5) - Explanation & Side Panel */}
        <div className="lg:col-span-5 text-left border-l border-obsidian/15 lg:pl-12 py-4 space-y-8 h-full flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-voltage select-none">
              <Radio size={16} className="animate-pulse" />
              <span className="text-xs font-bold tracking-[0.25em] font-sans uppercase">COGNITIVE MATCHING CORE</span>
            </div>

            <p className="font-serif text-lg leading-relaxed text-obsidian/90">
              "We reject the standard grid. News density is calculated by interest proximity, not clicking velocity."
            </p>

            <div className="space-y-4 font-sans text-xs text-sage leading-relaxed tracking-wider uppercase">
              <p>
                The NewForm recommendation core models your reading profile as a multidimensional vector. Every article carries static and dynamic vector coefficients.
              </p>
              <p>
                When you click <strong className="text-obsidian">BUILD SIGNAL FEED</strong>, we compute the compatibility coefficient. Articles scoring below <span className="text-voltage font-mono">0.05</span> are pruned immediately, removing noise.
              </p>
              <p>
                You can fine-tune these coefficients in the Curation Dashboard at any time to balance macroeconomic reports against raw geopolitical intelligence, space exploration, and pop culture.
              </p>
            </div>
          </div>

          {/* Curation Submit Button with click feedbacks */}
          <div className="pt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSave}
              id="onboarding-submit-btn"
              className="w-full bg-voltage text-linen font-sans font-bold text-sm tracking-[0.1em] py-5 px-12 rounded-[10px] uppercase shadow-voltage-glow hover:shadow-voltage-glow-hover transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer group"
            >
              <span>BUILD SIGNAL FEED</span>
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-200" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto w-full border-t border-obsidian/15 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] tracking-[0.25em] font-sans text-sage space-y-2 sm:space-y-0 text-center sm:text-left select-none">
        <span>NEWFORM EDITORIAL COGNITION // VECTOR SPACE ALIGNED</span>
        <span>EST. 2026 // ALL SIGNALS NORMALIZED</span>
      </div>
    </div>
  );
}
