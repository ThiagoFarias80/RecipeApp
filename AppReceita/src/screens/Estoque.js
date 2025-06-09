import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';
import { API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Estoque() {
  const [query, setQuery] = useState('');
  const [estoque, setEstoque] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const PLACEHOLDER_IMAGE = 'https://spoonacular.com/cdn/ingredients_100x100/apple.jpg';

  // Carregar estoque salvo ao iniciar
  useEffect(() => {
    const loadEstoque = async () => {
      try {
        const savedEstoque = await AsyncStorage.getItem('estoque');
        if (savedEstoque) {
          setEstoque(JSON.parse(savedEstoque));
        }
      } catch (e) {
        console.error('Erro ao carregar estoque:', e);
      }
    };

    loadEstoque();
  }, []);

  // Buscar sugestões de ingredientes
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length > 2) {
        buscarIngredientes();
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [query]);

  // Salvar estoque sempre que mudar
  useEffect(() => {
    const saveEstoque = async () => {
      try {
        await AsyncStorage.setItem('estoque', JSON.stringify(estoque));
      } catch (e) {
        console.error('Erro ao salvar estoque:', e);
      }
    };

    saveEstoque();
  }, [estoque]);

  async function buscarIngredientes() {
    setLoading(true);
    Keyboard.dismiss();
    
    try {
      const response = await api.get('/food/ingredients/autocomplete', {
        params: {
          apiKey: API_KEY,
          query: query,
          number: 5,
          metaInformation: true,
          language: 'pt'
        },
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error('Erro ao buscar ingredientes:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  const adicionarIngrediente = (ingrediente) => {
    // Verifica se o ingrediente já está no estoque
    if (!estoque.some(item => item.id === ingrediente.id)) {
      const novoIngrediente = {
        id: ingrediente.id,
        name: ingrediente.name,
        image: `https://spoonacular.com/cdn/ingredients_100x100/${ingrediente.image}` || PLACEHOLDER_IMAGE
      };
      
      setEstoque([...estoque, novoIngrediente]);
      setQuery('');
      setSuggestions([]);
    }
  };

  const removerIngrediente = (id) => {
    setEstoque(estoque.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Meu Estoque</Text>
        <Text style={styles.subtitle}>Gerencie seus ingredientes</Text>
      </View>

      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar ingredientes..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
        <Feather name="search" size={24} color="#888" style={styles.searchIcon} />
        
        {loading && <ActivityIndicator size="small" color="#6200ee" style={styles.loader} />}
      </View>

      {/* Sugestões de ingredientes */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.suggestionItem}
                onPress={() => adicionarIngrediente(item)}
              >
                <Image 
                  source={{ uri: `https://spoonacular.com/cdn/ingredients_100x100/${item.image}` || PLACEHOLDER_IMAGE }} 
                  style={styles.suggestionImage}
                />
                <Text style={styles.suggestionText}>{item.name}</Text>
                <MaterialIcons name="add-circle" size={24} color="#419F7D" />
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Lista de estoque */}
      <View style={styles.estoqueContainer}>
        <Text style={styles.sectionTitle}>
          {estoque.length > 0 ? 'Seus Ingredientes' : 'Adicione ingredientes ao seu estoque'}
        </Text>
        
        {estoque.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="box" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Seu estoque está vazio</Text>
            <Text style={styles.emptySubtext}>Busque e adicione ingredientes acima</Text>
          </View>
        ) : (
          <FlatList
            data={estoque}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <View style={styles.itemInfo}>
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.itemImage}
                    onError={(e) => {
                      // Fallback para imagem padrão em caso de erro
                      e.nativeEvent.source = { uri: PLACEHOLDER_IMAGE };
                    }}
                  />
                  <Text style={styles.itemText}>{item.name}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => removerIngrediente(item.id)}
                  style={styles.removeButton}
                >
                  <Feather name="trash-2" size={20} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    marginVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  searchInput: {
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 50,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    top: 13,
  },
  loader: {
    position: 'absolute',
    right: 15,
    top: 13,
  },
  suggestionsContainer: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  estoqueContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    padding: 8,
  },
});