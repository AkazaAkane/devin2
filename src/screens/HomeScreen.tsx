import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Button } from 'react-native-paper';
import ScreenHeader from '../components/ScreenHeader';

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <ScreenHeader title="宝可梦对战计算器" />
      
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('Battle')}
              style={styles.button}
            >
              快速战斗计算
            </Button>
            
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('PokemonManage')}
              style={styles.button}
            >
              宝可梦管理
            </Button>
          </Card.Content>
        </Card>
      </View>
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
    justifyContent: 'center',
  },
  card: {
    elevation: 4,
  },
  button: {
    marginVertical: 8,
    paddingVertical: 8,
  },
}); 