import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../styles/commonStyles';
import BottomTabNavigator from '../components/BottomTabNavigator';

export default function MainScreen() {
  console.log('MainScreen rendered');
  
  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={{ flex: 1 }}>
        <BottomTabNavigator />
      </View>
    </SafeAreaView>
  );
}
