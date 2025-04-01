import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabPaths } from './paths';
import { TabParamList } from './types';
import { Home, Profile } from '@/screens';
import { useTheme } from '@/theme';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const { variant } = useTheme();

  return (
    <Tab.Navigator
      key={variant}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen
        name={TabPaths.Home}
        component={Home}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12 }}>Główna</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name={TabPaths.Profile}
        component={Profile}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12 }}>Profil</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator; 