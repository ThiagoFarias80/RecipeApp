// src/components/RecipeDetails.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { API_KEY } from '@env';

const RecipeDetails = ({ route }) => {
  const { id } = route.params; // Pegando o id da receita da navegação
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const response = await api.get(`/recipes/${id}/information`, {
          params: {
            apiKey: API_KEY,
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
    return <ActivityIndicator size="large" color="#6200ee" />;
  }

  return (
    <View style={styles.container}>
      {recipe && (
        <>
          <Image source={{ uri: recipe.image }} style={styles.image} />
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.instructions}>{recipe.instructions}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default RecipeDetails;
