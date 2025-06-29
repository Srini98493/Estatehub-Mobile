import PersonalDetails from '@/screens/Signup/PersonalDetails';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ... other imports ...

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  return (
    <Stack.Navigator>
      {/* ... other screens ... */}
      <Stack.Screen 
        name="PersonalDetails" 
        component={PersonalDetails} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}; 