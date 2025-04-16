import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import api from './src/services/api'
import { API_KEY } from '@env';

export default function App() {

  async function consulta() {
    
    try {
      const response = await api.get('/recipes/complexSearch', {
        params: {
          apiKey: API_KEY, // Chave da API
          number: 5 // Número de receitas que você quer buscar, por exemplo
        }
      });
  
      console.log('Resposta da API:', response.data); // Log no console
    } catch (error) {
      console.error('Erro ao buscar receitas:', error); // Log de erro, se ocorrer
    }
  }


  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={consulta}
      >
        <Text> Teste </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
