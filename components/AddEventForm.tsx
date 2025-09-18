
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';

interface AddEventFormProps {
  onAddEvent: (event: {
    title: string;
    date: string;
    time: string;
    description?: string;
    color: string;
  }) => void;
  onClose: () => void;
  selectedDate?: string;
}

const eventColors = [
  { name: 'Blau', value: colors.primary },
  { name: 'Grün', value: colors.secondary },
  { name: 'Orange', value: colors.accent },
  { name: 'Rot', value: colors.danger },
  { name: 'Lila', value: '#8B5CF6' },
  { name: 'Rosa', value: '#EC4899' },
];

export default function AddEventForm({ onAddEvent, onClose, selectedDate }: AddEventFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(selectedDate ? new Date(selectedDate) : new Date());
  const [time, setTime] = useState(new Date());
  const [selectedColor, setSelectedColor] = useState(colors.primary);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  console.log('AddEventForm rendered with selectedDate:', selectedDate);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Fehler', 'Bitte gib einen Titel ein');
      return;
    }

    const event = {
      title: title.trim(),
      date: date.toISOString().split('T')[0],
      time: time.toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      description: description.trim() || undefined,
      color: selectedColor,
    };

    console.log('Submitting event:', event);
    onAddEvent(event);
    onClose();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      console.log('Date changed to:', selectedDate.toISOString().split('T')[0]);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
      console.log('Time changed to:', selectedTime.toLocaleTimeString());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Neuer Termin</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Titel *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="z.B. Zahnarzttermin"
          placeholderTextColor={colors.grey}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Beschreibung</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Zusätzliche Details..."
          placeholderTextColor={colors.grey}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={commonStyles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Datum</Text>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateTimeText}>
              {date.toLocaleDateString('de-DE')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Uhrzeit</Text>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.dateTimeText}>
              {time.toLocaleTimeString('de-DE', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Farbe</Text>
        <View style={styles.colorPicker}>
          {eventColors.map((color) => (
            <TouchableOpacity
              key={color.value}
              style={[
                styles.colorOption,
                { backgroundColor: color.value },
                selectedColor === color.value && styles.selectedColor,
              ]}
              onPress={() => {
                setSelectedColor(color.value);
                console.log('Color selected:', color.name);
              }}
            />
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[buttonStyles.secondary, { flex: 1, marginRight: 8 }]}
          onPress={onClose}
        >
          <Text style={buttonStyles.secondaryText}>Abbrechen</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
          onPress={handleSubmit}
        >
          <Text style={buttonStyles.primaryText}>Hinzufügen</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.backgroundAlt,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.backgroundAlt,
  },
  dateTimeText: {
    fontSize: 16,
    color: colors.text,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
});
