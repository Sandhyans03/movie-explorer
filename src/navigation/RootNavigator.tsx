import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { FavouriteButton } from '../components/FavouriteButton';
import { DetailsScreen } from '../screens/DetailsScreen';
import { FavouritesScreen } from '../screens/FavouritesScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { useFavourites } from '../store/favouritesStore';
import { colors } from '../utils/theme';
import type { RootStackParamList, TabParamList } from './types';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

// [focused, unfocused]
const TAB_ICONS: Record<keyof TabParamList, [IconName, IconName]> = {
  Home: ['film', 'film-outline'],
  Search: ['search', 'search-outline'],
  Favourites: ['heart', 'heart-outline'],
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.card,
    border: colors.border,
    text: colors.text,
    primary: colors.accent,
  },
};

function Tabs() {
  const favouriteCount = useFavourites((state) => state.order.length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={TAB_ICONS[route.name][focused ? 0 : 1]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Popular' }} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{ tabBarBadge: favouriteCount > 0 ? favouriteCount : undefined }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ route }) => ({
            title: route.params.movie.title,
            headerBackTitle: 'Back',
            headerRight: () => <FavouriteButton movie={route.params.movie} />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
