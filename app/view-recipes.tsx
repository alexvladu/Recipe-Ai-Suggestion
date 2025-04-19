import * as React from 'react';
import { fetchGroqResponse } from '@/services/groqApi';
import { ActivityIndicator } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useFavoriteRecipes } from '../context/FavoriteRecipesContext';
import { parse } from '@babel/core';

interface Recipe {
  id: string;
  title: string;
  cookingTime: string;
  imageURL?: string;
  ingredients: string[];
  instructions: string[];
}
interface Ingredient {
  name: string;
  quantity: string;
}

export default function RecipesView() {
  const { recipe: recipeParam } = useLocalSearchParams();
  const recipe: Recipe = JSON.parse(recipeParam as string);
  const { favoriteRecipes, toggleFavorite } = useFavoriteRecipes();
  const [loading, setLoading] = React.useState<boolean>(true);
  const { width } = useWindowDimensions();
  const [liked, setLiked] = React.useState(
    favoriteRecipes.some((r) => r.id === recipe.id)
  );

  React.useEffect(() => {
    const isLiked = favoriteRecipes.some((r) => r.id === recipe.id);
    setLiked(isLiked);
  }, [favoriteRecipes]);

  const handleLike = () => {
    toggleFavorite(recipe);
  };

  const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);
  const [steps, setSteps] = React.useState<string[]>([]);
  const parseIngredients = (response:any) =>{
    const builtIngredients: Ingredient[] = [];
    for (let i = 0; i < response.length; i++) {
      const item = response[i];
      console.log(item);
      if (item.ingredient && item.gramaj) {
        const ingredient: Ingredient = {
          name: item.ingredient,
          quantity: item.gramaj,
        };
        builtIngredients.push(ingredient);
      }
    }
    setIngredients(builtIngredients);
  }
  const parseSteps = (response:any) =>{
    const buildSteps:string[] =[]
    for(let i=0; i<response.length; i++){
      const item=response[i];
      buildSteps.push(item.descriere);
    }
    setSteps(buildSteps);
  }
  const queryIngredients="Da-mi te rog lista de ingrediente urmatoarea reteta:"+recipe.title+"\n"+
            "Datele vreau sa fie legate doar de ingrediente si vreau sa fie date in format JSON. Nu ma intereseaza alte detalii\n"+
            "Obligatoriu sa inceapa cu [ si sa se termine cu ]. Ma intereseaza ingredient, respectiv gramaj.";

  React.useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetchGroqResponse(queryIngredients);
        const querySteps="Da-mi te rog lista de pasi pentru urmatoare reteta:"+ recipe.title+"\n"+
              "Folosesc urmatoarele ingrediente:" + JSON.stringify(res) + ". As prefera sa-mi dai pasii expliciti"+
              " pentru a putea prepara " + recipe.title + ".Datele vreau sa fie legate doar de modul de preparare"+
              " si vreau sa fie date in format JSON. Nu ma intereseaza alte detalii\n"+
              "Obligatoriu sa inceapa cu [ si sa se termine cu ]."+"De preferat intre 5-10 pasi de preparare explicati"+
              " in detali. Un pas as vrea sa aiba intre 50-100 cuvinte. ATENTIE VREAU JSON CUM AM ZIS."+
              " este un pas vital! Format: {id, descriere}";
        parseIngredients(res);
        const resSteps = await fetchGroqResponse(querySteps);
        parseSteps(resSteps);
      } catch (error) {
        console.error('Eroare la fetch:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchIngredients();
  }, [queryIngredients]);

  const isSmallScreen = width < 600;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4D4D" />
        <Text style={styles.loadingText}>Loading recipe details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.page}>
      <View style={[styles.container, isSmallScreen && styles.containerVertical]}>
        <View style={styles.imageSection}>
          {recipe.imageURL ? (
            <Image source={{ uri: recipe.imageURL }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.cookingTimeText}>{recipe.cookingTime}</Text>
          <TouchableOpacity
            style={[styles.likeButton, liked && styles.likedButton]}
            onPress={handleLike}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={24}
              color={liked ? '#FF4D4D' : '#666'}
            />
            <Text style={[styles.likeText, liked && styles.likedText]}>
              {liked ? 'Liked' : 'Like'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.detailsSection, isSmallScreen && styles.detailsSectionSmall]}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.text}>
              • {ingredient.name} – {ingredient.quantity}
            </Text>
          ))}
          <Text style={styles.sectionTitle}>Instructions</Text>
          {steps.map((step, index) => (
            <Text key={index} style={styles.text}>
              {index}. {step} 
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    flexDirection: 'row',
    width: '95%', // Increased width to reduce side gaps
    alignSelf: 'center',
    padding: 10, // Reduced padding for smaller screens
    gap: 10, // Reduced gap between sections
    flexWrap: 'wrap',
  },
  containerVertical: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%', // Ensure full width on small screens
    paddingHorizontal: 10, // Add minimal horizontal padding
  },
  imageSection: {
    flex: 1,
    alignItems: 'center',
    minWidth: 200, // Reduced minWidth for better fit on small screens
    maxWidth: '100%', // Prevent overflow
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    resizeMode: 'cover', // Ensure image scales properly
  },
  placeholder: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4, // Added to reduce vertical spacing
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    marginTop: 8,
    gap: 6,
  },
  likedButton: {
    backgroundColor: '#FFE6E6',
  },
  likeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  likedText: {
    color: '#FF4D4D',
  },
  detailsSection: {
    flex: 2,
    paddingLeft: 10, 
    minWidth: 200, 
    flexShrink: 1,
    marginTop: 8,
  },
  detailsSectionSmall: {
    paddingLeft: 0, 
    marginTop: 10, 
    width: '100%', 
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginTop: 10,
    marginBottom: 5, // Added for better spacing
  },
  text: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 5, // Added for better spacing between items
  },
  cookingTimeText: {
    fontSize: 18, // Slightly reduced for better fit
    color: '#666',
    fontWeight: '600',
    marginVertical: 4, // Adjusted for tighter spacing
  },
  // Loading screen styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingText: {
    fontSize: 18,
    color: '#444',
    marginTop: 10,
  },
  // Error screen styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});