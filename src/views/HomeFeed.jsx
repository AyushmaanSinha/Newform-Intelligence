import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Calendar, Clock, Sliders, X, Cpu, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EditorialBoard from '../components/EditorialBoard';

export default function HomeFeed({ 
  articles, 
  userPreferences, 
  setUserPreferences, 
  bookmarks, 
  toggleBookmark, 
  onArticleRead,
  initialOpenArticle = null,
  onCloseArticle = () => {}
}) {
  const [activeArticle, setActiveArticle] = useState(initialOpenArticle);
  const [abstract, setAbstract] = useState(null);
  const [generatingAbstract, setGeneratingAbstract] = useState(false);
  const [readingTimeSeconds, setReadingTimeSeconds] = useState(0);
  const [simulatedVector, setSimulatedVector] = useState([]);

  useEffect(() => {
    if (initialOpenArticle) {
      setActiveArticle(initialOpenArticle);
    }
  }, [initialOpenArticle]);

  useEffect(() => {
    let interval;
    if (activeArticle) {
      setReadingTimeSeconds(0);
      setAbstract(null);
      // Generate a simulated 1536 float embeddings vector slice
      const vec = Array.from({ length: 16 }, () => (Math.random() * 2 - 1) / 10);
      setSimulatedVector(vec);

      interval = setInterval(() => {
        setReadingTimeSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeArticle]);

  const handleGenerateAbstract = () => {
    setGeneratingAbstract(true);
    setTimeout(() => {
      let text = "Executive summary synthesized. ";
      if (activeArticle.category === 'Macroeconomics') {
        text += "Systemic debt cycle expansions and sovereign interest rate volatility are accelerating institutional outflows from standard unipolar reserve utilities.";
      } else if (activeArticle.category === 'AI Frontiers') {
        text += "Linear-time state space sequence configurations bypass quadratic attention bottlenecks, scaling real-time cognitive logic in edge silicon.";
      } else if (activeArticle.category === 'Architecture') {
        text += "Brutalist cement monolith structures capture long-term thermal mass efficiencies, offsetting carbon footprints across centuries.";
      } else if (activeArticle.category === 'Geopolitics') {
        text += "Sovereign chokepoints and maritime passages represent high trade vulnerability vectors, driving militarized proxy umbrellas.";
      } else if (activeArticle.category === 'Pop Culture & Celebs') {
        text += "Generative deep-learning avatar portfolios replace biological celebrities, turning fan engagement into a parasocial optimization feedback loop.";
      } else if (activeArticle.category === 'Avant-Garde Music') {
        text += "Sonic noise synthesis models discard western equal temperament scales, exploiting microtonal frequencies to interact with cognitive biology.";
      } else if (activeArticle.category === 'Quantum Computing') {
        text += "Spin qubits cryogenically isolated in silicon heterostructures demonstrate superior coherence thresholds, outscaling classical compute.";
      } else if (activeArticle.category === 'Subterranean Urbanism') {
        text += "Subterranean metro systems and civic structures harness geothermal insulation to mitigate severe climate surface volatility.";
      } else if (activeArticle.category === 'Climate Futures') {
        text += "Stratospheric geoengineering aerosol projects successfully decrease temperatures but threaten to disrupt regional trade rainfall zones.";
      } else if (activeArticle.category === 'Astra-Exploration') {
        text += "Lagrangian orbit refineries manufacture metal reserves off-planet, bypassing Earth drag coefficients and environmental depletion.";
      } else {
        text += "Curation signals aligned. Dispatch parameters normal and verified.";
      }
      setAbstract(text);
      setGeneratingAbstract(false);
    }, 1500);
  };

  const handleMarkReadAndClose = () => {
    if (activeArticle) {
      const wordCount = activeArticle.content.split(/\s+/).length;
      const elapsedSec = Math.max(1, readingTimeSeconds);
      const wpm = Math.round(wordCount / (elapsedSec / 60));
      
      onArticleRead({
        ...activeArticle,
        elapsedSeconds: elapsedSec,
        wpm: wpm
      });
      
      setActiveArticle(null);
      onCloseArticle();
    }
  };

  // If no articles match preferences, show all or default
  const sortedArticles = articles;
  
  if (sortedArticles.length === 0) {
    return (
      <div className="py-24 text-center bg-linen px-6">
        <div className="w-12 h-[2px] bg-voltage mx-auto mb-6"></div>
        <h3 className="editorial-serif text-3xl text-obsidian uppercase">NO STABLE VECTORS REGISTERED</h3>
        <p className="font-sans text-xs tracking-wider text-sage uppercase mt-4 max-w-md mx-auto">
          Please adjust your vector preference configurations or input custom API credentials to align signals.
        </p>
      </div>
    );
  }

  // Hero Unit: Absolute top-recommended article
  const heroArticle = sortedArticles[0];
  // Main Feed: The rest of the articles
  const feedArticles = sortedArticles.slice(1);

  const handleOpenArticle = (article) => {
    setActiveArticle(article);
    onArticleRead(article); // Register telemetry read
  };

  const isBookmarked = (id) => bookmarks.some(b => b.id === id);

  // Adjust preference vectors directly in the reader modal
  const adjustWeight = (category, amount) => {
    const current = userPreferences[category] || 0;
    const nextVal = Math.min(1.0, Math.max(0.0, parseFloat((current + amount).toFixed(1))));
    setUserPreferences(prev => ({
      ...prev,
      [category]: nextVal
    }));
  };

  return (
    <div className="bg-linen w-full min-h-screen pb-24">
      {/* 1. Hero Unit */}
      {heroArticle && (
        <section 
          className="relative max-w-7xl mx-auto px-6 md:px-[50px] pt-12 md:pt-20 pb-20 cursor-pointer group"
          onClick={() => handleOpenArticle(heroArticle)}
          id="hero-section"
        >
          {/* Header metadata */}
          <div className="flex justify-between items-baseline font-sans text-[10px] md:text-xs text-sage tracking-[0.2em] uppercase mb-6 border-b border-obsidian/10 pb-4 select-none">
            <div className="flex space-x-4">
              <span>VOLTAGE SCORE: {(heroArticle.score || 1.0).toFixed(2)}</span>
              <span>•</span>
              <span className="text-voltage font-bold">TOP REC</span>
            </div>
            <div>
              <span>{heroArticle.sourceName}</span>
            </div>
          </div>

          {/* Asymmetric layout wrapper */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start relative">
            {/* Left/Main Column - Title */}
            <div className="lg:col-span-8 text-left z-10">
              {/* Massive Serif Title */}
              <h1 className="editorial-serif text-[42px] sm:text-[70px] md:text-[100px] lg:text-[130px] xl:text-[160px] leading-[0.80] tracking-[-0.05em] text-obsidian uppercase break-words select-all">
                {heroArticle.title}
              </h1>
              
              <div className="mt-8 flex items-center space-x-6 text-xs text-sage font-sans tracking-widest uppercase">
                <span>BY {heroArticle.author}</span>
                <span>•</span>
                <span>{heroArticle.readTime}</span>
              </div>
            </div>

            {/* Right Column - Image & Description */}
            <div className="lg:col-span-4 lg:pt-24 space-y-6 text-left relative">
              {/* Floating desaturated image */}
              <div className="overflow-hidden bg-obsidian aspect-[4/3] w-full relative">
                <img 
                  src={heroArticle.urlToImage} 
                  alt={heroArticle.title}
                  className="w-full h-full object-cover grayscale contrast-125 filter duration-500 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/30 to-transparent mix-blend-multiply"></div>
              </div>

              {/* Description */}
              <p className="font-serif text-lg md:text-xl text-obsidian/85 leading-relaxed pl-2 border-l border-voltage">
                {heroArticle.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Decorative Beat: Voltage tick mark */}
      <div className="max-w-7xl mx-auto px-6 md:px-[50px] py-4 select-none">
        <div className="w-12 h-[2px] bg-voltage"></div>
      </div>

      {/* 2. Curated Feed Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-[50px] py-16">
        <div className="flex justify-between items-baseline font-sans text-xs tracking-[0.25em] text-sage uppercase border-b border-obsidian/10 pb-4 mb-16 select-none">
          <span>CURATED VECTORS // READOUT INITIATED</span>
          <span>EST. {articles.length} SIGNALS</span>
        </div>

        {/* Portfolio Card Feed - completely borderless, generous whitespace */}
        <div className="space-y-24 md:space-y-36">
          {feedArticles.map((article, idx) => {
            const even = idx % 2 === 0;
            return (
              <div 
                key={article.id}
                onClick={() => handleOpenArticle(article)}
                className={`group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${
                  even ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Image Block (Span 5) */}
                <div className={`lg:col-span-5 ${even ? 'lg:order-1' : 'lg:order-2'} overflow-hidden aspect-[16/10] bg-obsidian`}>
                  <img 
                    src={article.urlToImage} 
                    alt={article.title}
                    className="w-full h-full object-cover grayscale contrast-125 filter duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Text Block (Span 7) */}
                <div className={`lg:col-span-7 ${even ? 'lg:order-2' : 'lg:order-1'} text-left space-y-4`}>
                  <div className="flex items-center justify-between font-sans text-[11px] tracking-widest text-sage uppercase select-none">
                    <div className="flex items-center space-x-3">
                      <span>{article.sourceName}</span>
                      <span>•</span>
                      <span className="px-1.5 py-0.5 border border-sage/30 text-[9px]">
                        {article.category}
                      </span>
                    </div>
                    {article.score && (
                      <span className="font-mono text-voltage font-bold">
                        V: {article.score.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <h3 className="editorial-serif text-3xl sm:text-4xl md:text-5xl text-obsidian uppercase leading-[0.95] tracking-tight group-hover:text-voltage transition-colors duration-300">
                    {article.title}
                  </h3>

                  <p className="font-sans font-light text-sm md:text-base text-obsidian/75 leading-relaxed max-w-2xl">
                    {article.description}
                  </p>

                  <div className="flex items-center space-x-6 text-xs text-sage font-sans tracking-widest uppercase select-none pt-2">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Editorial Board Showcase (Skiper6 UI) */}
      <EditorialBoard />

      {/* Decorative Beat: Voltage tick mark */}
      <div className="max-w-7xl mx-auto px-6 md:px-[50px] py-12 flex justify-center select-none">
        <div className="w-12 h-[2px] bg-voltage"></div>
      </div>

      {/* 3. Reader Overlay Modal */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-obsidian/60 backdrop-blur-md z-50 overflow-y-auto flex items-center justify-center p-4 md:p-12"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: 'spring', duration: 0.45, bounce: 0.1 }}
              className="bg-linen w-full max-w-5xl rounded-[14px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
            
            {/* Modal Header */}
            <div className="px-6 md:px-12 py-6 border-b border-obsidian/10 flex items-center justify-between bg-linen">
              <span className="text-[10px] md:text-xs font-sans tracking-widest text-sage uppercase">
                INTELLIGENCE DIGEST // {activeArticle.category}
              </span>
              
              <div className="flex items-center space-x-4">
                {/* Bookmark Toggle */}
                <motion.button 
                  whileTap={{ scale: 0.8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(activeArticle);
                  }}
                  className="p-2 text-obsidian hover:text-voltage focus:outline-none transition-colors duration-200 cursor-pointer"
                  title="Archive Dispatch"
                >
                  {isBookmarked(activeArticle.id) ? (
                    <BookmarkCheck size={20} className="text-voltage fill-voltage/20" />
                  ) : (
                    <Bookmark size={20} />
                  )}
                </motion.button>

                {/* Close Button */}
                <motion.button 
                  whileTap={{ scale: 0.8 }}
                  onClick={() => {
                    setActiveArticle(null);
                    onCloseArticle();
                  }}
                  className="p-2 text-obsidian hover:text-red-500 focus:outline-none transition-colors duration-200 cursor-pointer"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Modal Scroll Content */}
            <div className="px-6 md:px-12 py-8 overflow-y-auto flex-1 text-left space-y-8">
              
              {/* Publication info */}
              <div className="flex flex-wrap gap-4 items-center text-xs text-sage font-sans tracking-widest uppercase">
                <span>{activeArticle.sourceName}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>{new Date(activeArticle.publishedAt).toLocaleDateString()}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{activeArticle.readTime}</span>
                </span>
              </div>

              {/* Title */}
              <h2 className="editorial-serif text-4xl sm:text-5xl md:text-7xl leading-[0.9] tracking-tighter text-obsidian uppercase">
                {activeArticle.title}
              </h2>

              {/* Author */}
              <div className="text-sm font-bold tracking-[0.1em] font-sans text-obsidian uppercase">
                DISPATCH BY {activeArticle.author}
              </div>

              {/* Grayscale Landscape Image */}
              <div className="w-full aspect-[21/9] bg-obsidian overflow-hidden">
                <img 
                  src={activeArticle.urlToImage} 
                  alt={activeArticle.title}
                  className="w-full h-full object-cover grayscale contrast-125"
                />
              </div>

              {/* Full Content */}
              <div className="font-serif text-lg md:text-xl text-obsidian/90 leading-relaxed space-y-6 max-w-3xl">
                <p>{activeArticle.content}</p>
                <p className="text-sm text-sage font-sans uppercase tracking-widest border-t border-obsidian/10 pt-4">
                  [ End of Dispatch. Secure archival copy via primary terminals. ]
                </p>
              </div>
              
               {/* In-place Curation Dashboard */}
              <div className="bg-linen border border-obsidian/15 p-6 rounded-[10px] space-y-4">
                <div className="flex items-center space-x-2 text-voltage">
                  <Sliders size={16} />
                  <span className="text-xs font-bold tracking-[0.2em] font-sans uppercase">
                    FEED VECTOR ADJUSTMENTS
                  </span>
                </div>
                
                <p className="text-xs font-sans text-sage tracking-wider uppercase leading-relaxed">
                  Adjust weight coefficients for <strong className="text-obsidian">{activeArticle.category}</strong>. 
                  Increasing weights pulls related signals into your top recommendations.
                </p>

                <div className="flex items-center space-x-4">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => adjustWeight(activeArticle.category, -0.1)}
                    className="px-4 py-2 border border-obsidian text-obsidian text-xs font-sans tracking-widest uppercase hover:bg-obsidian hover:text-linen transition-colors duration-200 cursor-pointer focus:outline-none"
                  >
                    Reduce Vector (-0.1)
                  </motion.button>

                  <div className="text-sm font-mono font-bold text-obsidian uppercase">
                    Current Alignment: {userPreferences[activeArticle.category]?.toFixed(1) || '0.0'}
                  </div>

                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => adjustWeight(activeArticle.category, 0.1)}
                    className="px-4 py-2 bg-voltage text-obsidian text-xs font-sans font-bold tracking-widest uppercase hover:shadow-voltage-glow transition-all duration-200 cursor-pointer focus:outline-none"
                  >
                    Boost Vector (+0.1)
                  </motion.button>
                </div>
              </div>

              {/* Advanced Curation Integration Section */}
              <div className="border-t border-obsidian/15 pt-6 space-y-6">
                
                {/* 1. AI Curation Abstract Generator */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-voltage font-sans text-xs font-bold uppercase tracking-wider">
                      <Cpu size={14} />
                      <span>COGNITIVE ABSTRACT CORE (GEMINI)</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGenerateAbstract}
                      disabled={generatingAbstract || abstract}
                      className="px-3 py-1 bg-voltage text-obsidian text-[10px] font-sans font-bold tracking-widest uppercase hover:shadow-voltage-glow disabled:opacity-50 transition-opacity cursor-pointer focus:outline-none"
                    >
                      {generatingAbstract ? 'REWRITING...' : abstract ? 'ABSTRACT SECURED' : 'GENERATE TL;DR ABSTRACT'}
                    </motion.button>
                  </div>

                  {generatingAbstract && (
                    <div className="font-mono text-xs text-sage animate-pulse">
                      DEPLOYING COGNITIVE SYNTHESIS VECTOR MATRIX...
                    </div>
                  )}

                  {abstract && (
                    <div className="bg-obsidian/5 dark:bg-white/5 p-4 rounded-[8px] font-serif text-sm italic text-obsidian/85 leading-relaxed border-l-2 border-voltage">
                      "{abstract}"
                    </div>
                  )}
                </div>

                {/* 2. 1536-Dimension Vector Embeddings viewer */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-voltage font-sans text-xs font-bold uppercase tracking-wider">
                    <Activity size={14} />
                    <span>1536-DIMENSION VECTOR EMBEDDINGS</span>
                  </div>

                  <div className="bg-obsidian/5 dark:bg-white/5 p-4 rounded-[8px] space-y-3 font-mono text-[11px] text-obsidian/80 leading-relaxed">
                    <div className="flex justify-between items-baseline border-b border-obsidian/10 pb-1 text-sage text-[9px] tracking-widest uppercase">
                      <span>Article Vector Slice</span>
                      <span>1536 Float Array</span>
                    </div>
                    
                    <div className="overflow-x-auto whitespace-nowrap scrollbar-thin py-1 text-sage select-all">
                      [{simulatedVector.slice(0, 12).map(v => v.toFixed(4)).join(', ')}, ..., {simulatedVector.slice(-4).map(v => v.toFixed(4)).join(', ')}]
                    </div>

                    <div className="flex justify-between items-baseline pt-2 text-[10px] text-obsidian">
                      <span>COSINE SIMILARITY COMPATIBILITY:</span>
                      <span className="text-voltage font-bold">
                        (A • B) / (||A|| ||B||) = {(activeArticle.score || 0.85).toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. WPM Reading Speed Telemetry tracker */}
                <div className="bg-obsidian/5 dark:bg-white/5 p-4 rounded-[8px] flex justify-between items-center text-xs font-sans tracking-widest text-sage uppercase">
                  <span>ACTIVE READING TIMER:</span>
                  <span className="font-mono text-voltage font-bold">{readingTimeSeconds} SECONDS</span>
                </div>

                <div className="flex justify-end pt-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleMarkReadAndClose}
                    className="w-full bg-obsidian text-linen border border-obsidian/20 hover:border-voltage hover:text-voltage font-sans text-xs tracking-widest font-bold uppercase py-4 rounded-[8px] transition-all cursor-pointer shadow-sm hover:shadow-voltage-glow focus:outline-none"
                  >
                    COMPLETE DISPATCH & CALCULATE TELEMETRY
                  </motion.button>
                </div>
              </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
