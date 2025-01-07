import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pokemon } from '../types/pokemon';

const STORAGE_KEY = 'POKEMON_DATA';

// Default Pokemon for testing
const DEFAULT_POKEMON: Pokemon[] = [
  {
    id: 1,
    name: "妙蛙种子",
    types: ["草", "毒"],
    stats: {
      hp: 45,
      attack: 49,
      defense: 49,
      specialAttack: 65,
      specialDefense: 65,
      speed: 45,
    },
  },
  {
    id: 4,
    name: "小火龙",
    types: ["火"],
    stats: {
      hp: 39,
      attack: 52,
      defense: 43,
      specialAttack: 60,
      specialDefense: 50,
      speed: 65,
    },
  },
  {
    id: 7,
    name: "杰尼龟",
    types: ["水"],
    stats: {
      hp: 44,
      attack: 48,
      defense: 65,
      specialAttack: 50,
      specialDefense: 64,
      speed: 43,
    },
  },
];

export const pokemonStorage = {
  async getAll(): Promise<Pokemon[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) {
        // First time: save and return default Pokemon
        await this.saveAll(DEFAULT_POKEMON);
        return DEFAULT_POKEMON;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading Pokemon:', error);
      return DEFAULT_POKEMON;
    }
  },

  async saveAll(pokemon: Pokemon[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pokemon));
    } catch (error) {
      console.error('Error saving Pokemon:', error);
    }
  },

  async addPokemon(pokemon: Pokemon): Promise<void> {
    try {
      const existing = await this.getAll();
      const maxId = Math.max(...existing.map(p => p.id), 0);
      const newPokemon = { ...pokemon, id: maxId + 1 };
      await this.saveAll([...existing, newPokemon]);
    } catch (error) {
      console.error('Error adding Pokemon:', error);
    }
  },

  async updatePokemon(pokemon: Pokemon): Promise<void> {
    try {
      const existing = await this.getAll();
      const updated = existing.map(p => 
        p.id === pokemon.id ? pokemon : p
      );
      await this.saveAll(updated);
    } catch (error) {
      console.error('Error updating Pokemon:', error);
    }
  },

  async deletePokemon(id: number): Promise<void> {
    try {
      const existing = await this.getAll();
      const filtered = existing.filter(p => p.id !== id);
      await this.saveAll(filtered);
    } catch (error) {
      console.error('Error deleting Pokemon:', error);
    }
  },
}; 