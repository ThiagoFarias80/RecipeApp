import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackRoutes from './src/routes/StackRoutes';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <StackRoutes />
    </NavigationContainer>
  );
}