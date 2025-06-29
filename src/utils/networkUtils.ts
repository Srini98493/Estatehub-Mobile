import NetInfo from '@react-native-community/netinfo';

/**
 * Checks if the device is connected to the internet
 * @returns Promise<boolean> - true if connected, false otherwise
 */
export const isNetworkConnected = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  } catch (error) {
    console.error('Error checking network connection:', error);
    return false;
  }
};

/**
 * Wrapper function to check network connection before making API calls
 * @param apiCall - The API call function to execute
 * @param onNoConnection - Callback to execute when there's no connection
 * @returns The result of the API call or null if there's no connection
 */
export const withNetworkCheck = async <T>(
  apiCall: () => Promise<T>,
  onNoConnection?: () => void
): Promise<T | null> => {
  const isConnected = await isNetworkConnected();
  
  if (!isConnected) {
    if (onNoConnection) {
      onNoConnection();
    }
    return null;
  }
  
  try {
    return await apiCall();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}; 