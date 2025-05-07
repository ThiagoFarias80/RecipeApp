import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function RecipeCard({ title, image }) {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.details}>See Details</Text>
        <Feather name="arrow-right-circle" size={16} color="#00b894" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#f9f1e9',
    borderRadius: 16,
    padding: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  details: {
    marginRight: 5,
    color: '#636e72',
  },
});
