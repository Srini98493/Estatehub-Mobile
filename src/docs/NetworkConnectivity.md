# Network Connectivity Implementation

This document outlines the network connectivity implementation in the Assets Mobile App.

## Components

### NetworkBanner

A visual indicator that appears above the bottom tab bar to show the current network status:
- Shows a persistent red banner with "No Internet Connection" when offline
- Shows a temporary green banner with "Back Online" for 5 seconds when connectivity is restored

Location: `src/components/atoms/NetworkBanner/NetworkBanner.tsx`

## Context

### NetworkContext

A React Context that provides network connectivity state and utilities throughout the app.

Location: `src/context/NetworkContext.tsx`

Features:
- `isConnected`: Boolean state indicating if the device is connected to the internet
- `checkConnection()`: Function to manually check the current connection status

## Utilities

### networkUtils

Utility functions for handling network connectivity in API calls.

Location: `src/utils/networkUtils.ts`

Functions:
- `isNetworkConnected()`: Checks if the device is connected to the internet
- `withNetworkCheck()`: Wrapper function to check network connection before making API calls

## Hooks

### useNetworkAwareAPI

A custom hook for making network-aware API calls.

Location: `src/hooks/useNetworkAwareAPI.ts`

Features:
- `isLoading`: Loading state for API calls
- `error`: Error state for API calls
- `callAPI()`: Function to make API calls with network checks

## Usage

### Basic Network Status Check

```tsx
import { useNetwork } from '@/context/NetworkContext';

const MyComponent = () => {
  const { isConnected } = useNetwork();
  
  return (
    <View>
      {!isConnected && (
        <Text>You are offline. Some features may not be available.</Text>
      )}
    </View>
  );
};
```

### Making Network-Aware API Calls

```tsx
import { useNetworkAwareAPI } from '@/hooks/useNetworkAwareAPI';

const MyComponent = () => {
  const { isLoading, error, callAPI } = useNetworkAwareAPI();

  const fetchData = async () => {
    await callAPI(
      () => api.getData(), // Your API call
      (data) => {
        // Success callback
        console.log('Data:', data);
      },
      (error) => {
        // Error callback
        console.error('Error:', error);
      },
      () => {
        // No connection callback
        Alert.alert('No Connection', 'Please check your internet connection');
      }
    );
  };

  return (
    <Button 
      title="Fetch Data" 
      onPress={fetchData}
      disabled={isLoading}
    />
  );
};
```

## Implementation Details

1. The `NetworkProvider` is added at the root level in `App.tsx`
2. The `NetworkBanner` component is added in the `BottomTabNavigator` in `Application.tsx`
3. API calls should use the `useNetworkAwareAPI` hook or the `withNetworkCheck` utility to ensure network connectivity before making requests 