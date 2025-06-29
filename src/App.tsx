import 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MMKV } from 'react-native-mmkv';
import React from 'react';
import { ThemeProvider } from '@/theme';
import ApplicationNavigator from './navigators/Application';
import './translations';
import { NetworkProvider } from './context/NetworkContext';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Create QueryClient instance
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			gcTime: 1000 * 60 * 60 * 24, // 24 hours
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnMount: true,
			refetchOnWindowFocus: false,
			refetchOnReconnect: true,
		},
	},
});

export const storage = new MMKV();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider storage={storage}>
				<NetworkProvider>
					<SafeAreaProvider>
							<ApplicationNavigator />
						<Toast />
					</SafeAreaProvider>
				</NetworkProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;
