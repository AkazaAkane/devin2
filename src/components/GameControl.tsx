import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text, Portal, Dialog, TextInput, SegmentedButtons, List } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { endTurn, addEvent, GameEvent } from '../features/gameSlice';

const EVENT_TYPES = [
  { label: '宝可梦', value: 'POKEMON', icon: 'pokeball' },
  { label: '道具', value: 'ITEM', icon: 'package' },
  { label: '徽章', value: 'BADGE', icon: 'shield-star' },
  { label: '战斗', value: 'BATTLE', icon: 'sword-cross' },
  { label: '剧情', value: 'STORY', icon: 'book-open-variant' },
  { label: '特殊', value: 'SPECIAL', icon: 'star' },
] as const;

export default function GameControl() {
  const dispatch = useAppDispatch();
  const { currentRound, currentPlayerId, players } = useAppSelector(state => state.game);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState<GameEvent['type']>('OTHER');
  const [eventDetails, setEventDetails] = useState<GameEvent['details']>({});

  const currentPlayer = players.find(p => p.id === currentPlayerId);

  const handleEndTurn = () => {
    dispatch(endTurn());
  };

  const handleAddEvent = () => {
    if (eventTitle.trim()) {
      dispatch(addEvent({
        roundNumber: currentRound,
        playerId: currentPlayerId!,
        title: eventTitle,
        description: eventDescription,
        type: eventType,
        details: eventDetails,
      }));
      setShowEventDialog(false);
      resetEventForm();
    }
  };

  const resetEventForm = () => {
    setEventTitle('');
    setEventDescription('');
    setEventType('OTHER');
    setEventDetails({});
  };

  const renderDetailFields = () => {
    switch (eventType) {
      case 'POKEMON':
        return (
          <TextInput
            label="宝可梦名称"
            value={eventDetails?.pokemonName ?? ''}
            onChangeText={(text) => setEventDetails({ ...eventDetails ?? {}, pokemonName: text })}
            style={styles.input}
          />
        );
      case 'ITEM':
        return (
          <TextInput
            label="道具名称"
            value={eventDetails?.itemName ?? ''}
            onChangeText={(text) => setEventDetails({ ...eventDetails ?? {}, itemName: text })}
            style={styles.input}
          />
        );
      case 'BADGE':
        return (
          <TextInput
            label="徽章名称"
            value={eventDetails?.badgeName ?? ''}
            onChangeText={(text) => setEventDetails({ ...eventDetails ?? {}, badgeName: text })}
            style={styles.input}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleLarge">第 {currentRound} 回合</Text>
          <Text variant="titleMedium">当前玩家: {currentPlayer?.name}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => setShowEventDialog(true)}
            icon="bookmark-plus"
          >
            记录事件
          </Button>
          <Button
            mode="contained"
            onPress={handleEndTurn}
            icon="arrow-right-circle"
          >
            结束回合
          </Button>
        </View>
      </Card.Content>

      <Portal>
        <Dialog visible={showEventDialog} onDismiss={() => setShowEventDialog(false)}>
          <Dialog.Title>记录事件</Dialog.Title>
          <Dialog.Content>
            <SegmentedButtons
              value={eventType}
              onValueChange={(value) => setEventType(value as GameEvent['type'])}
              buttons={EVENT_TYPES.map(type => ({
                value: type.value,
                label: type.label,
                icon: type.icon,
              }))}
              style={styles.segmentedButtons}
            />
            <TextInput
              label="事件标题"
              value={eventTitle}
              onChangeText={setEventTitle}
              style={styles.input}
            />
            {renderDetailFields()}
            <TextInput
              label="事件描述（可选）"
              value={eventDescription}
              onChangeText={setEventDescription}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowEventDialog(false)}>取消</Button>
            <Button onPress={handleAddEvent}>确认</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  header: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  input: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
}); 