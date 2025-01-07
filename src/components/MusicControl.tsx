import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { IconButton, Menu, Portal, Dialog } from 'react-native-paper';
import MusicService from '../services/MusicService';

// Import all mp3 files from assets/bgm
const musicFiles = {
  '1-09. Battle! (Wild Pokémon)': require('../assets/bgm/1-09. Battle! (Wild Pokémon).mp3'),
  '1-20. Battle! (Trainer Battle)': require('../assets/bgm/1-20. Battle! (Trainer Battle).mp3'),
  '2-06. Battle! (Gym Leader)': require('../assets/bgm/2-06. Battle! (Gym Leader).mp3'),
  '3-27. Battle! (Steven)': require('../assets/bgm/3-27. Battle! (Steven).mp3'),
  '4-05. Battle! (Super-Ancient Pokémon)': require('../assets/bgm/4-05. Battle! (Super-Ancient Pokémon).mp3'),
  '4-06. Battle! (Lorekeeper Zinnia)': require('../assets/bgm/4-06. Battle! (Lorekeeper Zinnia).mp3'),
};

export default function MusicControl() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [volumeDialogVisible, setVolumeDialogVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  const handleMusicSelect = async (music: keyof typeof musicFiles) => {
    await MusicService.stopMusic();
    await MusicService.playMusic(musicFiles[music]);
    setIsPlaying(true);
    setMenuVisible(false);
  };

  const togglePlay = async () => {
    await MusicService.togglePlay();
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = async (value: number) => {
    setVolume(value);
    await MusicService.setVolume(value);
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <IconButton
            icon="music"
            size={24}
            onPress={() => setMenuVisible(true)}
          />
        }
      >
        {Object.keys(musicFiles).map((musicName) => (
          <Menu.Item
            key={musicName}
            title={musicName}
            onPress={() => handleMusicSelect(musicName as keyof typeof musicFiles)}
          />
        ))}
      </Menu>
      
      <IconButton
        icon={isPlaying ? "pause" : "play"}
        size={24}
        onPress={togglePlay}
      />

      <IconButton
        icon="volume-high"
        size={24}
        onPress={() => setVolumeDialogVisible(true)}
      />

      <Portal>
        <Dialog 
          visible={volumeDialogVisible} 
          onDismiss={() => setVolumeDialogVisible(false)}
        >
          <Dialog.Title>音量调节</Dialog.Title>
          <Dialog.Content>
            <View style={styles.volumeContainer}>
              <IconButton icon="volume-low" size={20} />
              <Slider
                value={volume}
                onValueChange={handleVolumeChange}
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                step={0.05}
              />
              <IconButton icon="volume-high" size={20} />
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
});
