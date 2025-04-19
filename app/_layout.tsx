import { Stack } from 'expo-router';
import { FavoriteRecipesProvider } from '../context/FavoriteRecipesContext';

export default function RootLayout() {
  return (
    <FavoriteRecipesProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="view-recipes" />
      </Stack>
    </FavoriteRecipesProvider>
  );
}