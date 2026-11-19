import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import MoveDetailsScreen from "./src/screens/MoveDetailsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F8F9FA" },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Profile" component={ProfileScreen} />

        <Stack.Screen name="MoveDetails" component={MoveDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
