import React, { useState, useEffect } from 'react';
import { fetchArticles, getRecommendedArticles, fetchPublicArchiveFeeds } from './api';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginScreen from './views/LoginScreen';
import OnboardingScreen from './views/OnboardingScreen';
import HomeFeed from './views/HomeFeed';
import SearchDiscover from './views/SearchDiscover';
import ProfileDashboard from './views/ProfileDashboard';
import Preloader from './components/Preloader';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to load/save localStorage safely
const getStored = (key, fallback) => {
  try {
    const val = localStorage.getItem(`newform_${key}`);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStored = (key, value) => {
  try {
    localStorage.setItem(`newform_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
};

const DEFAULT_PREFS = {
  Macroeconomics: 0.5,
  'AI Frontiers': 0.5,
  Architecture: 0.5,
  Geopolitics: 0.5,
  'Pop Culture & Celebs': 0.5,
  'Avant-Garde Music': 0.5,
  'Quantum Computing': 0.5,
  'Subterranean Urbanism': 0.5,
  'Climate Futures': 0.5,
  'Astra-Exploration': 0.5,
  Biotechnology: 0.5,
  'Cryptocurrency & Web3': 0.5,
  Neuroscience: 0.5,
  'Renewable Energy': 0.5,
  Cybersecurity: 0.5,
  'Electric Vehicles': 0.5,
  'Future of Work': 0.5,
  'Virtual Reality': 0.5,
  'Healthcare Tech': 0.5,
  'Startup Ecosystems': 0.5
};

const DEFAULT_TELEMETRY_FOCUS = Object.keys(DEFAULT_PREFS).reduce((acc, key) => {
  acc[key] = 0;
  return acc;
}, {});

export default function App() {
  // Global Persisted States
  const [userName, setUserName] = useState(() => getStored('userName', ''));
  const [userPreferences, setUserPreferences] = useState(() => {
    const stored = getStored('userPreferences', {});
    return { ...DEFAULT_PREFS, ...stored };
  });
  const [bookmarks, setBookmarks] = useState(() => getStored('bookmarks', []));
  const [telemetry, setTelemetry] = useState(() => {
    const stored = getStored('telemetry', { readHistory: [], categoryFocus: {} });
    return {
      ...stored,
      categoryFocus: { ...DEFAULT_TELEMETRY_FOCUS, ...(stored.categoryFocus || {}) }
    };
  });
  const [apiKey, setApiKey] = useState(() => getStored('apiKey', ''));
  const [apiProvider, setApiProvider] = useState(() => getStored('apiProvider', 'gnews'));
  const [theme, setTheme] = useState(() => getStored('theme', 'light'));
  const [colorScheme, setColorScheme] = useState(() => getStored('colorScheme', 'organic'));

  // Local UI States
  const [showPreloader, setShowPreloader] = useState(true);
  const [currentView, setView] = useState('gate');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Trigger preloader transition on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    setStored('userName', userName);
    // If userName exists and we were on the gate, push to home
    if (userName && currentView === 'gate') {
      setView('home');
    }
  }, [userName]);

  useEffect(() => {
    setStored('userPreferences', userPreferences);
  }, [userPreferences]);

  useEffect(() => {
    setStored('bookmarks', bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    setStored('telemetry', telemetry);
  }, [telemetry]);

  useEffect(() => {
    setStored('apiKey', apiKey);
  }, [apiKey]);

  useEffect(() => {
    setStored('apiProvider', apiProvider);
  }, [apiProvider]);

  useEffect(() => {
    setStored('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  useEffect(() => {
    setStored('colorScheme', colorScheme);
    document.documentElement.setAttribute('data-theme', colorScheme);
  }, [colorScheme]);

  // Apply saved theme on initial mount
  useEffect(() => {
    const savedScheme = getStored('colorScheme', 'organic');
    document.documentElement.setAttribute('data-theme', savedScheme);
    const savedTheme = getStored('theme', 'light');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Load and score articles whenever preferences or API settings change
  useEffect(() => {
    if (!userName) return;

    const loadArticles = async () => {
      setLoading(true);
      try {
        const activeCats = Object.keys(userPreferences).filter(cat => userPreferences[cat] > 0);
        const rawList = await fetchArticles({
          apiKey,
          apiProvider,
          categories: activeCats
        });
        
        // Fetch live public feeds (arXiv, Spaceflight News) dynamically
        const publicList = await fetchPublicArchiveFeeds();
        const combined = [...rawList, ...publicList];
        
        // De-duplicate by title
        const unique = Array.from(new Map(combined.map(item => [item.title, item])).values());
        
        const ranked = getRecommendedArticles(unique, userPreferences);
        setArticles(ranked);
      } catch (err) {
        console.error("Failed to load article digest:", err);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [userName, userPreferences, apiKey, apiProvider]);

  // Actions
  const handleLogin = (name) => {
    setUserName(name);
    // If new user, show onboarding first, otherwise direct to home
    const onboardingCompleted = getStored('onboardingCompleted', false);
    if (!onboardingCompleted) {
      setView('onboarding');
    } else {
      setView('home');
    }
  };

  const handlePreferencesSaved = (newPrefs) => {
    setUserPreferences(newPrefs);
    setStored('onboardingCompleted', true);
    setView('home');
  };

  const handleToggleBookmark = (article) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.id === article.id);
      if (exists) {
        return prev.filter(b => b.id !== article.id);
      } else {
        return [...prev, article];
      }
    });
  };

  const handleArticleRead = (article) => {
    setTelemetry(prev => {
      // Avoid duplicate counting for exact same article read in same session
      const alreadyRead = prev.readHistory.some(h => h.id === article.id);
      if (alreadyRead) return prev;

      const newHistory = [...prev.readHistory, { id: article.id, category: article.category, title: article.title, timestamp: Date.now() }];
      const newFocus = { ...prev.categoryFocus };
      if (newFocus[article.category] !== undefined) {
        newFocus[article.category] += 1;
      }

      return {
        readHistory: newHistory,
        categoryFocus: newFocus
      };
    });
  };

  const handleResetTelemetry = () => {
    setTelemetry({
      readHistory: [],
      categoryFocus: {
        Macroeconomics: 0,
        'AI Frontiers': 0,
        Architecture: 0,
        Geopolitics: 0,
        'Pop Culture & Celebs': 0,
        'Avant-Garde Music': 0,
        'Quantum Computing': 0,
        'Subterranean Urbanism': 0,
        'Climate Futures': 0,
        'Astra-Exploration': 0
      }
    });
  };

  const handleOpenArticleFromList = (article) => {
    setSelectedArticle(article);
    setView('home');
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showPreloader && <Preloader />}
      </AnimatePresence>

      {!userName || currentView === 'gate' ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <div className="min-h-screen bg-linen flex flex-col justify-between font-sans text-obsidian relative">
          {/* Universal Header */}
          <Header 
            currentView={currentView} 
            setView={(v) => {
              setView(v);
              setSelectedArticle(null);
            }}
            bookmarksCount={bookmarks.length}
            theme={theme}
            setTheme={setTheme}
            colorScheme={colorScheme}
            setColorScheme={setColorScheme}
          />

          {/* Main Content Area */}
          <main className="flex-1 w-full relative overflow-hidden">
            {loading && (
              <div className="absolute top-0 left-0 right-0 h-1 z-50 bg-voltage overflow-hidden select-none">
                <div className="h-full bg-obsidian animate-pulse" style={{ width: '40%' }}></div>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full h-full"
              >
                {currentView === 'home' && (
                  <HomeFeed
                    articles={articles}
                    userPreferences={userPreferences}
                    setUserPreferences={setUserPreferences}
                    bookmarks={bookmarks}
                    toggleBookmark={handleToggleBookmark}
                    onArticleRead={handleArticleRead}
                    initialOpenArticle={selectedArticle}
                    onCloseArticle={() => setSelectedArticle(null)}
                  />
                )}

                {currentView === 'onboarding' && (
                  <OnboardingScreen
                    userPreferences={userPreferences}
                    onPreferencesSaved={handlePreferencesSaved}
                  />
                )}

                {currentView === 'search' && (
                  <SearchDiscover
                    apiKey={apiKey}
                    apiProvider={apiProvider}
                    userPreferences={userPreferences}
                    onArticleClick={handleOpenArticleFromList}
                  />
                )}

                {currentView === 'profile' && (
                  <ProfileDashboard
                    userName={userName}
                    userPreferences={userPreferences}
                    setUserPreferences={setUserPreferences}
                    telemetry={telemetry}
                    bookmarks={bookmarks}
                    toggleBookmark={handleToggleBookmark}
                    onArticleClick={handleOpenArticleFromList}
                    apiKey={apiKey}
                    setApiKey={setApiKey}
                    apiProvider={apiProvider}
                    setApiProvider={setApiProvider}
                    onResetTelemetry={handleResetTelemetry}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Universal Footer */}
          <Footer 
            setView={(v) => {
              setView(v);
              setSelectedArticle(null);
            }}
            telemetry={telemetry}
          />
        </div>
      )}
    </>
  );
}
