import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native';
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
  const recommendedRecipes = [
    { id: '1', title: 'Noodles', image: require('./assets/noodles.png') },
    { id: '2', title: 'Pasta', image: require('./assets/pasta.png') },
    { id: '3', title: 'Noodles', image: require('./assets/noodles.png') },
    { id: '4', title: 'Noodles', image: require('./assets/noodles.png') },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={recommendedRecipes}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <Header />
            <SearchBar />
            <Text style={styles.sectionTitle}>Recomendado</Text>
          </>
        }
        renderItem={({ item }) => (
          <RecipeCard title={item.title} image={item.image} />
        )}
        numColumns={2}
        columnWrapperStyle={styles.grid}
        contentContainerStyle={styles.scrollContainer}
      />
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
