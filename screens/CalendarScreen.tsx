
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';
import SimpleBottomSheet from '../components/BottomSheet';
import AddEventForm from '../components/AddEventForm';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description?: string;
  color: string;
}

export default function CalendarScreen() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Zahnarzttermin',
      date: '2024-01-15',
      time: '10:00',
      description: 'Kontrolle für Max',
      color: colors.primary,
    },
    {
      id: '2',
      title: 'Elternabend',
      date: '2024-01-18',
      time: '19:00',
      description: 'Schule von Emma',
      color: colors.accent,
    },
    {
      id: '3',
      title: 'Familienausflug',
      date: '2024-01-20',
      time: '14:00',
      description: 'Zoo besuchen',
      color: colors.secondary,
    },
  ]);
  
  const [isAddEventVisible, setIsAddEventVisible] = useState(false);

  console.log('CalendarScreen rendered, events count:', events.length);

  const addEvent = (newEvent: Omit<Event, 'id'>) => {
    const event: Event = {
      ...newEvent,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, event]);
    console.log('Event added:', event);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    console.log('Event deleted:', eventId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    });
  };

  const sortedEvents = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.content}>
        <Text style={commonStyles.title}>Familienkalender</Text>
        <Text style={commonStyles.textSecondary}>Gemeinsame Termine und Ereignisse</Text>

        <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
          {sortedEvents.map((event) => (
            <View key={event.id} style={[commonStyles.card, styles.eventCard]}>
              <View style={commonStyles.row}>
                <View style={[styles.eventColorIndicator, { backgroundColor: event.color }]} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDateTime}>
                    {formatDate(event.date)} • {event.time}
                  </Text>
                  {event.description && (
                    <Text style={styles.eventDescription}>{event.description}</Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => deleteEvent(event.id)}
                  style={styles.deleteButton}
                >
                  <Icon name="trash" size={20} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {events.length === 0 && (
            <View style={commonStyles.centerContent}>
              <Icon name="calendar" size={64} color={colors.grey} />
              <Text style={[commonStyles.text, { marginTop: 16 }]}>
                Noch keine Termine vorhanden
              </Text>
              <Text style={commonStyles.textSecondary}>
                Füge den ersten Termin hinzu
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={buttonStyles.fab}
        onPress={() => {
          console.log('Add event FAB pressed');
          setIsAddEventVisible(true);
        }}
      >
        <Icon name="add" size={24} color={colors.backgroundAlt} />
      </TouchableOpacity>

      <SimpleBottomSheet
        isVisible={isAddEventVisible}
        onClose={() => setIsAddEventVisible(false)}
      >
        <AddEventForm
          onAddEvent={addEvent}
          onClose={() => setIsAddEventVisible(false)}
        />
      </SimpleBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  eventsList: {
    flex: 1,
    marginTop: 20,
  },
  eventCard: {
    marginBottom: 12,
  },
  eventColorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  eventDateTime: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.text,
  },
  deleteButton: {
    padding: 8,
  },
});
