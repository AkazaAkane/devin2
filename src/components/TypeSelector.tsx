import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Modal, Portal, List, Surface } from 'react-native-paper';

interface TypeSelectorProps {
  label: string;
  selectedTypes: string[];
  onTypeSelect: (types: string[]) => void;
  maxTypes?: number;
}

export default function TypeSelector({ 
  label, 
  selectedTypes, 
  onTypeSelect, 
  maxTypes = 2 
}: TypeSelectorProps) {
  const [visible, setVisible] = React.useState(false);
  const POKEMON_TYPES = [
    "一般", "虫", "恶", "龙", "电", "妖精", "格斗", "火", 
    "飞", "鬼", "草", "地面", "冰", "毒", "超能", "岩石", 
    "钢", "水"
  ];

  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <TouchableOpacity 
        onPress={() => setVisible(true)}
        style={styles.selectorButton}
      >
        <Text>
          {selectedTypes.length > 0 ? selectedTypes.join('/') : '选择属性'}
        </Text>
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Surface style={styles.modalSurface}>
            <ScrollView style={styles.typeList}>
              {POKEMON_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => {
                    const newTypes = selectedTypes.includes(type)
                      ? selectedTypes.filter(t => t !== type)
                      : [...selectedTypes, type].slice(0, maxTypes);
                    onTypeSelect(newTypes);
                    if (newTypes.length === maxTypes) {
                      setVisible(false);
                    }
                  }}
                  style={[
                    styles.typeItem,
                    selectedTypes.includes(type) && styles.selectedType
                  ]}
                >
                  <Text style={styles.typeText}>{type}</Text>
                  {selectedTypes.includes(type) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              onPress={() => setVisible(false)}
              style={styles.doneButton}
            >
              <Text style={styles.doneButtonText}>完成</Text>
            </TouchableOpacity>
          </Surface>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
  },
  selectorButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    minWidth: 100,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    margin: 20,
  },
  modalSurface: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    maxHeight: '80%',
  },
  typeList: {
    maxHeight: 400,
  },
  typeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedType: {
    backgroundColor: '#f0f0f0',
  },
  typeText: {
    fontSize: 16,
  },
  checkmark: {
    color: 'green',
    fontSize: 18,
  },
  doneButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 4,
    marginTop: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 