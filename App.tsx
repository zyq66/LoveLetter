// App.tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './src/store/AuthContext';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { CoupleCodeScreen } from './src/screens/auth/CoupleCodeScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { BottomTabBar } from './src/components/BottomTabBar';
import { colors } from './src/theme';

// Placeholder screens for later tasks
function AlbumScreen() { return <View style={{ flex: 1, backgroundColor: colors.bg }} />; }
function LetterScreen() { return <View style={{ flex: 1, backgroundColor: colors.bg }} />; }
function MapScreen() { return <View style={{ flex: 1, backgroundColor: colors.bg }} />; }
function MoreScreen() { return <View style={{ flex: 1, backgroundColor: colors.bg }} />; }

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Album" component={AlbumScreen} />
      <Tab.Screen name="Letter" component={LetterScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { userId, loading } = useAuth();

  return (
    <NavigationContainer>
      {loading ? (
        <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={colors.green} size="large" />
        </View>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {userId ? (
            <Stack.Screen name="Main" component={MainTabs} />
          ) : (
            <>
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="CoupleCode" component={CoupleCodeScreen} />
            </>
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
