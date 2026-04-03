import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import SettingScreen from './screens/SettingScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import HomeScreen from './screens/HomeScreen';

import { RootStackParamList, MainTabParamList } from './type';
import { initDatabase } from './storage';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs({ route }: any) {
  const userEmail = route.params?.email || '';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{ email: userEmail }} />
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ email: userEmail }} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    const setupDB = async () => {
      try {
        await initDatabase();
        console.log("Database SQLite đã sẵn sàng!");
      } catch (error) {
        console.error("Lỗi khởi tạo Database:", error);
        Alert.alert("Lỗi", "Không thể khởi tạo hệ thống lưu trữ dữ liệu.");
      }
    };

    setupDB();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}