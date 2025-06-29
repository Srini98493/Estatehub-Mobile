import { useState } from 'react';
import { withNetworkCheck } from '@/utils/networkUtils';
import { useNetwork } from '@/context/NetworkContext';

/**
 * Custom hook for making network-aware API calls
 * @returns Object with loading state, error state, and a function to make API calls
 */
export const useNetworkAwareAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { isConnected } = useNetwork();

  /**
   * Makes an API call with network check
   * @param apiCall - The API call function to execute
   * @param onSuccess - Callback to execute on successful API call
   * @param onError - Callback to execute on API call error
   * @param onNoConnection - Callback to execute when there's no connection
   */
  const callAPI = async <T>(
    apiCall: () => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: Error) => void,
    onNoConnection?: () => void
  ): Promise<T | null> => {
    if (!isConnected) {
      if (onNoConnection) {
        onNoConnection();
      }
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await withNetworkCheck(apiCall, onNoConnection);
      
      if (result !== null && onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      
      if (onError) {
        onError(error);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    callAPI,
  };
}; 