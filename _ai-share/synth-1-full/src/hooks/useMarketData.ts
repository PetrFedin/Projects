import { useState, useEffect } from 'react';
import { useUserContext } from './useUserContext';
import { useB2BState } from '@/providers/b2b-state';

export interface MarketData {
  trendingItems: Array<{
    name: string;
    category: string;
    trend: number; // percentage change
  }>;

  pricePosition: {
    yourAvg: number;
    marketAvg: number;
    advantage: boolean;
  };

  predictedSellthrough: {
    yours: number;
    industry: number;
  };

  categoryInsights: Array<{
    category: string;
    demand: 'high' | 'medium' | 'low';
    competition: number;
    recommendation: string;
  }>;
}

export function useMarketData() {
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { currentOrg } = useUserContext();
  const { b2bCart, inventoryATS, productVotes } = useB2BState();

  useEffect(() => {
    async function loadMarketData() {
      setIsLoading(true);

      try {
        // Mock data - в реальности это API call
        const mockData: MarketData = {
          trendingItems: [
            { name: 'Puffer Jackets', category: 'Outerwear', trend: 45 },
            { name: 'Tech Parkas', category: 'Outerwear', trend: 28 },
            { name: 'Wool Coats', category: 'Outerwear', trend: -12 },
            { name: 'Bomber Jackets', category: 'Outerwear', trend: 0 },
          ],

          pricePosition: {
            yourAvg: 285,
            marketAvg: 310,
            advantage: true,
          },

          predictedSellthrough: {
            yours: 82,
            industry: 68,
          },

          categoryInsights: [
            {
              category: 'Верхняя одежда',
              demand: 'high',
              competition: 78,
              recommendation: 'Увеличить ассортимент puffer jackets на 20%',
            },
          ],
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        setData(mockData);
      } catch (error) {
        console.error('Failed to load market data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMarketData();
  }, [currentOrg, b2bCart]);

  return {
    trendingItems: data?.trendingItems || [],
    pricePosition: data?.pricePosition || { yourAvg: 0, marketAvg: 0, advantage: false },
    predictedSellthrough: data?.predictedSellthrough || { yours: 0, industry: 0 },
    categoryInsights: data?.categoryInsights || [],
    isLoading,
  };
}
