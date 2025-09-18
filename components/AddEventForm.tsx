
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

interface AddEventFormProps {
  onAddEvent: (event: {
    title: string;
    date: string;
    time: string;
    description?: string;
    color: string;
  }) => void;
  onClose: () => void;
}

const eventColors = [
  colors.primary,
  colors.secondary,
  colors.accent,
  colors.success,
  colors.warning,
];

export default function AddEventForm({ onAddEvent, onClose }: AddEventFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [selectedColor, setSelectedColor] = useState(eventColors[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  console.log('AddEventForm rendered');

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Fehler', 'Bitte gib einen Titel ein');
      return;
    }

    const event = {
      title: title.trim(),
      date: date.toISOString().split('T')[0],
      time: time.toTimeString().slice(0, 5),
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
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={commonStyles.subtitle}>Neuer Termin</Text>

      <TextInput
        style={commonStyles.input}
        placeholder="Titel des Termins"
        placeholderTextColor={colors.textSecondary}
        value={title}
        onChangeText={setTitle}
        autoFocus
      />

      <TextInput
        style={[commonStyles.input, styles.descriptionInput]}
        placeholder="Beschreibung (optional)"
        placeholderTextColor={colors.textSecondary}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />

      <View style={styles.dateTimeContainer}>
        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateTimeLabel}>Datum</Text>
          <Text style={styles.dateTimeValue}>
            {date.toLocaleDateString('de-DE')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.dateTimeLabel}>Zeit</Text>
          <Text style={styles.dateTimeValue}>
            {time.toTimeString().slice(0, 5)}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.colorLabel}>Farbe wählen</Text>
      <View style={styles.colorContainer}>
        {eventColors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColor
            ]}
            onPress={() => setSelectedColor(color)}
          />
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
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  dateTimeLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  colorLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
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
    marginTop: 20,
  },
});
