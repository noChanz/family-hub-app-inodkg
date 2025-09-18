
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';
import SimpleBottomSheet from '../components/BottomSheet';
import AddEventForm from '../components/AddEventForm';

// Configure German locale for the calendar
LocaleConfig.locales['de'] = {
  monthNames: [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
    'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'
  ],
  dayNames: [
    'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'
  ],
  dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  today: 'Heute'
};
LocaleConfig.defaultLocale = 'de';

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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

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

  // Create marked dates object for the calendar
  const getMarkedDates = () => {
    const marked: any = {};
    
    // Mark today
    const today = new Date().toISOString().split('T')[0];
    marked[today] = {
      selected: selectedDate === today,
      selectedColor: colors.primary,
      marked: events.some(event => event.date === today),
      dotColor: colors.accent,
    };

    // Mark selected date
    if (selectedDate !== today) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: colors.primary,
        marked: events.some(event => event.date === selectedDate),
        dotColor: colors.accent,
      };
    }

    // Mark dates with events
    events.forEach(event => {
      if (marked[event.date]) {
        marked[event.date].marked = true;
        marked[event.date].dotColor = event.color;
      } else {
        marked[event.date] = {
          marked: true,
          dotColor: event.color,
        };
      }
    });

    return marked;
  };

  // Get events for selected date
  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const selectedDateEvents = getEventsForDate(selectedDate);
  const sortedEvents = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.content}>
        <Text style={commonStyles.title}>Familienkalender</Text>
        <Text style={commonStyles.textSecondary}>Gemeinsame Termine und Ereignisse</Text>

        {/* Calendar Component */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            onDayPress={(day) => {
              console.log('Selected date:', day.dateString);
              setSelectedDate(day.dateString);
            }}
            markedDates={getMarkedDates()}
            theme={{
              backgroundColor: colors.backgroundAlt,
              calendarBackground: colors.backgroundAlt,
              textSectionTitleColor: colors.text,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: colors.backgroundAlt,
              todayTextColor: colors.primary,
              dayTextColor: colors.text,
              textDisabledColor: colors.grey,
              dotColor: colors.accent,
              selectedDotColor: colors.backgroundAlt,
              arrowColor: colors.primary,
              monthTextColor: colors.text,
              indicatorColor: colors.primary,
              textDayFontFamily: 'System',
              textMonthFontFamily: 'System',
              textDayHeaderFontFamily: 'System',
              textDayFontWeight: '400',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            style={styles.calendar}
          />
        </View>

        {/* Events for selected date */}
        <View style={styles.selectedDateSection}>
          <Text style={styles.selectedDateTitle}>
            {selectedDate === new Date().toISOString().split('T')[0] 
              ? 'Heute' 
              : formatDate(selectedDate)
            }
          </Text>
          
          <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event) => (
                <View key={event.id} style={[commonStyles.card, styles.eventCard]}>
                  <View style={commonStyles.row}>
                    <View style={[styles.eventColorIndicator, { backgroundColor: event.color }]} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <Text style={styles.eventTime}>{event.time}</Text>
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
              ))
            ) : (
              <View style={styles.noEventsContainer}>
                <Icon name="calendar-outline" size={48} color={colors.grey} />
                <Text style={styles.noEventsText}>Keine Termine an diesem Tag</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Upcoming events section */}
        {selectedDateEvents.length === 0 && (
          <View style={styles.upcomingSection}>
            <Text style={styles.sectionTitle}>Kommende Termine</Text>
            <ScrollView style={styles.upcomingList} showsVerticalScrollIndicator={false}>
              {sortedEvents.slice(0, 3).map((event) => (
                <View key={event.id} style={[commonStyles.card, styles.upcomingEventCard]}>
                  <View style={commonStyles.row}>
                    <View style={[styles.eventColorIndicator, { backgroundColor: event.color }]} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <Text style={styles.eventDateTime}>
                        {formatDate(event.date)} • {event.time}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
              
              {sortedEvents.length === 0 && (
                <View style={styles.noEventsContainer}>
                  <Icon name="calendar" size={48} color={colors.grey} />
                  <Text style={styles.noEventsText}>Noch keine Termine vorhanden</Text>
                  <Text style={commonStyles.textSecondary}>
                    Füge den ersten Termin hinzu
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}
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
          selectedDate={selectedDate}
        />
      </SimpleBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.backgroundAlt,
    elevation: 2,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendar: {
    borderRadius: 12,
  },
  selectedDateSection: {
    marginTop: 20,
    flex: 1,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  eventsList: {
    flex: 1,
  },
  eventCard: {
    marginBottom: 8,
  },
  upcomingEventCard: {
    marginBottom: 8,
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
  eventTime: {
    fontSize: 14,
    color: colors.textSecondary,
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
  noEventsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noEventsText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  upcomingSection: {
    marginTop: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  upcomingList: {
    flex: 1,
  },
});
