import { useEffect, useState } from 'react';
import { useWebSocket } from './useWebSocket';

export function useRealTimeData<T>(
  fetchData: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useWebSocket();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, dependencies);

  // Listen for real-time updates
  useEffect(() => {
    const handleRefresh = () => {
      if (!loading) {
        loadData();
      }
    };

    window.addEventListener('buyer:refresh', handleRefresh);
    return () => window.removeEventListener('buyer:refresh', handleRefresh);
  }, [loading]);

  return {
    data,
    loading,
    error,
    refresh: loadData,
    isRealTime: isConnected
  };
}
