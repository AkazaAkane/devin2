import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, Button, TextInput, Title } from 'react-native-paper';
import { Pokemon } from '../types/pokemon';
import TypeSelector from './TypeSelector';

interface PokemonEditModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (pokemon: Pokemon) => void;
  initialPokemon?: Pokemon;
}

export default function PokemonEditModal({
  visible,
  onDismiss,
  onSave,
  initialPokemon,
}: PokemonEditModalProps) {
  const [pokemon, setPokemon] = useState<Partial<Pokemon>>(
    initialPokemon || {
      name: '',
      types: [],
      stats: {
        hp: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0,
      },
    }
  );

  const handleSave = () => {
    if (!pokemon.name || !pokemon.types || pokemon.types.length === 0) {
      alert('请填写宝可梦名称和属性');
      return;
    }
    onSave(pokemon as Pokemon);
    onDismiss();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <ScrollView>
          <Title>{initialPokemon ? '编辑宝可梦' : '添加宝可梦'}</Title>
          
          <TextInput
            label="名称"
            value={pokemon.name}
            onChangeText={(text) => setPokemon(prev => ({ ...prev, name: text }))}
            style={styles.input}
          />

          <TypeSelector
            label="属性"
            selectedTypes={pokemon.types || []}
            onTypeSelect={(types) => setPokemon(prev => ({ ...prev, types }))}
          />

          <Title style={styles.statsTitle}>能力值</Title>
          
          {Object.entries({
            hp: 'HP',
            attack: '攻击',
            defense: '防御',
            specialAttack: '特攻',
            specialDefense: '特防',
            speed: '速度',
          }).map(([key, label]) => (
            <TextInput
              key={key}
              label={label}
              keyboardType="numeric"
              value={pokemon.stats?.[key as keyof typeof pokemon.stats]?.toString()}
              onChangeText={(value) => {
                const numValue = parseInt(value) || 0;
                setPokemon(prev => ({
                  ...prev,
                  stats: {
                    hp: 0,
                    attack: 0,
                    defense: 0,
                    specialAttack: 0,
                    specialDefense: 0,
                    speed: 0,
                    ...prev.stats,
                    [key]: numValue,
                  },
                }));
              }}
              style={styles.input}
            />
          ))}

          <View style={styles.buttons}>
            <Button onPress={onDismiss}>取消</Button>
            <Button mode="contained" onPress={handleSave}>
              保存
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  input: {
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
}); 