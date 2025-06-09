import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import api from '../services/api';
import { API_KEY } from '@env';

const SearchBar = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/150?text=No+Image';

  const initialSuggestions = [
    { id: 1, title: "Noodles", image: "https://spoonacular.com/recipeImages/123-312x231.jpg" },
    { id: 2, title: "Pasta", image: "https://spoonacular.com/recipeImages/456-312x231.jpg" }
  ];

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length > 1) {
        buscarReceitas();
      } else {
        setResultados(initialSuggestions);
      }
    }, 600);

    return () => clearTimeout(delay);
  }, [query]);

  async function buscarReceitas() {
    setLoading(true);
    Keyboard.dismiss();
    
    try {
      const response = await api.get('/recipes/complexSearch', {
        params: {
          apiKey: API_KEY,
          query: query,
          number: 5,
          language:'pt'
        },
      });
      setResultados(response.data.results.length > 0 
        ? response.data.results 
        : initialSuggestions);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
      setResultados(initialSuggestions);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Digite uma receita..."
        placeholderTextColor="#888"
        value={query}
        onChangeText={setQuery}
        onFocus={() => setShowSuggestions(true)}
      />
      
      {loading ? (
  <ActivityIndicator style={styles.loader} size="large" color="#6200ee" />
) : showSuggestions && query.length > 1 && resultados.length > 0 ? ( // Alterado aqui
  <View style={styles.resultsContainer}>
    <FlatList
      data={resultados}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.resultItem}
          onPress={() => {
            navigation.navigate('RecipeDetails', { id: item.id });
            setShowSuggestions(false);
          }}
        >
          <Image 
            source={{ uri: item.image || PLACEHOLDER_IMAGE }} 
            style={styles.itemImage}
          />
          <Text style={styles.itemTitle}>{item.title}</Text>
        </TouchableOpacity>
      )}
      ListHeaderComponent={
        <Text style={styles.sectionTitle}>Resultados</Text> // Removida a condição
      }
      nestedScrollEnabled={true}
    />
  </View>
) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    zIndex: 1,
  },
  searchInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsContainer: {
    maxHeight: 300,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 10,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
  },
  itemTitle: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
    fontSize: 14,
  },
  loader: {
    paddingVertical: 20,
  },
});

export default SearchBar;