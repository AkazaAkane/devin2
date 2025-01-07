import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, List, Divider, SegmentedButtons, IconButton } from 'react-native-paper';
import { useAppSelector } from '../hooks/redux';
import { GameEvent } from '../features/gameSlice';

export default function GameTimeline() {
  const { events, players } = useAppSelector(state => state.game);
  const [selectedPlayer, setSelectedPlayer] = useState<string | 'all'>('all');
  const [expandedRounds, setExpandedRounds] = useState<Set<string>>(new Set());

  const filteredEvents = events.filter(event => 
    selectedPlayer === 'all' || event.playerId === selectedPlayer
  );

  const eventsByRound = filteredEvents.reduce((acc, event) => {
    if (!acc[event.roundNumber]) {
      acc[event.roundNumber] = [];
    }
    acc[event.roundNumber].push(event);
    return acc;
  }, {} as Record<number, typeof events>);

  const toggleRoundExpansion = (round: string) => {
    const newExpanded = new Set(expandedRounds);
    if (expandedRounds.has(round)) {
      newExpanded.delete(round);
    } else {
      newExpanded.add(round);
    }
    setExpandedRounds(newExpanded);
  };

  const renderEventDetails = (event: GameEvent) => {
    const details = [];
    if (event.details?.pokemonName) {
      details.push(`宝可梦: ${event.details.pokemonName}`);
    }
    if (event.details?.itemName) {
      details.push(`道具: ${event.details.itemName}`);
    }
    if (event.details?.badgeName) {
      details.push(`徽章: ${event.details.badgeName}`);
    }
    if (event.details?.location) {
      details.push(`地点: ${event.details.location}`);
    }
    return details.length > 0 ? details.join(' | ') : event.description;
  };

  return (
    <View style={styles.container}>
      <Card style={styles.filterCard}>
        <Card.Content>
          <SegmentedButtons
            value={selectedPlayer}
            onValueChange={setSelectedPlayer}
            buttons={[
              { value: 'all', label: '全部' },
              ...players.map(player => ({
                value: player.id,
                label: player.name,
              })),
            ]}
          />
        </Card.Content>
      </Card>
      
      <ScrollView>
        <View style={styles.timeline}>
          {Object.entries(eventsByRound).map(([round, roundEvents]) => (
            <View key={round} style={styles.timelineItem}>
              <View style={styles.timelineLine} />
              <Card style={styles.roundCard}>
                <Card.Content>
                  <View style={styles.roundHeader}>
                    <Text variant="titleLarge">第 {round} 回合</Text>
                    <IconButton
                      icon={expandedRounds.has(round) ? 'chevron-up' : 'chevron-down'}
                      onPress={() => toggleRoundExpansion(round)}
                    />
                  </View>
                  {expandedRounds.has(round) && (
                    <>
                      <Divider style={styles.divider} />
                      {roundEvents.map(event => (
                        <List.Item
                          key={event.id}
                          title={event.title}
                          description={renderEventDetails(event)}
                          left={props => <List.Icon {...props} icon={getEventIcon(event.type)} />}
                          style={styles.eventItem}
                        />
                      ))}
                    </>
                  )}
                </Card.Content>
              </Card>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function getEventIcon(type: string) {
  switch (type) {
    case 'POKEMON': return 'pokeball';
    case 'BADGE': return 'shield-star';
    case 'ITEM': return 'package';
    case 'BATTLE': return 'sword-cross';
    case 'STORY': return 'book-open-variant';
    case 'SPECIAL': return 'star';
    default: return 'bookmark';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  filterCard: {
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 24,
  },
  timelineItem: {
    position: 'relative',
    marginBottom: 16,
  },
  timelineLine: {
    position: 'absolute',
    left: -16,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#2196F3',
  },
  roundCard: {
    marginLeft: 16,
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 8,
  },
  eventItem: {
    paddingLeft: 0,
  },
}); 