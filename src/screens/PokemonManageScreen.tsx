import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Title, Text, Button, useTheme, Portal, Dialog, TextInput, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Pokemon, DEFAULT_POKEMON } from '../components/PokemonSelector';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@pokemon_list';

export default function PokemonManageScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [editingPokemon, setEditingPokemon] = useState<Pokemon | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved pokemon data when component mounts
  useEffect(() => {
    loadPokemons();
  }, []);

  // Load pokemons from storage
  const loadPokemons = async () => {
    try {
      const savedPokemons = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedPokemons) {
        setPokemons(JSON.parse(savedPokemons));
      } else {
        // If no saved data, use default pokemon
        setPokemons(DEFAULT_POKEMON);
        await savePokemons(DEFAULT_POKEMON);
      }
    } catch (error) {
      console.error('Error loading pokemons:', error);
      // Fallback to default pokemon on error
      setPokemons(DEFAULT_POKEMON);
    }
  };

  // Save pokemons to storage
  const savePokemons = async (newPokemons: Pokemon[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPokemons));
    } catch (error) {
      console.error('Error saving pokemons:', error);
    }
  };

  const renderStatItem = (label: string, value: number) => (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  const handleDelete = async (id: number) => {
    const newPokemons = pokemons.filter(p => p.id !== id);
    setPokemons(newPokemons);
    await savePokemons(newPokemons);
  };

  const handleEdit = (pokemon: Pokemon) => {
    setEditingPokemon(pokemon);
    setDialogVisible(true);
  };

  const handleSave = async () => {
    if (!editingPokemon) return;

    let newPokemons: Pokemon[];
    if (editingPokemon.id) {
      // Editing existing pokemon
      newPokemons = pokemons.map((p: Pokemon) => 
        p.id === editingPokemon.id ? editingPokemon : p
      );
    } else {
      // Adding new pokemon
      const newPokemon = {
        ...editingPokemon,
        id: Math.max(0, ...pokemons.map(p => p.id)) + 1
      };
      newPokemons = [...pokemons, newPokemon];
    }

    setPokemons(newPokemons);
    await savePokemons(newPokemons);
    setDialogVisible(false);
    setEditingPokemon(null);
  };

  useEffect(() => {
    loadPokemons().finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 返回按钮 */}
      <Button 
        mode="outlined"
        icon="arrow-left"
        onPress={() => navigation.goBack()}
        style={styles.returnButton}
      >
        返回主菜单
      </Button>

      <ScrollView style={styles.content}>
        <Title style={styles.screenTitle}>宝可梦管理</Title>

        {pokemons.map((pokemon) => (
          <Card key={pokemon.id} style={styles.card}>
            <Card.Content>
              <View style={styles.headerRow}>
                <Title>{pokemon.name}</Title>
                <View style={styles.buttonGroup}>
                  <Button 
                    icon="pencil" 
                    onPress={() => handleEdit(pokemon)}
                    mode="text"
                  >
                    编辑
                  </Button>
                  <Button 
                    icon="delete" 
                    onPress={() => handleDelete(pokemon.id)}
                    mode="text"
                    textColor={theme.colors.error}
                  >
                    删除
                  </Button>
                </View>
              </View>

              <Text style={styles.ownerText}>训练师: {pokemon.owner}</Text>
              <View style={[styles.typeTag, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.typeText}>{pokemon.type}</Text>
              </View>

              <View style={styles.statsRow}>
                {renderStatItem('HP', pokemon.hp)}
                {renderStatItem('攻击', pokemon.attack)}
                {renderStatItem('防御', pokemon.defense)}
                {renderStatItem('特攻', pokemon.spAtk)}
                {renderStatItem('特防', pokemon.spDef)}
                {renderStatItem('速度', pokemon.speed)}
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      {/* 添加新宝可梦的浮动按钮 */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          setEditingPokemon({
            id: 0,
            name: '',
            owner: '',
            type: '',
            hp: 0,
            attack: 0,
            defense: 0,
            spAtk: 0,
            spDef: 0,
            speed: 0,
          });
          setDialogVisible(true);
        }}
      />

      {/* 编辑对话框 */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>{editingPokemon?.id ? '编辑宝可梦' : '添加宝可梦'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="名称"
              value={editingPokemon?.name}
              onChangeText={text => setEditingPokemon(prev => prev ? {...prev, name: text} : null)}
              style={styles.input}
            />
            <TextInput
              label="训练师"
              value={editingPokemon?.owner}
              onChangeText={text => setEditingPokemon(prev => prev ? {...prev, owner: text} : null)}
              style={styles.input}
            />
            <TextInput
              label="属性"
              value={editingPokemon?.type}
              onChangeText={text => setEditingPokemon(prev => prev ? {...prev, type: text} : null)}
              style={styles.input}
            />
            <TextInput
              label="HP"
              value={editingPokemon?.hp.toString()}
              onChangeText={text => setEditingPokemon(prev => prev ? {...prev, hp: parseInt(text) || 0} : null)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="攻击"
              value={editingPokemon?.attack.toString()}
              onChangeText={text => setEditingPokemon(prev => prev ? {...prev, attack: parseInt(text) || 0} : null)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="防御"
              value={editingPokemon?.defense.toString()}
              onChangeText={text => setEditingPokemon(prev => prev ? {...prev, defense: parseInt(text) || 0} : null)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="特攻"
              value={editingPokemon?.spAtk.toString()}
              onChangeText={text => setEditingPokemon(prev => prev ? {...prev, spAtk: parseInt(text) || 0} : null)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="特防"
              value={editingPokemon?.spDef.toString()}
              onChangeText={text => setEditingPokemon(prev => prev ? {...prev, spDef: parseInt(text) || 0} : null)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="速度"
              value={editingPokemon?.speed.toString()}
              onChangeText={text => setEditingPokemon(prev => prev ? {...prev, speed: parseInt(text) || 0} : null)}
              keyboardType="numeric"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>取消</Button>
            <Button onPress={handleSave}>保存</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  returnButton: {
    margin: 16,
  },
  screenTitle: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  ownerText: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 8,
  },
  typeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  typeText: {
    color: 'white',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    minWidth: 50,
    padding: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  input: {
    marginBottom: 8,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 