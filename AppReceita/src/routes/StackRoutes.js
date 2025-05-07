import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../../Home'; // cuidado: aqui o Home é o antigo App.js
import RecipeDetails from '../screens/RecipeDetails';

const Stack = createStackNavigator();

export default function StackRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="RecipeDetails" component={RecipeDetails} options={{ title: 'Detalhes da Receita' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
