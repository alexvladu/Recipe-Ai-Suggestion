import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { View, StyleSheet, TextInput, ActivityIndicator, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import Recipes from '../components/Recipes';
import { fetchGroqResponse } from '@/services/groqApi';
import { fetchUnsplashResponse } from '@/services/unsplashApi';
import { useFavoriteRecipes } from '../context/FavoriteRecipesContext';

interface Recipe {
  id: string;
  title: string;
  cookingTime: string;
  imageURL?: string;
  ingredients?: string;
  instructions?: string;
}

export default function IndexView() {
  const [history, setHistory] = React.useState<string>('');
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isFavorite, setIsFavorite] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [queryNumber, setQueryNumber] = React.useState(0);
  const { favoriteRecipes, toggleFavorite } = useFavoriteRecipes();

  const processRecipeResponses = (aiResponse: any[], photoResponse: any) => {
    const newRecipes: Recipe[] = [];
    for (let i = 0; i < 5; i++) {
      const recipe = aiResponse[i];
      let photo = '';
      if (i < photoResponse.total) {
        photo = photoResponse.results[i].urls.small || '';
      }
      const recipeWithPhoto: Recipe = {
        id: uuidv4(),
        title: recipe.title,
        cookingTime: recipe.cookingTime,
        imageURL: photo,
        ingredients: recipe.ingredients || '',
        instructions: recipe.instructions || '',
      };
      newRecipes.push(recipeWithPhoto);
      setHistory((prev) => prev + recipeWithPhoto.title + ',');
    }
    setRecipes(newRecipes);
    setHistory((prev) => prev.slice(0, -1));
    setQueryNumber((prev) => prev + 1);
  };

  const handleSearch = async () => {
    if (searchQuery.length < 2) {
      setIsFavorite(true);
      return;
    }
    setIsFavorite(false);
    const query =
      'Da-mi doar json object sa inceapa cu [ si sa se termine cu ]\n' +
      'fara alte informatii aditionale. Trebuie sa le afisez pe un web-site.\n' +
      'Da-mi orice gasesti in legatura cu subiectul\n' +
      'Eu o sa iti dau un tip de mancare/ceva ce are legatura cu mancarea\n' +
      'tu va trebui sa imi dai inapoi top 5 cele mai bune macaruri in urmatorul format: ' +
      'title, cookingTime.Textul meu care se refera la mancare este:' +
      searchQuery +
      '\n' +
      'FARA URMATOARELE INFORMATII ' +
      JSON.stringify(history) +
      ' ca si title!';
    setIsLoading(true);
    const aiResponse = await fetchGroqResponse(query);
    const photoResponse = await fetchUnsplashResponse(searchQuery, queryNumber + 1);
    processRecipeResponses(aiResponse, photoResponse);
    setIsLoading(false);
  };

  const navigateToRecipe = (recipe: Recipe) => {
    router.push({
      pathname: '/view-recipes',
      params: { recipe: JSON.stringify(recipe) },
    });
  };

  const displayedRecipes = isFavorite ? favoriteRecipes : recipes;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Caută mâncare..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          onSubmitEditing={handleSearch}
        />
        <View style={{ flex: 1, width: '100%' }}>
          {isFavorite && favoriteRecipes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nicio rețetă favorită salvată.</Text>
            </View>
          ) : isLoading ? (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="large" color="#FF6347" />
            </View>
          ) : (
            <View style={{ flex: 1, width: '100%' }}>
              <Text style={styles.favText}>
                {isFavorite ? 'Favorites' : 'Suggested recipes'}
              </Text>
              <Recipes
                recipes={displayedRecipes}
                onRecipePress={navigateToRecipe}
                onToggleFavorite={toggleFavorite}
                favoriteRecipes={favoriteRecipes}
              />
              {!isFavorite && !isLoading && (
                <View style={styles.buttonContainer}>
                  <Button title="I don't like this" onPress={handleSearch} color="#FF6347" />
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    width: 400,
    height: 650,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    width: '90%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  favText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
    paddingLeft: 16,
  },
  buttonContainer: {
    marginTop: 16,
    width: '90%',
  },
});