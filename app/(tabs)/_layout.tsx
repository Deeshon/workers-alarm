import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GlobalProvider } from "@/providers/GlobalProvider";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GlobalProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "black",
          headerShown: false,
          tabBarActiveBackgroundColor: "#121212",
          tabBarInactiveBackgroundColor: "#121212",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={"home"} color={focused ? "white" : "black"} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "code-slash" : "code-slash-outline"}
                color={focused ? "white" : "black"}
              />
            ),
          }}
        />
      </Tabs>
    </GlobalProvider>
  );
}
