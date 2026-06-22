import { Redirect } from "expo-router";
import { useAppStore } from "../src/store/appStore";
import OnboardingScreen from "../src/screens/OnboardingScreen";

export default function Index() {
  const user = useAppStore((s) => s.user);
  if (user) return <Redirect href="/(tabs)/explore" />;
  return <OnboardingScreen />;
}