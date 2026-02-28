import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ChallengesScreen from "../screens/ChallengesScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import HeadToHeadScreen from "../screens/HeadToHeadScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CustomTabBar from "./CustomTabBar";

const Tab = createBottomTabNavigator();

const TABS = [
  { name: "Home", component: HomeScreen, label: "Ana Sayfa", icon: "🏠" },
  {
    name: "Challenges",
    component: ChallengesScreen,
    label: "Meydan",
    icon: "🏆",
  },
  {
    name: "Leaderboard",
    component: LeaderboardScreen,
    label: "Liderlik",
    icon: "🌍",
  },
  {
    name: "HeadToHead",
    component: HeadToHeadScreen,
    label: "Bire Bir",
    icon: "⚔️",
  },
  { name: "Profile", component: ProfileScreen, label: "Profil", icon: "👤" },
];

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      >
        {TABS.map((tab) => (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
