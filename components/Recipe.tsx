import * as React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RecipeProps {
  id: string;
  title: string;
  cookingTime?: string;
  imageURL?: string;
  isFavorite?: boolean;
  onPress?: () => void;
  onToggleFavorite?: () => void;
}

export default function Recipe({
  title,
  cookingTime,
  imageURL,
  isFavorite = false,
  onPress,
  onToggleFavorite,
}: RecipeProps) {
  return (
    <Pressable style={styles.recipeItem} onPress={onPress}>
      <View style={styles.imageContainer}>
        {imageURL ? (
          <Image source={{ uri: imageURL }} style={styles.recipeImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={24} color="#ccc" />
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.recipeTitle}>{title}</Text>
        <Text style={styles.recipeInfo}>{cookingTime} min</Text>
      </View>
      <Pressable onPress={onToggleFavorite} style={styles.favoriteButton}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color={isFavorite ? '#FF4D4D' : '#666'}
        />
        
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recipeInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  favoriteButton: {
    padding: 8,
  },
});
