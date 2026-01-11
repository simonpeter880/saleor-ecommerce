/**
 * Search Analytics
 *
 * Tracks and analyzes search behavior:
 * - Popular searches
 * - No-result queries
 * - Click-through rates
 * - Search refinements
 */

interface SearchEvent {
  query: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  resultsCount: number;
  clickedProductId?: string;
  refinements?: string[];
}

interface SearchAnalytics {
  query: string;
  count: number;
  avgResultsCount: number;
  clickThroughRate: number;
  noResultsRate: number;
  lastSearched: number;
}

class SearchAnalyticsTracker {
  private events: SearchEvent[] = [];
  private readonly MAX_EVENTS = 1000;
  private readonly STORAGE_KEY = 'search_analytics';

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Track a search event
   */
  track(event: Omit<SearchEvent, 'timestamp' | 'sessionId'>): void {
    const searchEvent: SearchEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
    };

    this.events.push(searchEvent);

    // Limit memory usage
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

    this.saveToStorage();
  }

  /**
   * Track search query
   */
  trackSearch(query: string, resultsCount: number, userId?: string): void {
    this.track({
      query: query.toLowerCase(),
      resultsCount,
      userId,
    });
  }

  /**
   * Track product click from search results
   */
  trackClick(query: string, productId: string, userId?: string): void {
    // Find the most recent search for this query
    const recentSearch = [...this.events]
      .reverse()
      .find(e => e.query === query.toLowerCase() && !e.clickedProductId);

    if (recentSearch) {
      recentSearch.clickedProductId = productId;
      this.saveToStorage();
    }
  }

  /**
   * Get popular searches
   */
  getPopularSearches(limit: number = 10): string[] {
    const analytics = this.getAnalytics();
    return analytics
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(a => a.query);
  }

  /**
   * Get searches with no results
   */
  getNoResultSearches(limit: number = 20): string[] {
    return this.events
      .filter(e => e.resultsCount === 0)
      .map(e => e.query)
      .filter((q, i, arr) => arr.indexOf(q) === i) // unique
      .slice(-limit);
  }

  /**
   * Get trending searches (popular in last 24 hours)
   */
  getTrendingSearches(limit: number = 10): string[] {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentEvents = this.events.filter(e => e.timestamp > oneDayAgo);

    const counts: Record<string, number> = {};
    recentEvents.forEach(e => {
      counts[e.query] = (counts[e.query] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([query]) => query);
  }

  /**
   * Get user's recent searches
   */
  getRecentSearches(userId?: string, limit: number = 5): string[] {
    const userEvents = userId
      ? this.events.filter(e => e.userId === userId)
      : this.events.filter(e => e.sessionId === this.getSessionId());

    return [...new Set(
      userEvents
        .map(e => e.query)
        .reverse()
    )].slice(0, limit);
  }

  /**
   * Get analytics for all searches
   */
  getAnalytics(): SearchAnalytics[] {
    const grouped: Record<string, SearchEvent[]> = {};

    this.events.forEach(event => {
      if (!grouped[event.query]) {
        grouped[event.query] = [];
      }
      grouped[event.query].push(event);
    });

    return Object.entries(grouped).map(([query, events]) => {
      const totalResults = events.reduce((sum, e) => sum + e.resultsCount, 0);
      const clicks = events.filter(e => e.clickedProductId).length;
      const noResults = events.filter(e => e.resultsCount === 0).length;

      return {
        query,
        count: events.length,
        avgResultsCount: totalResults / events.length,
        clickThroughRate: clicks / events.length,
        noResultsRate: noResults / events.length,
        lastSearched: Math.max(...events.map(e => e.timestamp)),
      };
    });
  }

  /**
   * Get search suggestions based on analytics
   */
  getSuggestions(partialQuery: string, limit: number = 8): string[] {
    const lower = partialQuery.toLowerCase();
    const analytics = this.getAnalytics();

    // Filter by partial match and good performance
    const matches = analytics
      .filter(a =>
        a.query.includes(lower) &&
        a.avgResultsCount > 0 &&
        a.noResultsRate < 0.5
      )
      .sort((a, b) => {
        // Prioritize by click-through rate and popularity
        const scoreA = a.clickThroughRate * Math.log(a.count + 1);
        const scoreB = b.clickThroughRate * Math.log(b.count + 1);
        return scoreB - scoreA;
      })
      .slice(0, limit)
      .map(a => a.query);

    return matches;
  }

  /**
   * Clear analytics data
   */
  clear(): void {
    this.events = [];
    this.saveToStorage();
  }

  /**
   * Get session ID
   */
  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server';

    let sessionId = sessionStorage.getItem('search_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      sessionStorage.setItem('search_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load search analytics:', error);
    }
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.events));
    } catch (error) {
      console.error('Failed to save search analytics:', error);
    }
  }

  /**
   * Export analytics for reporting
   */
  exportAnalytics(): {
    summary: {
      totalSearches: number;
      uniqueQueries: number;
      avgClickThroughRate: number;
      noResultsRate: number;
    };
    topSearches: SearchAnalytics[];
    noResults: string[];
    trending: string[];
  } {
    const analytics = this.getAnalytics();
    const totalClicks = analytics.reduce((sum, a) => sum + a.clickThroughRate * a.count, 0);
    const totalSearches = analytics.reduce((sum, a) => sum + a.count, 0);
    const noResults = analytics.filter(a => a.noResultsRate > 0.5);

    return {
      summary: {
        totalSearches,
        uniqueQueries: analytics.length,
        avgClickThroughRate: totalClicks / totalSearches,
        noResultsRate: noResults.length / analytics.length,
      },
      topSearches: analytics.sort((a, b) => b.count - a.count).slice(0, 20),
      noResults: this.getNoResultSearches(20),
      trending: this.getTrendingSearches(10),
    };
  }
}

// Singleton instance
let analyticsInstance: SearchAnalyticsTracker | null = null;

export function getSearchAnalytics(): SearchAnalyticsTracker {
  if (!analyticsInstance) {
    analyticsInstance = new SearchAnalyticsTracker();
  }
  return analyticsInstance;
}

export default getSearchAnalytics;
