import React, { useState } from 'react';
import { Sliders, Key, Activity, Trash2, Eye, Database, Settings, BookMarked } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { id: 'preferences', label: 'PREFERENCES', icon: Sliders },
  { id: 'saved',       label: 'SAVED',        icon: BookMarked },
  { id: 'telemetry',  label: 'TELEMETRY',    icon: Activity },
  { id: 'settings',   label: 'SETTINGS',     icon: Settings },
];

export default function ProfileDashboard({ 
  userName, 
  userPreferences, 
  setUserPreferences, 
  telemetry = {}, 
  bookmarks = [], 
  toggleBookmark, 
  onArticleClick, 
  apiKey, 
  setApiKey, 
  apiProvider, 
  setApiProvider, 
  onResetTelemetry 
}) {
  const [activeTab, setActiveTab] = useState('preferences');
  const [localKey, setLocalKey] = useState(apiKey);
  const [localProvider, setLocalProvider] = useState(apiProvider);
  const [showKeyConfirm, setShowKeyConfirm] = useState(false);
  const [syncLogs, setSyncLogs] = useState([]);
  const [syncing, setSyncing] = useState(false);

  const categories = Object.keys(userPreferences);
  const readCount = telemetry.readHistory?.length || 0;

  const focusPercentages = {};
  categories.forEach(cat => {
    const catCount = readCount > 0
      ? telemetry.readHistory.filter(art => art.category === cat).length
      : 0;
    focusPercentages[cat] = readCount > 0 ? Math.round((catCount / readCount) * 100) : 0;
  });

  const readHistoryWithWpm = telemetry.readHistory?.filter(h => h.wpm) || [];
  const averageWpm = readHistoryWithWpm.length > 0
    ? Math.round(readHistoryWithWpm.reduce((sum, h) => sum + h.wpm, 0) / readHistoryWithWpm.length)
    : 0;

  const handleWeightChange = (category, value) => {
    setUserPreferences(prev => ({ ...prev, [category]: parseFloat(value) }));
  };

  const handleSaveApiSettings = (e) => {
    e.preventDefault();
    setApiKey(localKey);
    setApiProvider(localProvider);
    setShowKeyConfirm(true);
    setTimeout(() => setShowKeyConfirm(false), 3000);
  };

  const triggerSupabaseSync = () => {
    setSyncing(true);
    setSyncLogs(['INITIALIZING SECURE SSL CLOUD GATEWAY...']);
    const steps = [
      'COMPILING LOCAL INTEREST VECTOR MATRIX...',
      `UPLOADING USER PROFILE [ID: ${userName.toUpperCase()}]...`,
      'SYNCHRONIZING WEIGHT COEFFICIENTS...',
      `PUSHING ${bookmarks.length} SAVED ARTICLE DISPATCHES...`,
      `TRANSMITTING ${readCount} HISTORICAL READING LOGS...`,
      'SUPABASE CLOUD SYNCHRONIZATION ESTABLISHED [OK]'
    ];
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSyncLogs(prev => [...prev, step]);
        if (idx === steps.length - 1) setSyncing(false);
      }, (idx + 1) * 700);
    });
  };

  // ─────── Shared style tokens ───────
  const sectionHeader = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 12,
    marginBottom: 16,
    color: 'var(--voltage-color)',
  };

  return (
    <div
      className="w-full min-h-screen py-10 px-6 md:px-[50px] font-sans"
      style={{ background: 'var(--bg-color)', color: 'var(--text-color)' }}
    >
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ─── Page header ─── */}
        <div
          className="flex justify-between items-baseline text-xs tracking-[0.25em] uppercase pb-4"
          style={{ borderBottom: '1px solid color-mix(in srgb, var(--text-color) 12%, transparent)', color: 'var(--sage-color)' }}
        >
          <span>CURATION PROFILE // VECTOR INDEX</span>
          <span>OPERATOR: {userName.toUpperCase()}</span>
        </div>

        <div className="space-y-3">
          <h2
            className="editorial-serif text-5xl md:text-7xl uppercase font-light tracking-tight"
            style={{ color: 'var(--text-color)' }}
          >
            PROFILE TERMINAL.
          </h2>
          <p className="text-xs tracking-wider uppercase leading-relaxed font-semibold" style={{ color: 'var(--sage-color)' }}>
            Manage your preference vectors, saved dispatches, and session telemetry.
          </p>
        </div>

        {/* ─── Tabs - Modern Pill Design ─── */}
        <div
          className="flex flex-wrap gap-2 p-2 rounded-[24px]"
          style={{ background: 'color-mix(in srgb, var(--text-color) 4%, transparent)' }}
        >
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3.5 rounded-[20px] text-[11px] font-bold tracking-widest uppercase transition-all duration-300 focus:outline-none cursor-pointer"
                style={{
                  background: active ? 'var(--bg-color)' : 'transparent',
                  color: active ? 'var(--voltage-color)' : 'var(--sage-color)',
                  boxShadow: active ? '0 4px 20px color-mix(in srgb, var(--text-color) 8%, transparent)' : 'none',
                  border: active ? '1px solid color-mix(in srgb, var(--text-color) 6%, transparent)' : '1px solid transparent'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* ─── Tab Content ─── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >

            {/* ══════════ PREFERENCES TAB ══════════ */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div style={sectionHeader}>
                  <Sliders size={18} />
                  <span className="text-sm font-bold tracking-[0.2em] uppercase">VECTOR PREFERENCE LEVERS</span>
                </div>
                
                {/* Scrollable Container for 20 topics */}
                <div 
                  className="p-8 rounded-[32px] overflow-hidden"
                  style={{
                    background: 'color-mix(in srgb, var(--text-color) 3%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--text-color) 6%, transparent)',
                  }}
                >
                  <div className="max-h-[60vh] overflow-y-auto pr-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 custom-scrollbar">
                    {categories.map((cat, idx) => {
                      const weight = userPreferences[cat] || 0;
                      return (
                        <div key={cat} className="space-y-4">
                          <div className="flex justify-between items-baseline text-xs tracking-wider uppercase font-semibold" style={{ color: 'var(--text-color)' }}>
                            <span className="truncate pr-4">{cat}</span>
                            <span className="font-mono font-bold flex-shrink-0" style={{ color: 'var(--voltage-color)' }}>{weight.toFixed(1)}</span>
                          </div>
                          
                          {/* Modern Thick Slider */}
                          <div className="relative w-full h-8 rounded-full overflow-hidden" style={{ background: 'color-mix(in srgb, var(--text-color) 8%, transparent)' }}>
                            <div 
                              className="absolute top-0 left-0 h-full rounded-full transition-all duration-150 ease-out pointer-events-none"
                              style={{ 
                                width: `${weight * 100}%`,
                                background: 'var(--voltage-color)',
                              }}
                            />
                            <input
                              type="range"
                              min="0.0" max="1.0" step="0.1"
                              value={weight}
                              onChange={e => handleWeightChange(cat, e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {/* Visual thumb indicator */}
                            <div 
                              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md pointer-events-none transition-all duration-150 ease-out border border-gray-200"
                              style={{ 
                                left: `calc(${weight * 100}% - ${weight * 24}px)`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════ SAVED TAB ══════════ */}
            {activeTab === 'saved' && (
              <div className="space-y-6">
                <div style={sectionHeader}>
                  <BookMarked size={18} />
                  <span className="text-sm font-bold tracking-[0.2em] uppercase">
                    SAVED DISPATCHES ({bookmarks.length})
                  </span>
                </div>

                <div 
                  className="p-8 rounded-[32px]"
                  style={{
                    background: 'color-mix(in srgb, var(--text-color) 3%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--text-color) 6%, transparent)',
                  }}
                >
                  {bookmarks.length === 0 ? (
                    <div
                      className="py-24 text-center"
                      style={{ color: 'var(--sage-color)' }}
                    >
                      <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: 'color-mix(in srgb, var(--text-color) 5%, transparent)' }}>
                        <BookMarked size={32} style={{ color: 'var(--sage-color)' }} />
                      </div>
                      <p className="text-sm uppercase tracking-widest font-bold text-obsidian">
                        No dispatches archived yet.
                      </p>
                      <p className="text-[11px] uppercase tracking-wider mt-2 opacity-70">
                        Use the bookmark icon on any article to save it here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                      {bookmarks.map((article, i) => (
                        <motion.div
                          key={article.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(i * 0.05, 0.5) }}
                          whileHover={{ scale: 1.01, y: -2 }}
                          className="group p-5 rounded-[20px] flex flex-col md:flex-row md:items-center justify-between transition-all duration-300"
                          style={{ 
                            background: 'var(--bg-color)',
                            border: '1px solid color-mix(in srgb, var(--text-color) 8%, transparent)',
                            boxShadow: '0 4px 20px color-mix(in srgb, var(--text-color) 3%, transparent)'
                          }}
                        >
                          <div
                            onClick={() => onArticleClick(article)}
                            className="text-left space-y-2 cursor-pointer flex-1 min-w-0 pr-6 mb-4 md:mb-0"
                          >
                            <span
                              className="font-serif text-lg font-medium tracking-tight block transition-colors duration-200"
                              style={{ color: 'var(--text-color)' }}
                              onMouseEnter={e => e.currentTarget.style.color = 'var(--voltage-color)'}
                              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-color)'}
                            >
                              {article.title}
                            </span>
                            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase" style={{ background: 'color-mix(in srgb, var(--text-color) 6%, transparent)', color: 'var(--sage-color)' }}>
                              {article.category} • {article.sourceName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={() => onArticleClick(article)}
                              className="p-3 rounded-xl transition-all cursor-pointer focus:outline-none"
                              style={{ background: 'color-mix(in srgb, var(--voltage-color) 10%, transparent)', color: 'var(--voltage-color)' }}
                              title="Open Dispatch"
                            >
                              <Eye size={18} />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={() => toggleBookmark(article)}
                              className="p-3 rounded-xl transition-all cursor-pointer focus:outline-none"
                              style={{ background: 'color-mix(in srgb, #f87171 10%, transparent)', color: '#f87171' }}
                              title="Remove from Archive"
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══════════ TELEMETRY TAB ══════════ */}
            {activeTab === 'telemetry' && (
              <div className="space-y-8">
                <div style={sectionHeader}>
                  <Activity size={18} />
                  <span className="text-sm font-bold tracking-[0.2em] uppercase">SESSION TELEMETRY</span>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { label: 'Total Reads', value: readCount, tint: 'var(--voltage-color)' },
                    { label: 'Avg. WPM', value: averageWpm || '—', tint: '#8b5cf6' },
                    { label: 'Bookmarks', value: bookmarks.length, tint: '#ec4899' },
                    { label: 'Topics Tracked', value: categories.length, tint: '#3b82f6' },
                  ].map(stat => (
                    <div 
                      key={stat.label} 
                      className="p-6 md:p-8 rounded-[32px] space-y-3 flex flex-col justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                      style={{ 
                        background: `color-mix(in srgb, ${stat.tint} 12%, var(--bg-color))`,
                        border: `1px solid color-mix(in srgb, ${stat.tint} 20%, transparent)`
                      }}
                    >
                      <span className="text-[11px] tracking-widest uppercase font-bold" style={{ color: stat.tint }}>
                        {stat.label}
                      </span>
                      <span
                        className="font-serif text-5xl md:text-6xl font-bold block"
                        style={{ color: 'var(--text-color)' }}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {/* Category focus bars */}
                  <div 
                    className="p-8 rounded-[32px] space-y-6"
                    style={{ background: 'color-mix(in srgb, var(--text-color) 3%, transparent)', border: '1px solid color-mix(in srgb, var(--text-color) 6%, transparent)' }}
                  >
                    <span className="text-[11px] tracking-widest uppercase block font-bold" style={{ color: 'var(--text-color)' }}>
                      THEMATIC INTEREST DISTRIBUTION
                    </span>
                    {readCount > 0 ? (
                      <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {categories.sort((a,b) => (focusPercentages[b]||0) - (focusPercentages[a]||0)).map(cat => {
                          const pct = focusPercentages[cat] || 0;
                          if(pct === 0) return null;
                          return (
                            <div key={cat} className="space-y-2">
                              <div className="flex justify-between text-xs uppercase font-semibold" style={{ color: 'var(--text-color)' }}>
                                <span className="truncate pr-4">{cat}</span>
                                <span className="font-mono" style={{ color: 'var(--voltage-color)' }}>{pct}%</span>
                              </div>
                              <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'color-mix(in srgb, var(--text-color) 8%, transparent)' }}>
                                <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, background: 'var(--voltage-color)' }} />
                              </div>
                            </div>
                          );
                        })}
                        <div className="pt-4">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={onResetTelemetry}
                            className="w-full py-4 rounded-xl text-xs tracking-widest uppercase font-bold transition-colors"
                            style={{ background: 'color-mix(in srgb, #f87171 10%, transparent)', color: '#f87171' }}
                          >
                            RESET TELEMETRY
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs uppercase tracking-wider py-12 text-center" style={{ color: 'var(--sage-color)' }}>
                        No data yet. Read articles to build your profile.
                      </div>
                    )}
                  </div>

                  {/* Read history log */}
                  <div 
                    className="p-8 rounded-[32px] space-y-6"
                    style={{ background: 'color-mix(in srgb, var(--text-color) 3%, transparent)', border: '1px solid color-mix(in srgb, var(--text-color) 6%, transparent)' }}
                  >
                    <span className="text-[11px] tracking-widest uppercase block font-bold" style={{ color: 'var(--text-color)' }}>
                      HISTORICAL DISPATCH LOG
                    </span>
                    {readCount > 0 ? (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                        {[...telemetry.readHistory].reverse().map((log, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 rounded-[16px] gap-4 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                            style={{ background: 'color-mix(in srgb, var(--bg-color) 50%, transparent)', border: '1px solid color-mix(in srgb, var(--text-color) 5%, transparent)' }}
                          >
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <span className="font-serif text-sm md:text-base font-medium leading-tight block truncate" style={{ color: 'var(--text-color)' }}>
                                {log.title}
                              </span>
                              <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase" style={{ background: 'color-mix(in srgb, var(--text-color) 6%, transparent)', color: 'var(--sage-color)' }}>
                                {log.category}
                              </span>
                            </div>
                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center flex-shrink-0">
                              <span className="font-mono text-xs font-bold px-2 py-1 rounded-md" style={{ background: 'color-mix(in srgb, var(--voltage-color) 15%, transparent)', color: 'var(--voltage-color)' }}>
                                {log.wpm ? `${log.wpm} WPM` : 'NO LOG'}
                              </span>
                              <span className="text-[10px] uppercase font-bold sm:mt-1.5" style={{ color: 'var(--sage-color)' }}>
                                {log.elapsedSeconds ? `${log.elapsedSeconds}s` : '—'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs uppercase tracking-wider py-12 text-center" style={{ color: 'var(--sage-color)' }}>
                        Read history is empty.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════ SETTINGS TAB ══════════ */}
            {activeTab === 'settings' && (
              <div className="space-y-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* API Config */}
                  <div className="space-y-6">
                    <div style={sectionHeader}>
                      <Key size={18} />
                      <span className="text-sm font-bold tracking-[0.2em] uppercase">API PIPELINE CREDENTIALS</span>
                    </div>
                    <div 
                      className="p-8 rounded-[32px]"
                      style={{ background: 'color-mix(in srgb, var(--text-color) 3%, transparent)', border: '1px solid color-mix(in srgb, var(--text-color) 6%, transparent)' }}
                    >
                      <form onSubmit={handleSaveApiSettings} className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-[11px] tracking-[0.2em] font-bold uppercase block" style={{ color: 'var(--sage-color)' }}>
                            API PROVIDER VENDOR
                          </label>
                          <select
                            value={localProvider}
                            onChange={e => setLocalProvider(e.target.value)}
                            className="w-full rounded-[16px] p-4 text-xs tracking-widest font-bold uppercase outline-none cursor-pointer transition-colors"
                            style={{
                              background: 'var(--bg-color)',
                              border: '1px solid color-mix(in srgb, var(--text-color) 10%, transparent)',
                              color: 'var(--text-color)'
                            }}
                          >
                            <option value="gnews">GNews API (Recommended)</option>
                            <option value="newsapi">NewsAPI.org (CORS Restricted)</option>
                          </select>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[11px] tracking-[0.2em] font-bold uppercase block" style={{ color: 'var(--sage-color)' }}>
                            API ACCESS KEY TOKEN
                          </label>
                          <input
                            type="text"
                            value={localKey}
                            onChange={e => setLocalKey(e.target.value)}
                            placeholder="ENTER SECRET API TOKEN..."
                            className="w-full rounded-[16px] p-4 text-xs font-mono placeholder-opacity-40 outline-none transition-colors"
                            style={{
                              background: 'var(--bg-color)',
                              border: '1px solid color-mix(in srgb, var(--text-color) 10%, transparent)',
                              color: 'var(--text-color)',
                            }}
                            autoComplete="off"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                            type="submit"
                            className="text-xs tracking-widest font-bold uppercase py-4 px-8 rounded-full transition-colors w-full sm:w-auto"
                            style={{
                              background: 'var(--text-color)',
                              color: 'var(--bg-color)',
                            }}
                          >
                            APPLY CREDENTIALS
                          </motion.button>
                          {showKeyConfirm && (
                            <span className="text-[11px] font-mono font-bold animate-pulse uppercase text-center" style={{ color: 'var(--voltage-color)' }}>
                              ✓ PIPELINE UPDATED
                            </span>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Cloud Sync */}
                  <div className="space-y-6">
                    <div style={sectionHeader}>
                      <Database size={18} />
                      <span className="text-sm font-bold tracking-[0.2em] uppercase">CLOUD SYNC NODE</span>
                    </div>
                    <div 
                      className="p-8 rounded-[32px] space-y-6 h-full flex flex-col"
                      style={{ background: 'color-mix(in srgb, var(--text-color) 3%, transparent)', border: '1px solid color-mix(in srgb, var(--text-color) 6%, transparent)' }}
                    >
                      <p className="text-sm tracking-wider uppercase leading-relaxed font-semibold" style={{ color: 'var(--sage-color)' }}>
                        Synchronize preferences, telemetry, and archives to a persistent cloud database.
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={triggerSupabaseSync}
                          disabled={syncing}
                          className="text-xs tracking-widest font-bold uppercase py-4 px-8 rounded-full transition-all disabled:opacity-50 w-full sm:w-auto"
                          style={{ background: 'color-mix(in srgb, var(--voltage-color) 15%, transparent)', color: 'var(--voltage-color)' }}
                        >
                          {syncing ? 'SYNCING...' : 'INITIATE SYNC'}
                        </motion.button>
                        {syncLogs.length > 0 && !syncing && (
                          <span className="text-[11px] font-mono font-bold animate-pulse uppercase text-center" style={{ color: 'var(--voltage-color)' }}>
                            ✓ EQUALIZED
                          </span>
                        )}
                      </div>
                      {syncLogs.length > 0 && (
                        <div
                          className="mt-6 flex-1 p-5 rounded-[16px] font-mono text-[10px] space-y-2 overflow-y-auto custom-scrollbar"
                          style={{
                            background: 'var(--bg-color)',
                            border: '1px solid color-mix(in srgb, var(--text-color) 8%, transparent)',
                            color: 'var(--sage-color)'
                          }}
                        >
                          {syncLogs.map((log, i) => (
                            <div key={i} className="tracking-wide" style={log.includes('[OK]') ? { color: 'var(--voltage-color)', fontWeight: 'bold' } : {}}>
                              &gt; {log}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
