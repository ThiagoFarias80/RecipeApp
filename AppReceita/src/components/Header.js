import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá Geo</Text>
        <Text style={styles.subtitle}>O que deseja comer hoje?</Text>
      </View>

      {/* Ícone da caixa como botão */}
      <TouchableOpacity onPress={() => navigation.navigate('Estoque')}>
        <Feather name="box" size={28} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16, // Adicione padding lateral
    paddingTop: 50, // Espaço no topo
    paddingBottom: 25, // Mantém espaço inferior
  },

  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#636e72',
    marginTop: 4,
  },
});