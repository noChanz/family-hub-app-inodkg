
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';
import SimpleBottomSheet from '../components/BottomSheet';
import AddItemForm from '../components/AddItemForm';

interface ShoppingItem {
  id: string;
  name: string;
  quantity?: string;
  completed: boolean;
  addedBy: string;
}

export default function ShoppingListScreen() {
  const [items, setItems] = useState<ShoppingItem[]>([
    {
      id: '1',
      name: 'Milch',
      quantity: '2 Liter',
      completed: false,
      addedBy: 'Mama',
    },
    {
      id: '2',
      name: 'Brot',
      quantity: '1 Laib',
      completed: true,
      addedBy: 'Papa',
    },
    {
      id: '3',
      name: 'Äpfel',
      quantity: '1 kg',
      completed: false,
      addedBy: 'Emma',
    },
    {
      id: '4',
      name: 'Joghurt',
      completed: false,
      addedBy: 'Max',
    },
  ]);
  
  const [isAddItemVisible, setIsAddItemVisible] = useState(false);

  console.log('ShoppingListScreen rendered, items count:', items.length);

  const addItem = (newItem: Omit<ShoppingItem, 'id' | 'completed'>) => {
    const item: ShoppingItem = {
      ...newItem,
      id: Date.now().toString(),
      completed: false,
    };
    setItems(prev => [...prev, item]);
    console.log('Item added:', item);
  };

  const toggleItem = (itemId: string) => {
    setItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, completed: !item.completed }
          : item
      )
    );
    console.log('Item toggled:', itemId);
  };

  const deleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    console.log('Item deleted:', itemId);
  };

  const clearCompleted = () => {
    setItems(prev => prev.filter(item => !item.completed));
    console.log('Completed items cleared');
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={commonStyles.row}>
          <View>
            <Text style={commonStyles.title}>Einkaufsliste</Text>
            <Text style={commonStyles.textSecondary}>
              {completedCount} von {totalCount} erledigt
            </Text>
          </View>
          {completedCount > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearCompleted}
            >
              <Text style={styles.clearButtonText}>Erledigte löschen</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
          {items.map((item) => (
            <View key={item.id} style={[commonStyles.card, styles.itemCard]}>
              <View style={commonStyles.row}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => toggleItem(item.id)}
                >
                  <View style={[
                    styles.checkboxInner,
                    item.completed && styles.checkboxCompleted
                  ]}>
                    {item.completed && (
                      <Icon name="checkmark" size={16} color={colors.backgroundAlt} />
                    )}
                  </View>
                </TouchableOpacity>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[
                    styles.itemName,
                    item.completed && styles.itemNameCompleted
                  ]}>
                    {item.name}
                  </Text>
                  <View style={styles.itemDetails}>
                    {item.quantity && (
                      <Text style={styles.itemQuantity}>{item.quantity}</Text>
                    )}
                    <Text style={styles.itemAddedBy}>von {item.addedBy}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => deleteItem(item.id)}
                  style={styles.deleteButton}
                >
                  <Icon name="trash" size={20} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {items.length === 0 && (
            <View style={commonStyles.centerContent}>
              <Icon name="list" size={64} color={colors.grey} />
              <Text style={[commonStyles.text, { marginTop: 16 }]}>
                Einkaufsliste ist leer
              </Text>
              <Text style={commonStyles.textSecondary}>
                Füge das erste Element hinzu
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={buttonStyles.fab}
        onPress={() => {
          console.log('Add item FAB pressed');
          setIsAddItemVisible(true);
        }}
      >
        <Icon name="add" size={24} color={colors.backgroundAlt} />
      </TouchableOpacity>

      <SimpleBottomSheet
        isVisible={isAddItemVisible}
        onClose={() => setIsAddItemVisible(false)}
      >
        <AddItemForm
          onAddItem={addItem}
          onClose={() => setIsAddItemVisible(false)}
        />
      </SimpleBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  itemsList: {
    flex: 1,
    marginTop: 20,
  },
  itemCard: {
    marginBottom: 12,
  },
  checkbox: {
    padding: 4,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundAlt,
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  itemNameCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  itemAddedBy: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
  },
  clearButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearButtonText: {
    color: colors.backgroundAlt,
    fontSize: 12,
    fontWeight: '500',
  },
});
