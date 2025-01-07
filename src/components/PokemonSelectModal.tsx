import React from 'react';
import { Modal, Portal, Button, Card, List } from 'react-native-paper';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Pokemon } from '../types/pokemon';

interface PokemonSelectModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (pokemon: Pokemon) => void;
  pokemons: Pokemon[];
}

export default function PokemonSelectModal({
  visible,
  onDismiss,
  onSelect,
  pokemons,
}: PokemonSelectModalProps) {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <Card>
          <Card.Title title="选择宝可梦" />
          <Card.Content>
            <ScrollView style={styles.scrollView}>
              {pokemons.map((pokemon) => (
                <List.Item
                  key={pokemon.id}
                  title={pokemon.name}
                  description={`${pokemon.types.join('/')} | HP:${pokemon.stats.hp}`}
                  onPress={() => {
                    onSelect(pokemon);
                    onDismiss();
                  }}
                  right={() => (
                    <View style={styles.stats}>
                      <List.Item
                        title={`攻:${pokemon.stats.attack} 防:${pokemon.stats.defense}`}
                        description={`特攻:${pokemon.stats.specialAttack} 特防:${pokemon.stats.specialDefense}`}
                      />
                    </View>
                  )}
                />
              ))}
            </ScrollView>
          </Card.Content>
          <Card.Actions>
            <Button onPress={onDismiss}>取消</Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  scrollView: {
    maxHeight: 400,
  },
  stats: {
    flex: 1,
    alignItems: 'flex-end',
  },
}); 