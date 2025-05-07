import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import SearchBar from './src/components/SearchBar';
import Header from './src/components/Header';
import RecipeCard from './src/components/RecipeCard';
import { NavigationContainer } from '@react-navigation/native'; // Importando o NavigationContainer
import { createStackNavigator } from '@react-navigation/stack'; // Importando o createStackNavigator
import RecipeDetails from './src/components/RecipeDetails'; // Suponho que você já tenha criado o componente RecipeDetails

const Stack = createStackNavigator();

export default function Home() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RecipeDetails" component={RecipeDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header />
      <SearchBar /> {}
      <Text style={styles.sectionTitle}>Recomendado</Text>
      <View style={styles.grid}>
        <RecipeCard title="Noodles" image={require('./assets/noodles.png')} />
        <RecipeCard title="Pasta" image={require('./assets/pasta.png')} />
        <RecipeCard title="Noodles" image={require('./assets/noodles.png')} />
        <RecipeCard title="Noodles" image={require('./assets/noodles.png')} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  scrollContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
