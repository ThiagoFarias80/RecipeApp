import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Image, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import api from '../services/api';
import { API_KEY } from '@env';
import { useNavigation } from '@react-navigation/native';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length > 1) {
        buscarReceitas();
      } else {
        setResultados([]);
      }
    }, 600);

    return () => clearTimeout(delay);
  }, [query]);

  async function buscarReceitas() {
    setLoading(true);
    try {
      const response = await api.get('/recipes/complexSearch', {
        params: {
          apiKey: API_KEY,
          query: query,
          number: 10,
        },
      });
      setResultados(response.data.results);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Digite uma receita..."
        value={query}
        onChangeText={setQuery}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <FlatList
          data={resultados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('RecipeDetails', { id: item.id })}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 60,
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    flexShrink: 1,
  },
});

export default SearchBar;
