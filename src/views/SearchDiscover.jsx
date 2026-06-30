import React, { useState, useEffect } from 'react';
import { Search, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchArticles } from '../api';

export default function SearchDiscover({ 
  apiKey, 
  apiProvider, 
  userPreferences, 
  onArticleClick 
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // 10 Trending vectors mapped to our expanded topics
  const trendingVectors = [
    { label: 'SOVEREIGN RESERVES', term: 'macroeconomics debt reserve' },
    { label: 'NEURAL COGNITION', term: 'AI neural learning intelligence' },
    { label: 'BRUTALIST TECTONICS', term: 'brutalist concrete architecture' },
    { label: 'MARITIME CHOKEPOINTS', term: 'chokepoint waterway proxy naval' },
    { label: 'CELEBRITY AVATARS', term: 'avatar celebrity fandom tiktok pop' },
    { label: 'AVANT-GARDE SONICS', term: 'music noise drone chord synthesizers' },
    { label: 'SPIN QUBITS', term: 'quantum qubit cryogenic coherence' },
    { label: 'DEEP CITY STRATA', term: 'subterranean underground excavation metro' },
    { label: 'AEROSOL DEFLECTORS', term: 'climate aerosol geoengineering glaciers' },
    { label: 'LAGRANGIAN ORBITS', term: 'space orbit lagrangian asteroid astra' }
  ];

  const performSearch = async (searchTerm) => {
    setLoading(true);
    setSearched(true);
    try {
      const articles = await fetchArticles({
        apiKey,
        apiProvider,
        query: searchTerm,
        categories: []
      });
      setResults(articles);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query.trim());
    }
  };

  const handleTrendingClick = (term, label) => {
    setQuery(label);
    performSearch(term);
  };

  // Perform initial search with general terms on load
  useEffect(() => {
    performSearch('');
  }, []);

  return (
    <div className="bg-linen w-full min-h-screen py-12 px-6 md:px-[50px] text-left text-obsidian">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header telemetry info */}
        <div className="flex justify-between items-baseline font-sans text-xs tracking-[0.25em] text-sage uppercase border-b border-obsidian/15 pb-4 select-none">
          <span>ARCHIVAL DATABASE // QUERY CONSOLE</span>
          <span>ONLINE QUERY PROTOCOL</span>
        </div>

        {/* Full-width Search Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full relative">
          <div className="flex items-center border-b-[2px] border-obsidian py-4">
            <Search size={24} className="text-obsidian mr-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ENTER VECTOR ARCHIVE SEARCH MATRIX..."
              className="w-full bg-transparent text-xl md:text-3xl font-serif text-obsidian tracking-tight placeholder-obsidian/20 uppercase focus:outline-none"
              id="search-input"
              autoComplete="off"
            />
            <motion.button 
              whileTap={{ scale: 0.94 }}
              type="submit" 
              className="ml-4 font-sans text-xs tracking-widest text-obsidian hover:text-voltage font-bold uppercase transition-colors cursor-pointer focus:outline-none"
            >
              QUERY →
            </motion.button>
          </div>
        </form>

        {/* Trending Vectors (Global Manifests) */}
        <div className="text-left space-y-4">
          <div className="flex items-center space-x-2 text-sage select-none">
            <Compass size={14} />
            <span className="text-xs font-bold tracking-[0.2em] font-sans uppercase">
              TRENDING VECTOR MANIFESTS
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {trendingVectors.map((vector) => (
              <motion.button
                key={vector.label}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTrendingClick(vector.term, vector.label)}
                className={`px-3 py-1.5 text-[10px] font-sans tracking-widest uppercase transition-all duration-200 border rounded-[8px] cursor-pointer focus:outline-none ${
                  query === vector.label 
                    ? 'border-voltage text-voltage bg-voltage/15 font-bold shadow-voltage-glow' 
                    : 'glass-panel text-obsidian border-obsidian/10'
                }`}
              >
                {vector.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Results Catalog */}
        <div className="space-y-6 text-left font-sans">
          <div className="flex justify-between items-baseline font-sans text-xs tracking-[0.2em] text-sage uppercase border-b border-obsidian/15 pb-2 select-none">
            <span>INDEX CATALOG READOUT</span>
            <span>{results.length} SIGNALS FOUND</span>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <span className="font-mono text-xs tracking-widest uppercase text-sage animate-pulse">
                QUERYING DATABANKS // ALIGNING FREQUENCIES...
              </span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-24 text-center font-serif text-xl text-sage uppercase select-none">
              NO MATCHING SIGNALS IN LOGGED MANIFESTS
            </div>
          ) : (
            // Broadsheet Index Listing - styled like stock indices
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs select-none">
                <thead>
                  <tr className="border-b border-obsidian/25 text-sage tracking-wider uppercase text-[10px]">
                    <th className="pb-3 font-medium w-24">01 // DATE</th>
                    <th className="pb-3 font-medium">02 // ARTICLE IDENTIFICATION TITLE</th>
                    <th className="pb-3 font-medium hidden md:table-cell">03 // PUBLISHER</th>
                    <th className="pb-3 font-medium text-right">04 // METRICS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obsidian/10">
                  {results.map((article) => {
                    const dateObj = new Date(article.publishedAt);
                    const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getFullYear()).substring(2)}`;
                    
                    return (
                      <tr 
                        key={article.id}
                        onClick={() => onArticleClick(article)}
                        className="group hover:bg-voltage/5 transition-colors duration-150 cursor-pointer"
                      >
                        {/* Column 1: Date */}
                        <td className="py-5 font-mono text-sage text-left">
                          [{formattedDate}]
                        </td>
                        
                        {/* Column 2: Title and Category */}
                        <td className="py-5 pr-4">
                          <div className="flex flex-col space-y-1">
                            <span className="font-serif text-base text-obsidian font-medium group-hover:text-voltage transition-colors duration-200">
                              {article.title}
                            </span>
                            <span className="text-[9px] text-sage font-bold tracking-widest uppercase flex items-center space-x-1.5">
                              <span>BY {article.author}</span>
                              <span>•</span>
                              <span className="text-obsidian">{article.category}</span>
                            </span>
                          </div>
                        </td>
 
                        {/* Column 3: Publisher */}
                        <td className="py-5 font-medium uppercase tracking-wider text-obsidian hidden md:table-cell">
                          {article.sourceName}
                        </td>
 
                        {/* Column 4: Metrics (Read Time, Score) */}
                        <td className="py-5 text-right font-mono">
                          <div className="flex flex-col items-end">
                            <span className="text-sage">{article.readTime}</span>
                            {article.score !== undefined && (
                              <span className="text-voltage text-[10px] font-bold mt-1">
                                VAL: {article.score.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
