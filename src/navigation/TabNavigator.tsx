import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '@/screens/Home';
import LoyaltyCard from '@/screens/LoyaltyCard';
import Settings from '@/screens/Settings';
import { useTheme } from '@/theme';

// Importowanie ikon
import { IconByVariant } from '@/components/atoms';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { colors, gutters } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          height: 80,
          borderTopWidth: 0,
          backgroundColor: colors.gray50,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: Platform.OS === 'ios' ? 0 : 8,
        },
        tabBarActiveTintColor: colors.purple500,
        tabBarInactiveTintColor: colors.gray400,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <IconByVariant 
              path="home" 
              stroke={focused ? colors.purple500 : colors.gray400} 
            />
          ),
          tabBarLabel: 'Główna',
        }}
      />

      <Tab.Screen
        name="LoyaltyCard"
        component={LoyaltyCard}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.qrButtonContainer,
              { backgroundColor: focused ? colors.purple500 : colors.purple100 }
            ]}>
              <IconByVariant 
                path="qrcode" 
                stroke={colors.gray50} 
              />
            </View>
          ),
          tabBarLabel: 'Karta',
        }}
      />

      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ focused }) => (
            <IconByVariant 
              path="settings" 
              stroke={focused ? colors.purple500 : colors.gray400} 
            />
          ),
          tabBarLabel: 'Ustawienia',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  qrButtonContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default TabNavigator; 