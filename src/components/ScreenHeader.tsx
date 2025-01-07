import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

type Props = {
  title: string;
};

export default function ScreenHeader({ title }: Props) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={() => navigation.goBack()}
      />
      <Text variant="headlineMedium" style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingTop: 16,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginRight: 48, // To center the title accounting for the back button
  },
}); 