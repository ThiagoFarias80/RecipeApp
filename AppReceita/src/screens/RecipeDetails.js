import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  ScrollView,
  SafeAreaView,
  Dimensions
} from 'react-native';
import api from '../services/api';
import { API_KEY } from '@env';

const RecipeDetails = ({ route }) => {
  const { id } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get('window').width;
  const imageSize = screenWidth * 0.7;

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const response = await api.get(`/recipes/${id}/information`, {
          params: { 
            apiKey: API_KEY,
            includeNutrition: false,
            language: 'pt'
          },
        });
        setRecipe(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes da receita:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>Erro ao carregar os detalhes da receita.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fundo verde na parte superior */}
      <View style={styles.greenBackground} />
      
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Imagem circular centralizada sobre o fundo verde */}
        <View style={styles.imageOverlayContainer}>
          <Image 
            source={{ uri: recipe.image }} 
            style={[
              styles.circularImage,
              { width: imageSize, height: imageSize }
            ]} 
            resizeMode="cover"
          />
        </View>
        
        {/* Card branco com o conteúdo */}
        <View style={styles.contentCard}>
          <Text style={styles.title}>{recipe.title}</Text>
          
          {/* Informações rápidas (tempo e porções) */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tempo</Text>
              <Text style={styles.infoValue}>{recipe.readyInMinutes} min</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Porções</Text>
              <Text style={styles.infoValue}>{recipe.servings}</Text>
            </View>
          </View>
          
          {/* Lista de ingredientes */}
          <Text style={styles.sectionTitle}>Ingredientes</Text>
          <View style={styles.ingredientsContainer}>
            {recipe.extendedIngredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.ingredientText}>{ingredient.original}</Text>
              </View>
            ))}
          </View>
          
          {/* Modo de preparo */}
          <Text style={styles.sectionTitle}>Modo de Preparo</Text>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              {recipe.instructions || 'Nenhuma instrução disponível para esta receita.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  greenBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: '#419F7D',
    zIndex: 0,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageOverlayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    zIndex: 10,
  },
  circularImage: {
    borderRadius: 1000,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  contentCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: -30,
    padding: 25,
    paddingTop: 70,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#F4E4CD',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#339966',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#339966',
  },
  ingredientsContainer: {
    marginBottom: 30,
    backgroundColor: '#F4E4CD',
    borderRadius: 15,
    padding: 20,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#339966',
    marginTop: 8,
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
    flex: 1,
    color: '#333',
    lineHeight: 24,
  },
  instructionsContainer: {
    marginBottom: 30,
    backgroundColor: '#F4E4CD',
    borderRadius: 15,
    padding: 20,
  },
  instructionsText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});

export default RecipeDetails;