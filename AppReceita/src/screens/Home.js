import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const navigation = useNavigation();
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingStock, setUsingStock] = useState(false);

  // Receitas padrão para fallback
  const defaultRecipes = [
    { id: 1, title: "Macarrão", image: "https://spoonacular.com/recipeImages/716429-556x370.jpg" },
    { id: 2, title: "Pizza", image: "https://spoonacular.com/recipeImages/715538-556x370.jpg" },
    { id: 3, title: "Salada", image: "https://spoonacular.com/recipeImages/782601-556x370.jpg" },
    { id: 4, title: "Sopa", image: "https://spoonacular.com/recipeImages/631878-556x370.jpg" }
  ];

  // Buscar estoque do AsyncStorage
  const getEstoque = async () => {
    try {
      const estoqueData = await AsyncStorage.getItem('estoque');
      return estoqueData ? JSON.parse(estoqueData) : [];
    } catch (error) {
      console.error('Erro ao buscar estoque:', error);
      return [];
    }
  };

  // Buscar receitas baseadas no estoque
  const fetchRecipesFromStock = async () => {
    try {
      const estoque = await getEstoque();
      
      if (estoque.length === 0) {
        // Se estoque vazio, buscar receitas aleatórias
        fetchRandomRecipes();
        setUsingStock(false);
        return;
      }

      setUsingStock(true);
      
      // Extrair nomes dos ingredientes
      const ingredients = estoque.map(item => item.name).join(',');
      
      const response = await api.get('/recipes/findByIngredients', {
        params: {
          apiKey: API_KEY,
          ingredients: ingredients,
          number: 4,
          ranking: 1, // Maximiza o uso de ingredientes disponíveis
          ignorePantry: true,
          language: 'pt'
        }
      });
      
      if (response.data && response.data.length > 0) {
        setRecommendedRecipes(response.data.map(recipe => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          usedIngredients: recipe.usedIngredientCount,
          missedIngredients: recipe.missedIngredientCount
        })));
      } else {
        // Fallback se não encontrar receitas com estoque
        fetchRandomRecipes();
        setUsingStock(false);
      }
    } catch (error) {
      console.error('Erro ao buscar receitas por ingredientes:', error);
      fetchRandomRecipes();
      setUsingStock(false);
    } finally {
      setLoading(false);
    }
  };

  // Buscar receitas aleatórias
  const fetchRandomRecipes = async () => {
    try {
      const response = await api.get('/recipes/random', {
        params: {
          apiKey: API_KEY,
          number: 4,
          tags: 'main course',
          language: 'pt'
        }
      });
      
      if (response.data && response.data.recipes) {
        setRecommendedRecipes(response.data.recipes);
      } else {
        setRecommendedRecipes(defaultRecipes);
      }
    } catch (error) {
      console.error('Erro ao buscar receitas aleatórias:', error);
      setRecommendedRecipes(defaultRecipes);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Tentar buscar receitas baseadas no estoque primeiro
    fetchRecipesFromStock();
    
    // Atualizar quando voltar para a tela inicial
    const unsubscribe = navigation.addListener('focus', () => {
      fetchRecipesFromStock();
    });
    
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <SearchBar navigation={navigation} />
          
          <View style={styles.headerContainer}>
            <Text style={styles.sectionTitle}>Recomendado</Text>
            {usingStock && (
              <Text style={styles.subtitle}>
                Baseado no seu estoque 🥬
              </Text>
            )}
          </View>
          
          <View style={styles.recommendedContainer}>
            {recommendedRecipes.map(recipe => (
              <RecipeCard 
                key={recipe.id}
                title={recipe.title}
                image={recipe.image}
                onPress={() => navigation.navigate('RecipeDetails', { 
                  id: recipe.id,
                  title: recipe.title
                })}
                badge={usingStock ? `${recipe.usedIngredients || 0}/${(recipe.usedIngredients || 0) + (recipe.missedIngredients || 0)}` : null}
              />
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#419F7D',
    marginTop: 4,
    fontWeight: '500',
  },
  recommendedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});