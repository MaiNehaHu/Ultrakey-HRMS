import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import { AppThemeProvider } from "@/contexts/AppTheme";
import { PunchProvider } from "@/contexts/Punch";
import { LeavesProvider } from "@/contexts/Leaves";
import { LoginProvider, useLogin } from "@/contexts/Login";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// AsyncStorage.clear()

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <Root />;
}

function Root() {
  const colorScheme = useColorScheme();

  return (
    <AppThemeProvider>
      <LoginProvider>
        <PunchProvider>
          <LeavesProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <RootLayoutNav />
            </ThemeProvider>
          </LeavesProvider>
        </PunchProvider>
      </LoginProvider>
    </AppThemeProvider>
  );
}

function RootLayoutNav() {
  const { isLogged } = useLogin();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLogged !== null) {
      setLoading(false);

      // setTimeout(() => {
        if (isLogged) {
          router.push({ pathname: "/(tabs)" });
        } else {
          router.push({ pathname: "/login" });
        }
      // }, 10);
    }
  }, [isLogged]);

  if (loading) {
    SplashScreen.preventAutoHideAsync(); 
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="applyLeave" options={{ headerShown: false }} />
      <Stack.Screen name="leaveDetails" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="loginValidation" options={{ headerShown: false }} />
      <Stack.Screen name="PunchDetails" options={{ headerShown: false }} />
      <Stack.Screen name="TaskDetails" options={{ headerShown: false }} />
    </Stack>
  );
}
