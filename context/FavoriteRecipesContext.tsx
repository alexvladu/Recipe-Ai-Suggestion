import * as React from 'react';

interface Recipe {
  id: string;
  title: string;
  cookingTime: string;
  imageURL?: string;
}

interface FavoriteRecipesContextType {
  favoriteRecipes: Recipe[];
  toggleFavorite: (recipe: Recipe) => void;
}

const FavoriteRecipesContext = React.createContext<FavoriteRecipesContextType | undefined>(undefined);

export const FavoriteRecipesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteRecipes, setFavoriteRecipes] = React.useState<Recipe[]>([]);

  const toggleFavorite = (recipe: Recipe) => {
    setFavoriteRecipes((prev) => {
      const exists = prev.some((r) => r.id === recipe.id);
      console.log('Toggling favorite:', recipe.title, 'Exists:', exists);
      if (exists) {
        return prev.filter((r) => r.id !== recipe.id);
      } else {
        return [...prev, recipe];
      }
    });
  };


  return (
    <FavoriteRecipesContext.Provider value={{ favoriteRecipes, toggleFavorite }}>
      {children}
    </FavoriteRecipesContext.Provider>
  );
};

export const useFavoriteRecipes = () => {
  const context = React.useContext(FavoriteRecipesContext);
  if (!context) {
    throw new Error('useFavoriteRecipes must be used within a FavoriteRecipesProvider');
  }
  return context;
};