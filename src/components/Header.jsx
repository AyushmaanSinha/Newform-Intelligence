import React, { useState } from 'react';
import { X, Bookmark, Sun, Moon, Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Theme presets matching CSS data-theme attributes
const THEMES = [
  { id: 'organic', label: 'Organic Forest', swatch: ['#faf6f0', '#4a6843', '#96b38a'] },
  { id: 'noir',    label: 'Midnight Noir',   swatch: ['#f5f3f0', '#1a1a1a', '#888888'] },
  { id: 'aurora',  label: 'Aurora Indigo',   swatch: ['#f0f0ff', '#4f46e5', '#a5b4fc'] },
  { id: 'amber',   label: 'Desert Amber',    swatch: ['#fffbf0', '#b45309', '#fcd34d'] },
  { id: 'rose',    label: 'Rose Quartz',     swatch: ['#fff5f7', '#be185d', '#f9a8d4'] },
  { id: 'ocean',   label: 'Ocean Slate',     swatch: ['#f0f7ff', '#0369a1', '#93c5fd'] },
];

export default function Header({ currentView, setView, bookmarksCount = 0, theme, setTheme, colorScheme, setColorScheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const navTo = (view) => {
    if (currentView === view) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setView(view);
    }
    setMenuOpen(false);
    setShowThemePicker(false);
  };

  const handleThemeChange = (schemeId) => {
    setColorScheme(schemeId);
    document.documentElement.setAttribute('data-theme', schemeId);
  };

  const handleModeToggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  return (
    <>
      {/* ── Sticky header bar ── */}
      <header
        className="sticky top-0 w-full z-40 transition-colors duration-300"
        style={{
          background: 'rgba(var(--bg-color-rgb, 250 246 240) / 0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(var(--text-color-rgb, 43 61 38) / 0.08)',
          backgroundColor: 'color-mix(in srgb, var(--bg-color) 82%, transparent)'
        }}
      >
        <div className="px-6 md:px-[50px] py-5 md:py-7 flex items-center justify-between">
          {/* Logo */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navTo('home')}
            className="flex items-center space-x-0.5 cursor-pointer focus:outline-none select-none"
            id="nav-logo"
          >
            <span
              className="font-sans font-bold text-2xl md:text-3xl tracking-[0.12em]"
              style={{ color: 'var(--text-color)' }}
            >NEW</span>
            <span
              className="font-sans font-bold text-2xl md:text-3xl tracking-[0.12em]"
              style={{ color: 'var(--voltage-color)' }}
            >FORM</span>
          </motion.button>

          {/* Controls: mode + palette + menu */}
          <div className="flex items-center space-x-4">
            {/* Light/Dark toggle */}
            <motion.button
              whileTap={{ scale: 0.82, rotate: theme === 'light' ? 30 : -30 }}
              onClick={handleModeToggle}
              className="p-2 cursor-pointer transition-colors focus:outline-none rounded-full"
              style={{ color: 'var(--text-color)' }}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light'
                ? <Moon size={18} />
                : <Sun size={18} style={{ color: 'var(--voltage-color)' }} />
              }
            </motion.button>

            {/* Theme palette picker trigger */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setShowThemePicker(v => !v)}
              className="p-2 cursor-pointer transition-colors focus:outline-none rounded-full"
              style={{ color: showThemePicker ? 'var(--voltage-color)' : 'var(--text-color)' }}
              title="Change Theme"
            >
              <Palette size={18} />
            </motion.button>

            {/* Menu toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => { setMenuOpen(v => !v); setShowThemePicker(false); }}
              className="group flex items-center space-x-2 cursor-pointer font-sans font-semibold uppercase text-xs tracking-[0.22em] focus:outline-none transition-all duration-300"
              style={{ color: 'var(--text-color)' }}
              id="nav-menu-btn"
            >
              <span className="group-hover:opacity-70 transition-opacity">MENU</span>
              <div
                className="flex space-x-[3px] font-bold text-lg overflow-hidden"
                style={{ color: 'var(--voltage-color)' }}
              >
                <motion.span 
                  initial={{ y: 0 }}
                  whileHover={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >|</motion.span>
                <motion.span
                  initial={{ y: 0 }}
                  whileHover={{ y: [0, 4, 0] }}
                  transition={{ duration: 0.4, ease: "easeInOut", delay: 0.1 }}
                >|</motion.span>
              </div>
            </motion.button>
          </div>
        </div>
      </header>

      {/* ── Theme Picker Dropdown ── */}
      <AnimatePresence>
        {showThemePicker && (
          <motion.div
            key="theme-picker"
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[80px] right-6 md:right-[50px] z-50 w-72 rounded-[14px] p-4 space-y-3 shadow-2xl"
            style={{
              background: 'color-mix(in srgb, var(--bg-color) 88%, transparent)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid color-mix(in srgb, var(--text-color) 12%, transparent)'
            }}
          >
            <div className="text-[9px] tracking-[0.3em] uppercase font-bold mb-2" style={{ color: 'var(--sage-color)' }}>
              CHOOSE THEME
            </div>
            {/* Dark mode toggle inside picker */}
            <div
              className="flex items-center justify-between pb-3"
              style={{ borderBottom: '1px solid color-mix(in srgb, var(--text-color) 10%, transparent)' }}
            >
              <span className="text-xs font-sans uppercase tracking-widest" style={{ color: 'var(--text-color)' }}>
                {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleModeToggle}
                className="relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none cursor-pointer"
                style={{ background: theme === 'dark' ? 'var(--voltage-color)' : 'var(--sand-color)' }}
              >
                <motion.div
                  className="absolute top-[3px] w-[18px] h-[18px] rounded-full"
                  animate={{ left: theme === 'dark' ? 'calc(100% - 21px)' : '3px' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  style={{ background: 'var(--bg-color)' }}
                />
              </motion.button>
            </div>

            {/* Palette swatches */}
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map(t => (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleThemeChange(t.id)}
                  className="flex items-center space-x-2 p-2.5 rounded-[10px] cursor-pointer focus:outline-none transition-all"
                  style={{
                    background: colorScheme === t.id
                      ? 'color-mix(in srgb, var(--voltage-color) 15%, transparent)'
                      : 'color-mix(in srgb, var(--text-color) 4%, transparent)',
                    border: colorScheme === t.id
                      ? '1px solid var(--voltage-color)'
                      : '1px solid color-mix(in srgb, var(--text-color) 8%, transparent)'
                  }}
                >
                  {/* Swatch circles */}
                  <div className="flex space-x-0.5 flex-shrink-0">
                    {t.swatch.map((c, i) => (
                      <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <span
                    className="text-[10px] font-sans tracking-wide truncate flex-1 text-left"
                    style={{ color: 'var(--text-color)' }}
                  >
                    {t.label}
                  </span>
                  {colorScheme === t.id && (
                    <Check size={11} style={{ color: 'var(--voltage-color)', flexShrink: 0 }} />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Backdrop to close pickers ── */}
      <AnimatePresence>
        {(showThemePicker && !menuOpen) && (
          <motion.div
            key="picker-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setShowThemePicker(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Full-screen Nav Drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="nav-drawer"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col justify-between p-8 md:p-[80px]"
            style={{
              background: 'var(--menu-overlay)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)'
            }}
          >
            {/* Menu header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-0.5">
                <span className="font-sans font-bold text-2xl tracking-[0.12em]" style={{ color: 'var(--menu-text)' }}>NEW</span>
                <span className="font-sans font-bold text-2xl tracking-[0.12em]" style={{ color: 'var(--menu-accent)' }}>FORM</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setMenuOpen(false)}
                className="flex items-center space-x-2 font-sans text-xs tracking-widest uppercase focus:outline-none transition-colors duration-200 cursor-pointer"
                style={{ color: 'var(--menu-accent)' }}
              >
                <span>CLOSE</span>
                <X size={18} />
              </motion.button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col space-y-6 md:space-y-8 my-auto text-left max-w-4xl">
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--menu-accent)' }}>
                NAVIGATION CATALOG
              </span>
              {[
                { view: 'home',       label: '01. HOME FEED' },
                { view: 'onboarding', label: '02. VECTOR ALIGNMENT' },
                { view: 'search',     label: '03. SEARCH ARCHIVE' },
                { view: 'profile',    label: '04. PROFILE & CURATION' },
              ].map(({ view, label }) => (
                <motion.button
                  key={view}
                  whileHover={{ x: 14 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                  onClick={() => navTo(view)}
                  className="editorial-serif text-5xl md:text-7xl text-left cursor-pointer focus:outline-none transition-colors duration-300"
                  style={{
                    color: currentView === view ? 'var(--menu-accent)' : 'var(--menu-text)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--menu-accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = currentView === view ? 'var(--menu-accent)' : 'var(--menu-text)'}
                >
                  {label}
                </motion.button>
              ))}
            </nav>

            {/* Menu footer */}
            <div
              className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-center text-xs tracking-wider font-sans space-y-4 md:space-y-0"
              style={{ borderTop: '1px solid color-mix(in srgb, var(--menu-text) 12%, transparent)', color: 'var(--menu-accent)' }}
            >
              <span>NEWFORM INTELLIGENCE // v2.0.0</span>
              <div className="flex flex-wrap gap-x-6 gap-y-3 items-center">
                <span className="flex items-center space-x-1.5">
                  <Bookmark size={12} style={{ color: 'var(--menu-accent)' }} />
                  <span>SAVED: {bookmarksCount}</span>
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    localStorage.removeItem('newform_userName');
                    localStorage.removeItem('newform_onboardingCompleted');
                    window.location.reload();
                  }}
                  className="text-[11px] font-sans tracking-widest uppercase cursor-pointer focus:outline-none font-bold"
                  style={{ color: '#f87171' }}
                >
                  DISCONNECT TERMINAL
                </motion.button>
                <span>EST. 2026</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
