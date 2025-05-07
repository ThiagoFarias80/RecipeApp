// src/components/Header.js

import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Header() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá Geo</Text>
        <Text style={styles.subtitle}>O que deseja comer hoje?</Text>
      </View>
      <Feather name="box" size={28} color="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
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
