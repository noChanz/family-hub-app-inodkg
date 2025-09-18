
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';

interface AddItemFormProps {
  onAddItem: (item: {
    name: string;
    quantity?: string;
    addedBy: string;
  }) => void;
  onClose: () => void;
}

const familyMembers = ['Mama', 'Papa', 'Emma', 'Max'];

export default function AddItemForm({ onAddItem, onClose }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedMember, setSelectedMember] = useState(familyMembers[0]);

  console.log('AddItemForm rendered');

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Fehler', 'Bitte gib einen Artikel ein');
      return;
    }

    const item = {
      name: name.trim(),
      quantity: quantity.trim() || undefined,
      addedBy: selectedMember,
    };

    console.log('Submitting item:', item);
    onAddItem(item);
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={commonStyles.subtitle}>Artikel hinzufügen</Text>

      <TextInput
        style={commonStyles.input}
        placeholder="Was soll eingekauft werden?"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
        autoFocus
      />

      <TextInput
        style={commonStyles.input}
        placeholder="Menge (optional)"
        placeholderTextColor={colors.textSecondary}
        value={quantity}
        onChangeText={setQuantity}
      />

      <Text style={styles.memberLabel}>Hinzugefügt von</Text>
      <View style={styles.memberContainer}>
        {familyMembers.map((member) => (
          <TouchableOpacity
            key={member}
            style={[
              styles.memberOption,
              selectedMember === member && styles.selectedMember
            ]}
            onPress={() => setSelectedMember(member)}
          >
            <Text style={[
              styles.memberText,
              selectedMember === member && styles.selectedMemberText
            ]}>
              {member}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[buttonStyles.secondary, { flex: 1, marginRight: 8 }]}
          onPress={onClose}
        >
          <Text style={[commonStyles.text, { color: colors.textSecondary }]}>
            Abbrechen
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
          onPress={handleSubmit}
        >
          <Text style={[commonStyles.text, { color: colors.backgroundAlt }]}>
            Hinzufügen
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  memberLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  memberContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  memberOption: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedMember: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  memberText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedMemberText: {
    color: colors.backgroundAlt,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
});
