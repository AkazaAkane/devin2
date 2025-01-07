import { Audio } from 'expo-av';

class MusicService {
  private static instance: MusicService;
  private sound: Audio.Sound | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.8;  // Default volume

  private constructor() {}

  static getInstance(): MusicService {
    if (!MusicService.instance) {
      MusicService.instance = new MusicService();
    }
    return MusicService.instance;
  }

  async playMusic(musicFile: any) {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }
      
      const { sound } = await Audio.Sound.createAsync(
        musicFile,
        { 
          isLooping: true,
          volume: this.volume 
        }
      );
      
      this.sound = sound;
      await this.sound.playAsync();
      this.isPlaying = true;
    } catch (error) {
      console.error('Error playing music:', error);
    }
  }

  async togglePlay() {
    if (!this.sound) return;

    try {
      if (this.isPlaying) {
        await this.sound.pauseAsync();
      } else {
        await this.sound.playAsync();
      }
      this.isPlaying = !this.isPlaying;
    } catch (error) {
      console.error('Error toggling music:', error);
    }
  }

  async stopMusic() {
    if (!this.sound) return;

    try {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.isPlaying = false;
      this.sound = null;
    } catch (error) {
      console.error('Error stopping music:', error);
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  async setVolume(value: number) {
    try {
      this.volume = Math.max(0, Math.min(1, value)); // Ensure volume is between 0 and 1
      if (this.sound) {
        await this.sound.setVolumeAsync(this.volume);
      }
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  }

  getVolume(): number {
    return this.volume;
  }
}

export default MusicService.getInstance(); 