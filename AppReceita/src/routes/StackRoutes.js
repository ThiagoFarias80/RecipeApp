import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home'; // Corrija o caminho para o Home
import RecipeDetails from '../screens/RecipeDetails';
import EstoqueScreen from '../screens/Estoque'; // Corrija o nome do componente

const Stack = createStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecipeDetails"
        component={RecipeDetails}
        options={{ title: 'Detalhes da Receita' }}
      />
      <Stack.Screen
        name="Estoque"
        component={EstoqueScreen}
        options={{ title: 'Seu Estoque' }}
      />
    </Stack.Navigator>
  );
}