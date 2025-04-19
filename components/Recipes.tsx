import * as React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Recipe from './Recipe';

interface RecipeProps {
  id: string;
  title: string;
  cookingTime: string;
  imageURL?: string;
}

interface RecipesProps {
  recipes: RecipeProps[];
  favoriteRecipes: RecipeProps[];
  onRecipePress: (recipe: RecipeProps) => void;
  onToggleFavorite: (recipe: RecipeProps) => void;
}

export default function Recipes({
  recipes,
  favoriteRecipes,
  onRecipePress,
  onToggleFavorite,
}: RecipesProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Recipe
            {...item}
            isFavorite={favoriteRecipes.some((r) => r.id === item.id)}
            onPress={() => onRecipePress(item)}
            onToggleFavorite={() => onToggleFavorite(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    margin: 3,
  },
});
