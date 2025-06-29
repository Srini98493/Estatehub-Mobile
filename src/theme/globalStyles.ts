import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 375;
export const normalize = (size: number) => Math.round(size * scale);

// Font family definitions
export const Fonts = {
  poppins: {
    regular: 'Poppins-Regular',
    light: 'Poppins-Light',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
    thin: 'Poppins-Thin',
  }
};

// Color palette
export const Colors = {
  // Primary colors
  primary: '#0096C7',
  primaryLight: '#A0DAFB',
  primaryDark: '#0A8ED9',
  
  // Secondary colors
  secondary: '#1AADDD',
  secondaryDark: '#117B9D',
  
  // Gradient colors
  gradientPrimary: ['#A0DAFB', '#0A8ED9'],
  gradientSecondary: ['#1AADDD', '#117B9D'],
  gradientButton: ['#0096C7', '#00B4D8'],
  
  // Text colors
  textPrimary: '#000000',
  textSecondary: '#666666',
  textLight: '#999999',
  textWhite: '#FFFFFF',
  
  // Background colors
  background: '#F5F5F5',
  backgroundLight: '#FFFFFF',
  backgroundDark: '#E8E8E8',
  
  // Border colors
  border: '#E5E5E5',
  borderLight: '#E8E8E8',
  
  // Status colors
  success: '#4CAF50',
  error: '#C13333',
  warning: '#FFC107',
  info: '#2196F3',
  
  // Other colors
  gray50: '#EFEFEF',
  gray100: '#DFDFDF',
  gray200: '#A1A1A1',
  gray400: '#4D4D4D',
  gray800: '#303030',
  purple50: '#1B1A23',
  purple100: '#E1E1EF',
  purple500: '#44427D',
};

// Typography
export const Typography = StyleSheet.create({
  h1: {
    fontFamily: Fonts.poppins.bold,
    fontSize: normalize(24),
    fontWeight: '600',
    lineHeight: normalize(32),
    color: Colors.textPrimary,
  },
  h2: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: normalize(20),
    fontWeight: '600',
    lineHeight: normalize(28),
    color: Colors.textPrimary,
  },
  h3: {
    fontFamily: Fonts.poppins.medium,
    fontSize: normalize(18),
    fontWeight: '500',
    lineHeight: normalize(24),
    color: Colors.textPrimary,
  },
  pageHeading: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: normalize(24),
    fontWeight: '600',
    lineHeight: normalize(32),
    color: Colors.textPrimary,
    marginBottom: normalize(20),
    marginTop: normalize(20),
  },
  body: {
    fontFamily: Fonts.poppins.regular,
    fontSize: normalize(16),
    lineHeight: normalize(22),
    color: Colors.textPrimary,
  },
  caption: {
    fontFamily: Fonts.poppins.regular,
    fontSize: normalize(14),
    lineHeight: normalize(20),
    color: Colors.textSecondary,
  },
  buttonText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: normalize(16),
    fontWeight: '600',
    color: Colors.textWhite,
  },
  headerTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: Platform.OS === 'ios' ? normalize(20) : normalize(26),
    fontWeight:  Platform.OS === 'ios' ? "400":'600',
    color: Colors.textPrimary,
    marginBottom: normalize(15),
  },
});

// Layout
export const Layout = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: normalize(20),
  },
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  alignCenter: {
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    paddingTop: normalize(20),
    paddingBottom: normalize(10),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  listContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(50),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Buttons
export const Buttons = StyleSheet.create({
  primary: {
    backgroundColor: Colors.primary,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(8),
    alignItems: 'center',
    height: normalize(44),
  },
  secondary: {
    backgroundColor: Colors.secondary,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(8),
    alignItems: 'center',
    height: normalize(44),
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(8),
    alignItems: 'center',
    height: normalize(44),
  },
  buttonContainer: {
    width: '100%',
    height: normalize(44),
    borderRadius: normalize(8),
    overflow: 'hidden',
    borderColor: Colors.primary,
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(8),

  },
  fab: {
    position: 'absolute',
    right: normalize(20),
    bottom: normalize(20),
    width: normalize(56),
    height: normalize(56),
    borderRadius: normalize(28),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 0,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
  },
});

// Inputs
export const Inputs = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: normalize(15),
  },
  input: {
    height: normalize(44),
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: normalize(8),
    paddingHorizontal: normalize(16),
    fontSize: normalize(16),
    backgroundColor: Colors.backgroundLight,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: normalize(12),
    marginTop: normalize(4),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  searchInputContainer: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: normalize(10),
    padding: normalize(12),
    paddingLeft: normalize(40),
  },
  searchIcon: {
    position: 'absolute',
    left: normalize(15),
    top: normalize(15),
    width: normalize(20),
    height: normalize(20),
    tintColor: Colors.textLight,
  },
});

// Cards
export const Cards = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: normalize(10),
    padding: normalize(15),
    marginBottom: normalize(10),
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  propertyCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: normalize(10),
    marginBottom: normalize(15),
    overflow: 'hidden',
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  requestCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: normalize(10),
    padding: normalize(15),
    marginBottom: normalize(10),
    flexDirection: 'column',
    justifyContent: 'space-between',
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  cardShadow: {
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
});

// Tabs
export const Tabs = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: normalize(20),
  },
  tab: {
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(16),
    marginRight: normalize(10),
  },
  activeTab: {
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(20),
    marginRight: normalize(10),
  },
  tabText: {
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.textWhite,
  },
});

const GlobalStyles = {
  Colors,
  Typography,
  Layout,
  Buttons,
  Inputs,
  Cards,
  Tabs,
  Fonts,
  normalize,
};

export default GlobalStyles; 