import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const tabs = [
    { name: '1_home', icon: 'home', title: 'Home' },        // Changed from 'home' to 'index'
    { name: '3_history', icon: 'history', title: 'History' }, 
    { name: '2_add', icon: 'add-circle', title: 'Add Log' },  
    { name: '4_profile', icon: 'person', title: 'Profile' },  
] as const;

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E1E1E', 
          borderTopColor: '#333',
          paddingBottom: 5,
          height: 70, 
        },
        tabBarActiveTintColor: '#FACC15', 
        tabBarInactiveTintColor: '#94a3b8', 
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen 
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name={tab.icon as any} size={28} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

export default DashboardLayout;