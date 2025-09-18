
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import CalendarScreen from '../screens/CalendarScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';

type TabType = 'calendar' | 'shopping';

export default function BottomTabNavigator() {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');

  console.log('BottomTabNavigator rendered, activeTab:', activeTab);

  const renderScreen = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarScreen />;
      case 'shopping':
        return <ShoppingListScreen />;
      default:
        return <CalendarScreen />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>
      
      <View style={[commonStyles.bottomTabBar, styles.tabBar]}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'calendar' && styles.activeTab]}
          onPress={() => {
            console.log('Calendar tab pressed');
            setActiveTab('calendar');
          }}
        >
          <Icon 
            name="calendar" 
            size={24} 
            color={activeTab === 'calendar' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'calendar' ? colors.primary : colors.textSecondary }
          ]}>
            Kalender
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'shopping' && styles.activeTab]}
          onPress={() => {
            console.log('Shopping tab pressed');
            setActiveTab('shopping');
          }}
        >
          <Icon 
            name="list" 
            size={24} 
            color={activeTab === 'shopping' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'shopping' ? colors.primary : colors.textSecondary }
          ]}>
            Einkaufen
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});
