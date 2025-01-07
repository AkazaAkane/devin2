import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Surface, IconButton } from 'react-native-paper';
import { theme } from '../theme';

interface PokemonPhoneLayoutProps {
  children: React.ReactNode;
  onBack?: () => void;
}

export default function PokemonPhoneLayout({ children, onBack }: PokemonPhoneLayoutProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.phoneSurface}>
        {/* Top Frame */}
        <View style={styles.topFrame}>
          <View style={styles.pokeball}>
            <View style={styles.pokeballInner} />
          </View>
          {onBack && (
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={onBack}
              style={styles.backButton}
            />
          )}
        </View>
        
        {/* Main Content */}
        <View style={styles.content}>
          {children}
        </View>
        
        {/* Bottom Frame */}
        <View style={styles.bottomFrame}>
          <IconButton
            icon="close"
            size={24}
            style={[styles.controlButton, styles.redButton]}
          />
          <IconButton
            icon="chevron-right"
            size={24}
            style={[styles.controlButton, styles.blueButton]}
          />
        </View>
      </Surface>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  phoneSurface: {
    flex: 1,
    margin: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: theme.colors.secondary, // Red frame
  },
  topFrame: {
    height: 60,
    backgroundColor: theme.colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  pokeball: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pokeballInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#000',
  },
  bottomFrame: {
    height: 60,
    backgroundColor: theme.colors.secondary,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  controlButton: {
    margin: 4,
  },
  redButton: {
    backgroundColor: '#D32F2F',
  },
  blueButton: {
    backgroundColor: theme.colors.primary,
  },
  backButton: {
    backgroundColor: '#FFF',
  },
}); 