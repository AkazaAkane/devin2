import React from 'react';
import { View } from 'react-native';
import { Button, Menu } from 'react-native-paper';

export interface Pokemon {
  id: number;
  name: string;
  owner: string;
  type: string;
  hp: number;
  attack: number;
  defense: number;
  spAtk: number;
  spDef: number;
  speed: number;
}

// Mock data for saved Pokemon
export const DEFAULT_POKEMON: Pokemon[] = [
  {
    id: 1,
    name: "妙蛙种子",
    owner: "小智",
    type: "草",
    hp: 45,
    attack: 49,
    defense: 49,
    spAtk: 65,
    spDef: 65,
    speed: 45,
  },
  {
    id: 4,
    name: "小火龙",
    owner: "小茂",
    type: "火",
    hp: 39,
    attack: 52,
    defense: 43,
    spAtk: 60,
    spDef: 50,
    speed: 65,
  },
  {
    id: 7,
    name: "杰尼龟",
    owner: "小霞",
    type: "水",
    hp: 44,
    attack: 48,
    defense: 65,
    spAtk: 50,
    spDef: 64,
    speed: 43,
  },
];

interface PokemonSelectorProps {
  onSelect: (pokemon: Pokemon) => void;
}

export default function PokemonSelector({ onSelect }: PokemonSelectorProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button 
            mode="outlined" 
            onPress={() => setVisible(true)}
            style={{ justifyContent: 'flex-start' }}
          >
            选择宝可梦
          </Button>
        }
      >
        {DEFAULT_POKEMON.map((pokemon) => (
          <Menu.Item
            key={pokemon.id}
            title={`${pokemon.name} (${pokemon.owner})`}
            onPress={() => {
              onSelect(pokemon);
              setVisible(false);
            }}
          />
        ))}
      </Menu>
    </View>
  );
} 