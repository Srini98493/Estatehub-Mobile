import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { Dimensions } from "react-native";
import { useAuthStore } from "../store/useAuthStore";
import NetworkBanner from "@/components/atoms/NetworkBanner";

import {
  Home,
  Profile,
  Login,
  OTP,
  Startup,
  Purpose,
  BasicInfo,
  PersonalDetails,
  Properties,
  Services,
  More,
  PropertyDetails,
  AddProperty,
  ServiceFilters,
  MyBookings,
} from "@/screens";
import ForgotPassword from "@/screens/ForgotPassword/ForgotPassword";
import Favourites from "@/screens/Favourites";
import { useTheme } from "@/theme";
import MyProperties from "@/screens/MyProperties";
import ApproveProperties from "@/screens/ApproveProperties";
import AddService from "@/screens/AddService";
import AddHomeLoans from "@/screens/AddHomeLoans";
import ApplyHomeLoan from "@/screens/ApplyHomeLoan";

// Define the param lists for each stack
type RootStackParamList = {
  Startup: undefined;
  Auth: undefined;
  Main: undefined;
  ServiceFilters: undefined;
  Services: undefined;
  ApplyHomeLoan: undefined;
  AddService: undefined;
  AddHomeLoan: undefined;
  Favourites: undefined; 
};

type AuthStackParamList = {
  Login: undefined;
  OTP: undefined;
  Purpose: undefined;
  BasicInfo: undefined;
  PersonalDetails: undefined;
  ForgotPassword: undefined;
};

type HomeStackParamList = {
  HomeScreen: undefined;
  PropertyDetails: { propertyId: number };
  Properties: undefined;
};

type MyPropertiesStackParamList = {
  MyPropertiesScreen: undefined;
  PropertyDetails: { propertyId: number };
  AddProperty: { isEdit: boolean; propertyId?: number };
};

type AppBottomTabParamList = {
  Home: undefined;
  My_Properties: undefined;
  My_Bookings: undefined;
  NRI_Services: undefined;
  Approve_Properties: undefined;
  More: undefined;
};

type MyBookingsStackParamList = {
  MyBookingsScreen: undefined;
  PropertyDetails: { propertyId: number };
};

type ServicesStackParamList = {
  ServicesScreen: undefined;
  PropertyDetails: { propertyId: number };
};

type ApprovePropertiesStackParamList = {
  ApprovePropertiesScreen: undefined;
  PropertyDetails: { propertyId: number };
};

const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const MyPropertiesStack = createStackNavigator<MyPropertiesStackParamList>();
const MyBookingsStack = createStackNavigator<MyBookingsStackParamList>();
const ServicesStack = createStackNavigator<ServicesStackParamList>();
const ApprovePropertiesStack = createStackNavigator<ApprovePropertiesStackParamList>();
const BottomTab = createBottomTabNavigator<AppBottomTabParamList>();

const { height } = Dimensions.get("window");

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen
        name="PropertyDetails"
        component={PropertyDetails as React.ComponentType<any>}
      />
      <MyPropertiesStack.Screen
        name="AddProperty"
        component={AddProperty as React.ComponentType<any>}
      />
      <HomeStack.Screen name="Properties" component={Properties} />
    </HomeStack.Navigator>
  );
}

function MyPropertiesStackNavigator() {
  return (
    <MyPropertiesStack.Navigator screenOptions={{ headerShown: false }}>
      <MyPropertiesStack.Screen name="MyPropertiesScreen" component={MyProperties} />
      <MyPropertiesStack.Screen
        name="PropertyDetails"
        component={PropertyDetails as React.ComponentType<any>}
      />
      <MyPropertiesStack.Screen
        name="AddProperty"
        component={AddProperty as React.ComponentType<any>}
      />
    </MyPropertiesStack.Navigator>
  );
}

function MyBookingsStackNavigator() {
  return (
    <MyBookingsStack.Navigator screenOptions={{ headerShown: false }}>
      <MyBookingsStack.Screen name="MyBookingsScreen" component={MyBookings} />
      <MyBookingsStack.Screen
        name="PropertyDetails"
        component={PropertyDetails as React.ComponentType<any>}
      />
    </MyBookingsStack.Navigator>
  );
}

function ServicesStackNavigator() {
  return (
    <ServicesStack.Navigator screenOptions={{ headerShown: false }}>
      <ServicesStack.Screen name="ServicesScreen" component={Services} />
      <ServicesStack.Screen
        name="PropertyDetails"
        component={PropertyDetails as React.ComponentType<any>}
      />
    </ServicesStack.Navigator>
  );
}

function ApprovePropertiesStackNavigator() {
  return (
    <ApprovePropertiesStack.Navigator screenOptions={{ headerShown: false }}>
      <ApprovePropertiesStack.Screen name="ApprovePropertiesScreen" component={ApproveProperties} />
      <ApprovePropertiesStack.Screen
        name="PropertyDetails"
        component={PropertyDetails as React.ComponentType<any>}
      />
    </ApprovePropertiesStack.Navigator>
  );
}

function BottomTabNavigator() {
  const { user } = useAuthStore();
  const isAdmin = user?.isadmin || user?.usertype === 0;
  // Add this line to get safe area insets
  const insets = useSafeAreaInsets();

  return (
    <>
      <NetworkBanner />
      <BottomTab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          // Updated tabBarStyle to account for safe area insets
          tabBarStyle: {
            backgroundColor: "#fff",
            paddingBottom: Math.max(8, insets.bottom), // Use at least 16 padding or more if insets are larger
            paddingTop: 5,
            borderTopWidth: .5,
            borderTopColor: "#E8E8E8",
            // Remove fixed height to allow for dynamic sizing based on content + insets
            height: insets.bottom > 0 ? 55 + insets.bottom : 55,
          },
          tabBarActiveTintColor: "#0096C7",
          tabBarInactiveTintColor: "#666",
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case "Home":
                iconName = focused ? "home" : "home-outline";
                break;
              case "My_Properties":
                iconName = focused ? "business" : "business-outline";
                break;
              case "My_Bookings":
                iconName = focused ? "calendar" : "calendar-outline";
                break;
              case "NRI_Services":
                iconName = focused ? "globe" : "globe-outline";
                break;
              case "Approve_Properties":
                iconName = focused ? "checkmark-circle" : "checkmark-circle-outline";
                break;
              case "More":
                iconName = focused
                  ? "ellipsis-horizontal"
                  : "ellipsis-horizontal-outline";
                break;
              default:
                iconName = "help-outline";
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
          },
        })}
      >
        <BottomTab.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: "500",
            }
          }}
        />
        <BottomTab.Screen
          name="My_Properties"
          component={MyPropertiesStackNavigator}
          options={{
            tabBarLabel: "My Properties",
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: "500",
            }
          }}
        />
        <BottomTab.Screen
          name="My_Bookings"
          component={MyBookingsStackNavigator}
          options={{
            tabBarLabel: "My Bookings",
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: "500",
            }
          }}
        />
        <BottomTab.Screen
          name="NRI_Services"
          component={ServicesStackNavigator}
          options={{
            tabBarLabel: "NRI Services",
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: "500",
            }
          }}
        />
        {isAdmin && (
          <BottomTab.Screen
            name="Approve_Properties"
            component={ApprovePropertiesStackNavigator}
            options={{
              tabBarLabel: "Approve",
              tabBarLabelStyle: {
                fontSize: 10,
                fontWeight: "500",
              }
            }}
          />
        )}
        <BottomTab.Screen
          name="More"
          component={More}
          options={{
            tabBarLabel: "More",
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: "500",
            }
          }}
        />
      </BottomTab.Navigator>
    </>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <AuthStack.Screen name="OTP" component={OTP} />
      <AuthStack.Screen name="BasicInfo" component={BasicInfo} />
      <AuthStack.Screen name="PersonalDetails" component={PersonalDetails as React.ComponentType<any>} />
    </AuthStack.Navigator>
  );
}

function ApplicationNavigator() {
  const { variant, navigationTheme } = useTheme();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          key={variant}
          screenOptions={{ headerShown: false }}
          initialRouteName="Startup"
        >
          <Stack.Screen name="Startup" component={Startup} />

          <Stack.Screen name="Auth" component={AuthNavigator} />

          <Stack.Screen name="Main" component={BottomTabNavigator} />
          <Stack.Screen
            name="ServiceFilters"
            component={ServiceFilters}
            options={{
              presentation: "modal",
              headerShown: false,
              cardOverlayEnabled: true,
              cardStyleInterpolator: ({ current: { progress } }) => ({
                cardStyle: {
                  transform: [
                    {
                      translateY: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [height, 0],
                      }),
                    },
                  ],
                },
                overlayStyle: {
                  opacity: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5],
                  }),
                },
              }),
            }}
          />
          <Stack.Screen
            name="Services"
            component={Services}
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ApplyHomeLoan"
            component={ApplyHomeLoan}
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AddService"
            component={AddService}
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AddHomeLoan"
            component={AddHomeLoans as React.ComponentType<any>}
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Favourites"
            component={Favourites}
            options={{
              presentation: "card",
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;