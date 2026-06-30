import React from 'react';
import { Heart, Terminal } from 'lucide-react';

export default function Footer({ setView, telemetry = {} }) {
  const readCount = telemetry.readHistory?.length || 0;
  const categoriesFocused = Object.entries(telemetry.categoryFocus || {})
    .filter(([_, val]) => val > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <footer className="w-full bg-obsidian text-linen border-t border-linen/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-[50px] py-16 md:py-24">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Block: Description & Core Tagline */}
          <div className="lg:col-span-6 flex flex-col space-y-6 text-left">
            <div className="flex items-center space-x-1">
              <span className="font-sans font-bold text-2xl tracking-[0.12em] text-linen">NEW</span>
              <span className="font-sans font-bold text-2xl tracking-[0.12em] text-voltage">FORM</span>
            </div>
            
            <p className="font-serif text-2xl md:text-3xl text-linen/80 leading-relaxed max-w-md">
              THE SIGNAL OVER THE NOISE. NO TRADITIONAL GRID. NO COMPROMISE.
            </p>
            
            <div className="text-xs text-sage font-sans tracking-widest uppercase">
              PUBLISHED BI-DAILY // ZÜRICH & LONDON H.Q.
            </div>
          </div>

          {/* Center Block: Telemetry Quick Readout */}
          <div className="lg:col-span-3 flex flex-col space-y-4 text-left border-l border-linen/10 pl-6">
            <span className="text-xs font-sans tracking-widest text-sage uppercase">READING TELEMETRY</span>
            
            <div className="space-y-2">
              <div className="text-sm font-sans">
                SESSION DIGESTS ACCESSED: <span className="text-voltage font-mono">{readCount}</span>
              </div>
              
              {categoriesFocused.length > 0 ? (
                <div className="text-xs font-sans text-linen/70 leading-relaxed">
                  DOMINANT VECTOR: <span className="text-voltage uppercase">{categoriesFocused[0][0]}</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {categoriesFocused.slice(0, 3).map(([cat, val]) => (
                      <span key={cat} className="px-1.5 py-0.5 bg-linen/5 text-sage text-[10px] uppercase">
                        {cat} ({val})
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs font-sans text-sage">
                  No vectors registered. Complete onboarding or select articles to align signals.
                </div>
              )}
            </div>
          </div>

          {/* Right Block: Navigation Directory */}
          <div className="lg:col-span-3 flex flex-col space-y-4 text-left border-l border-linen/10 pl-6">
            <span className="text-xs font-sans tracking-widest text-sage uppercase">MANIFEST SECTIONS</span>
            <ul className="space-y-2 font-sans text-sm text-linen/70">
              <li>
                <button onClick={() => setView('home')} className="hover:text-voltage transition-colors duration-200">
                  HOME MAGAZINE
                </button>
              </li>
              <li>
                <button onClick={() => setView('onboarding')} className="hover:text-voltage transition-colors duration-200">
                  VECTOR CALIBRATION
                </button>
              </li>
              <li>
                <button onClick={() => setView('search')} className="hover:text-voltage transition-colors duration-200">
                  ARCHIVAL SEARCH
                </button>
              </li>
              <li>
                <button onClick={() => setView('profile')} className="hover:text-voltage transition-colors duration-200">
                  USER CURATION TELEMETRY
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Base */}
        <div className="border-t border-linen/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-sage font-sans tracking-widest space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Terminal size={14} className="text-voltage" />
            <span>NEWFORM EDITORIAL LABS © 2026</span>
          </div>
          
          <div className="flex space-x-6 items-center">
            <span className="flex items-center space-x-1">
              <span>MADE WITH</span>
              <Heart size={10} className="text-voltage fill-voltage" />
              <span>& React</span>
            </span>
            <span>VOLTAGE GRID v4.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
