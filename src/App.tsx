import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import BattleScreen from './screens/BattleScreen';
import PokemonManageScreen from './screens/PokemonManageScreen';
import MusicControl from './components/MusicControl';
import { Audio } from 'expo-av';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    async function initAudio() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    }
    initAudio();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <PaperProvider>
        <NavigationContainer>
          <View style={styles.container}>
            <View style={styles.musicControl}>
              <MusicControl />
            </View>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen 
                name="Home" 
                component={HomeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Battle" 
                component={BattleScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="PokemonManage" 
                component={PokemonManageScreen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </View>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  musicControl: {
    position: 'absolute',
    top: 40,
    right: 10,
    zIndex: 1000,
  },
}); 