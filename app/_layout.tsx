import { Stack } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Rethink_Sans": require("../assets/fonts/RethinkSans-VariableFont_wght.ttf"),
    "Rethink_Sans_Bold": require("../assets/fonts/RethinkSans-Bold.ttf"),
    "Rethink_Sans_Medium": require("../assets/fonts/RethinkSans-Medium.ttf"),
    "Rethink_Sans_Semibold": require("../assets/fonts/RethinkSans-SemiBold.ttf"),
    "Rethink_Sans_ExtraBold": require("../assets/fonts/RethinkSans-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
