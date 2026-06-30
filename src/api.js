import { mockArticles } from './mockData';

/**
 * Calculates a recommendation score for an article based on user preference vectors.
 * User weights are object: { Macroeconomics: number, AIFrontiers: number, Architecture: number, Geopolitics: number }
 * Article vector weights are similar.
 */
export function calculateArticleScore(article, userPreferences) {
  if (!article.vectorWeights || !userPreferences) return 0;
  
  let score = 0;
  // Calculate dot product of weights
  Object.keys(userPreferences).forEach(category => {
    const userWeight = userPreferences[category] || 0;
    const articleWeight = article.vectorWeights[category] || 0;
    score += userWeight * articleWeight;
  });
  
  return score;
}

/**
 * Sorts and filters articles based on recommendation score.
 */
export function getRecommendedArticles(articles, userPreferences, minScore = 0.05) {
  return articles
    .map(article => ({
      ...article,
      score: calculateArticleScore(article, userPreferences)
    }))
    // We want to keep articles that have at least some relevance
    .filter(article => article.score >= minScore)
    .sort((a, b) => b.score - a.score || new Date(b.publishedAt) - new Date(a.publishedAt));
}

/**
 * Fetches articles from live API if configured, otherwise returns mock data.
 * Consolidates the response format so the UI doesn't break.
 */
export async function fetchArticles({ apiKey, apiProvider, query, categories = [] } = {}) {
  // If no API key, use mock data
  if (!apiKey) {
    return filterMockData({ query, categories });
  }

  try {
    let url = '';
    const q = query || categories.join(' OR ') || 'finance economics AI technology';
    
    if (apiProvider === 'gnews') {
      url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&token=${apiKey}&lang=en&max=10`;
    } else {
      // Default to NewsAPI (fails on client-side localhost CORS sometimes, but user can use it behind proxies or for testing)
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&apiKey=${apiKey}&pageSize=10`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API response status: ${response.status}`);
    }

    const data = await response.json();
    const rawArticles = data.articles || [];

    // Map external API articles to our standard internal format, synthesising vector weights based on keyword heuristics
    return rawArticles.map((art, idx) => {
      const title = art.title || '';
      const desc = art.description || '';
      const content = art.content || desc || '';
      
      // Auto-categorize based on keywords to assign vector weights
      const category = determineCategory(title + ' ' + desc);
      const vectorWeights = getVectorWeightsForCategory(category);

      return {
        id: `api-art-${idx}-${Date.now()}`,
        title: title.toUpperCase(),
        description: desc,
        content: content,
        publishedAt: art.publishedAt || new Date().toISOString(),
        sourceName: art.source?.name || art.source || 'Global Bureau',
        category: category,
        readTime: `${Math.max(4, Math.round((content.split(' ').length || 200) / 180))} min read`,
        author: art.author || 'Staff Correspondent',
        urlToImage: art.image || art.urlToImage || getRandomPlaceholderImage(category),
        url: art.url,
        vectorWeights
      };
    });
  } catch (error) {
    console.warn("Live API fetch failed, falling back to mock data.", error);
    // Fallback to local mock data
    return filterMockData({ query, categories });
  }
}

// Helper to filter local mock data by query or categories
function filterMockData({ query, categories }) {
  let list = [...mockArticles];

  if (categories && categories.length > 0) {
    list = list.filter(art => categories.includes(art.category));
  }

  if (query) {
    const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (keywords.length > 0) {
      list = list.filter(art => {
        const textToSearch = (
          art.title + ' ' + 
          art.description + ' ' + 
          art.content + ' ' + 
          art.author + ' ' + 
          art.category
        ).toLowerCase();
        
        // Match if any of the keywords are present in the text (OR match)
        return keywords.some(keyword => textToSearch.includes(keyword));
      });
    }
  }

  return list;
}

// Simple heuristic to determine topic category
function determineCategory(text) {
  const t = text.toLowerCase();
  if (t.includes('quantum') || t.includes('qubit') || t.includes('cryogenic') || t.includes('coherence')) {
    return 'Quantum Computing';
  }
  if (t.includes('ai') || t.includes('neural') || t.includes('compute') || t.includes('model') || t.includes('software') || t.includes('intelligence') || t.includes('transformer') || t.includes('algorithm')) {
    return 'AI Frontiers';
  }
  if (t.includes('music') || t.includes('chord') || t.includes('sonic') || t.includes('sound') || t.includes('microtonal') || t.includes('synthesis')) {
    return 'Avant-Garde Music';
  }
  if (t.includes('celeb') || t.includes('pop') || t.includes('culture') || t.includes('fandom') || t.includes('avatar') || t.includes('tiktok') || t.includes('viral')) {
    return 'Pop Culture & Celebs';
  }
  if (t.includes('subterranean') || t.includes('underground') || t.includes('tunnel') || t.includes('excavation') || t.includes('boring')) {
    return 'Subterranean Urbanism';
  }
  if (t.includes('architecture') || t.includes('concrete') || t.includes('building') || t.includes('monument') || t.includes('brutalist') || t.includes('urban') || t.includes('street') || t.includes('zoning')) {
    return 'Architecture';
  }
  if (t.includes('climate') || t.includes('carbon') || t.includes('planetary') || t.includes('sulfate') || t.includes('geoengineering') || t.includes('glacier') || t.includes('drought')) {
    return 'Climate Futures';
  }
  if (t.includes('space') || t.includes('orbit') || t.includes('moon') || t.includes('lagrangian') || t.includes('helium') || t.includes('propulsion') || t.includes('satellite') || t.includes('astra')) {
    return 'Astra-Exploration';
  }
  if (t.includes('geopolitical') || t.includes('navy') || t.includes('border') || t.includes('alliance') || t.includes('sovereign') || t.includes('sanction') || t.includes('chokepoint') || t.includes('blockade')) {
    return 'Geopolitics';
  }
  // Default fallback
  return 'Macroeconomics';
}

// Helper to get vectors for categorized articles
function getVectorWeightsForCategory(cat) {
  const base = {
    Macroeconomics: 0.0,
    'AI Frontiers': 0.0,
    Architecture: 0.0,
    Geopolitics: 0.0,
    'Pop Culture & Celebs': 0.0,
    'Avant-Garde Music': 0.0,
    'Quantum Computing': 0.0,
    'Subterranean Urbanism': 0.0,
    'Climate Futures': 0.0,
    'Astra-Exploration': 0.0
  };
  if (base.hasOwnProperty(cat)) {
    base[cat] = 1.0;
  } else {
    base['Macroeconomics'] = 1.0;
  }
  return base;
}

// Random fallback images for live API images if missing
function getRandomPlaceholderImage(category) {
  if (category === 'AI Frontiers') return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop";
  if (category === 'Architecture') return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop";
  if (category === 'Geopolitics') return "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=600&auto=format&fit=crop";
  if (category === 'Pop Culture & Celebs') return "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop";
  if (category === 'Avant-Garde Music') return "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop";
  if (category === 'Quantum Computing') return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop";
  if (category === 'Subterranean Urbanism') return "https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=600&auto=format&fit=crop";
  if (category === 'Climate Futures') return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop";
  if (category === 'Astra-Exploration') return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop";
  return "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop";
}

/**
 * Fetches real-time articles from free public APIs: Spaceflight News and Cornell arXiv papers.
 */
export async function fetchPublicArchiveFeeds() {
  const list = [];
  
  // 1. Fetch from Spaceflight News (Astra-Exploration)
  try {
    const res = await fetch("https://api.spaceflightnewsapi.net/v4/articles/?limit=5");
    if (res.ok) {
      const data = await res.json();
      const spaceArts = (data.results || []).map((art, idx) => ({
        id: `space-api-${art.id}-${idx}`,
        title: art.title.toUpperCase(),
        description: art.summary || "Space exploration update.",
        content: (art.summary || "") + " Ingested automatically from the Spaceflight News public pipeline.",
        publishedAt: art.published_at || new Date().toISOString(),
        sourceName: art.news_site || "Spaceflight News",
        category: "Astra-Exploration",
        readTime: "6 min read",
        author: "Spaceflight Bureau",
        urlToImage: art.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
        url: art.url,
        vectorWeights: {
          Macroeconomics: 0.0,
          'AI Frontiers': 0.1,
          Architecture: 0.0,
          Geopolitics: 0.4,
          'Pop Culture & Celebs': 0.0,
          'Avant-Garde Music': 0.0,
          'Quantum Computing': 0.1,
          'Subterranean Urbanism': 0.0,
          'Climate Futures': 0.1,
          'Astra-Exploration': 1.0
        }
      }));
      list.push(...spaceArts);
    }
  } catch (e) {
    console.warn("Failed Spaceflight News API fetch", e);
  }

  // 2. Fetch from arXiv API (Quantum Computing / AI Frontiers)
  try {
    const res = await fetch("https://export.arxiv.org/api/query?search_query=all:quantum+OR+all:\"state+space\"&max_results=5");
    if (res.ok) {
      const xmlText = await res.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const entries = xmlDoc.getElementsByTagName("entry");
      
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const title = entry.getElementsByTagName("title")[0]?.textContent?.replace(/\n/g, " ").trim() || "Quantum Coherence Study";
        const summary = entry.getElementsByTagName("summary")[0]?.textContent?.replace(/\n/g, " ").trim() || "Research abstract from arXiv server.";
        const idVal = entry.getElementsByTagName("id")[0]?.textContent || `arxiv-${i}`;
        const published = entry.getElementsByTagName("published")[0]?.textContent || new Date().toISOString();
        const authorName = entry.getElementsByTagName("author")[0]?.getElementsByTagName("name")[0]?.textContent || "arXiv Researcher";
        
        const category = title.toLowerCase().includes("quantum") ? "Quantum Computing" : "AI Frontiers";
        
        list.push({
          id: `arxiv-api-${i}-${Date.now()}`,
          title: title.toUpperCase(),
          description: summary.substring(0, 150) + "...",
          content: summary + " Ingested directly from arXiv open archives.",
          publishedAt: published,
          sourceName: "Cornell arXiv Archive",
          category: category,
          readTime: "9 min read",
          author: authorName,
          urlToImage: category === "Quantum Computing" 
            ? "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop"
            : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
          url: idVal,
          vectorWeights: {
            Macroeconomics: 0.1,
            'AI Frontiers': category === "AI Frontiers" ? 1.0 : 0.4,
            Architecture: 0.0,
            Geopolitics: 0.1,
            'Pop Culture & Celebs': 0.0,
            'Avant-Garde Music': 0.0,
            'Quantum Computing': category === "Quantum Computing" ? 1.0 : 0.4,
            'Subterranean Urbanism': 0.0,
            'Climate Futures': 0.0,
            'Astra-Exploration': 0.2
          }
        });
      }
    }
  } catch (e) {
    console.warn("Failed arXiv API fetch", e);
  }

  return list;
}
