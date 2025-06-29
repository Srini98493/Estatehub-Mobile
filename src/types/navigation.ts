import type { StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
  Startup: undefined;
  Auth: undefined;
  Main: undefined;
  ServiceFilters: undefined;
  Services: undefined;
  Favourites: undefined;
  ApplyHomeLoan: undefined;
  AddProperty: {
    propertyId?: number;
    isEdit?: boolean;
  };
  AddService: undefined;
  AddHomeLoan: undefined;
  AddHomeLoans: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  My_Properties: undefined;
  My_Bookings: undefined;
  Favourites: undefined;
  Approve_Properties: undefined;
  More: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  OTP: { email: string };
  Purpose: undefined;
  BasicInfo: undefined;
  PersonalDetails: { basicInfo: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }};
};

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList
> = StackScreenProps<RootStackParamList, S>;
