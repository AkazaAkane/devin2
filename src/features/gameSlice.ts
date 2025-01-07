import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GameEvent {
  id: string;
  roundNumber: number;
  playerId: string;
  title: string;
  description?: string;
  type: 'POKEMON' | 'ITEM' | 'BADGE' | 'BATTLE' | 'STORY' | 'SPECIAL' | 'OTHER';
  details?: {
    pokemonName?: string;
    itemName?: string;
    location?: string;
    badgeName?: string;
    battleResult?: string;
  };
  timestamp: Date;
}

export interface Player {
  id: string;
  name: string;
  order: number;
}

export interface Badge {
  id: string;
  name: string;
  city: string;
  obtained: boolean;
}

export interface City {
  id: string;
  name: string;
  eventsCompleted: boolean;
  gymChallenged: boolean;
}

export interface PlayerProfile {
  id: string;
  name: string;
  money: number;
  badges: Badge[];
  cityProgress: City[];
}

interface GameState {
  currentRound: number;
  currentPlayerId: string | null;
  players: Player[];
  events: GameEvent[];
  isGameStarted: boolean;
  playerProfiles: PlayerProfile[];
}

const initialState: GameState = {
  currentRound: 1,
  currentPlayerId: null,
  players: [],
  events: [],
  isGameStarted: false,
  playerProfiles: [],
};

const INITIAL_BADGES: Badge[] = [
  { id: '1', name: '石之徽章', city: '卡那兹市', obtained: false },
  { id: '2', name: '拳击徽章', city: '武斗市', obtained: false },
  { id: '3', name: '电力徽章', city: '紫堇市', obtained: false },
  { id: '4', name: '烈焰徽章', city: '釜炎镇', obtained: false },
  { id: '5', name: '平衡徽章', city: '绿岭市', obtained: false },
  { id: '6', name: '羽翼徽章', city: '茵郁市', obtained: false },
  { id: '7', name: '心灵徽章', city: '凯那市', obtained: false },
  { id: '8', name: '雨滴徽章', city: '琉璃市', obtained: false },
];

const INITIAL_CITIES: City[] = [
  { id: '1', name: '卡那兹市', eventsCompleted: false, gymChallenged: false },
  { id: '2', name: '武斗市', eventsCompleted: false, gymChallenged: false },
  // ... add all cities
];

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state, action: PayloadAction<Player[]>) => {
      state.isGameStarted = true;
      state.currentRound = 1;
      state.players = action.payload;
      state.currentPlayerId = action.payload[0].id;
      state.events = [];
    },
    endTurn: (state) => {
      const currentPlayerIndex = state.players.findIndex(p => p.id === state.currentPlayerId);
      const nextPlayerIndex = (currentPlayerIndex + 1) % state.players.length;
      
      if (nextPlayerIndex === 0) {
        state.currentRound += 1;
      }
      
      state.currentPlayerId = state.players[nextPlayerIndex].id;
    },
    addEvent: (state, action: PayloadAction<Omit<GameEvent, 'id' | 'timestamp'>>) => {
      state.events.push({
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
      });
    },
    endGame: (state) => {
      state.isGameStarted = false;
    },
    updatePlayerMoney: (state, action: PayloadAction<{ playerId: string; amount: number }>) => {
      const profile = state.playerProfiles.find(p => p.id === action.payload.playerId);
      if (profile) {
        profile.money += action.payload.amount;
      }
    },
    toggleBadge: (state, action: PayloadAction<{ playerId: string; badgeId: string }>) => {
      const profile = state.playerProfiles.find(p => p.id === action.payload.playerId);
      if (profile) {
        const badge = profile.badges.find(b => b.id === action.payload.badgeId);
        if (badge) {
          badge.obtained = !badge.obtained;
        }
      }
    },
    updateCityProgress: (state, action: PayloadAction<{ 
      playerId: string; 
      cityId: string; 
      type: 'events' | 'gym';
    }>) => {
      const profile = state.playerProfiles.find(p => p.id === action.payload.playerId);
      if (profile) {
        const city = profile.cityProgress.find(c => c.id === action.payload.cityId);
        if (city) {
          if (action.payload.type === 'events') {
            city.eventsCompleted = !city.eventsCompleted;
          } else {
            city.gymChallenged = !city.gymChallenged;
          }
        }
      }
    },
  },
});

export const { startGame, endTurn, addEvent, endGame, updatePlayerMoney, toggleBadge, updateCityProgress } = gameSlice.actions;
export default gameSlice.reducer; 