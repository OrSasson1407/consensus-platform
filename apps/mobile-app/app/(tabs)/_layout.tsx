import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: "#0f0f23", borderTopColor: "#1f1f3a" },
      tabBarActiveTintColor: "#a78bfa",
      tabBarInactiveTintColor: "#4b5563",
    }}>
      <Tabs.Screen name="explore" options={{ title: "Explore", tabBarIcon: () => null }} />
      <Tabs.Screen name="swipe" options={{ title: "Swipe", tabBarIcon: () => null }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: () => null }} />
    </Tabs>
  );
}