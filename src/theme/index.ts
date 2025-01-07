import { MD3LightTheme, configureFonts } from 'react-native-paper';

const baseFont = {
  fontFamily: 'System',
};

const fontConfig = {
  displayLarge: baseFont,
  displayMedium: baseFont,
  displaySmall: baseFont,
  headlineLarge: baseFont,
  headlineMedium: baseFont,
  headlineSmall: baseFont,
  titleLarge: baseFont,
  titleMedium: baseFont,
  titleSmall: baseFont,
  bodyLarge: baseFont,
  bodyMedium: baseFont,
  bodySmall: baseFont,
  labelLarge: baseFont,
  labelMedium: baseFont,
  labelSmall: baseFont,
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4AA7FF', // Main blue color
    secondary: '#FF5555', // Red accent
    background: '#E8F4FF', // Light blue background
    surface: '#FFFFFF',
    surfaceVariant: '#F0F8FF',
    elevation: {
      level0: 'transparent',
      level1: 'rgba(74, 167, 255, 0.05)',
      level2: 'rgba(74, 167, 255, 0.08)',
      level3: 'rgba(74, 167, 255, 0.11)',
      level4: 'rgba(74, 167, 255, 0.12)',
      level5: 'rgba(74, 167, 255, 0.14)',
    },
  },
  fonts: configureFonts({ config: fontConfig }),
};

export const styles = {
  screenContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  pokemonFrame: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    margin: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: theme.colors.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    color: theme.colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  navigationButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
    marginVertical: 4,
  },
}; 