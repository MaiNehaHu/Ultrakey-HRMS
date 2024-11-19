import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import { AppThemeProvider, useAppTheme } from "@/contexts/AppTheme";
import { PunchProvider } from "@/contexts/Punch";
import { LeavesProvider } from "@/contexts/Leaves";
import { LoginProvider, useLogin } from "@/contexts/Login";
import { RegularizationProvider } from "@/contexts/RegularizationRequest";
import { Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native";
import { Text } from "react-native";
import Colors from "@/constants/Colors";
import { FontAwesome6 } from "@expo/vector-icons";

const darkLogo = require("@/assets/images/logo_dark.jpg");
const lightLogo = require("@/assets/images/logo_light.png");

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
            <RegularizationProvider>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <RootLayoutNav />
              </ThemeProvider>
            </RegularizationProvider>
          </LeavesProvider>
        </PunchProvider>
      </LoginProvider>
    </AppThemeProvider>
  );
}

function RootLayoutNav() {
  const { isLogged } = useLogin();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { darkTheme } = useAppTheme();

  useEffect(() => {
    if (isLogged !== null) {
      setLoading(false);
      if (isLogged) {
        router.push({ pathname: "/(tabs)" });
      } else {
        router.push({ pathname: "/login" });
      }
    }
  }, [isLogged]);

  if (loading) {
    SplashScreen.preventAutoHideAsync();
  }

  // Custom headerRight function
  const headerRight = () => (
    <SafeAreaView>
      <Image
        source={darkTheme ? darkLogo : lightLogo}
        style={{
          width: 100,
          height: 40,
          objectFit: "contain",
        }}
      />
    </SafeAreaView>
  );

  // Left header
  const headerLeft = (name: string) => (
    <Pressable
      style={{
        gap: 10,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      }}
      onPress={() => {
        navigation.goBack();
      }}
    >
      <FontAwesome6
        size={20}
        name="arrow-left"
        style={{ color: Colors[darkTheme ? "dark" : "light"].text }}
      />
      <Text
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: Colors[darkTheme ? "dark" : "light"].text,
        }}
      >
        {name}
      </Text>
    </Pressable>
  );

  // Custom headerLeft with image function
  const imageHeaderLeft = () => (
    <Pressable
      style={{
        gap: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={() => {
        navigation.goBack();
      }}
    >
      <Text>
        <FontAwesome6
          name="arrow-left"
          size={20}
          style={{
            color: Colors[!darkTheme ? "dark" : "light"].background,
          }}
        />
      </Text>
      <Image
        source={{
          uri: "https://i.pinimg.com/736x/e7/1e/ed/e71eed228bdb81e9b08fdf6b55c81191.jpg",
        }}
        style={{
          width: 40,
          minHeight: 40,
          borderWidth: 2,
          borderRadius: 50,
          objectFit: "cover",
          borderColor: darkTheme ? Colors.white : Colors.light.border,
        }}
      />
    </Pressable>
  );

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors[darkTheme ? "dark" : "light"].background,
        },
        animation: "ios_from_right",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="forgotPassword" options={{ headerShown: false }} />
      <Stack.Screen
        name="morePage"
        options={{ headerLeft: imageHeaderLeft, headerRight, headerTitle: "" }}
      />
      <Stack.Screen
        name="profileDetails"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight,
          headerLeft: () => headerLeft("Profile Details"),
        }}
      />
      <Stack.Screen
        name="bankDetails"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight,
          headerLeft: () => headerLeft("Bank Details"),
        }}
      />
      <Stack.Screen
        name="paySlips"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight,
          headerLeft: () => headerLeft("Pay Slips"),
        }}
      />
      <Stack.Screen
        name="holidaysList"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight,
          headerLeft: () => headerLeft("All Holidays"),
        }}
      />
      <Stack.Screen
        name="applyRegularization"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight,
          headerLeft: () => headerLeft("Apply Regularization"),
        }}
      />
      <Stack.Screen
        name="applyLeave"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight,
          headerLeft: () => headerLeft("Apply Leave"),
        }}
      />
      <Stack.Screen
        name="addTask"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight,
          headerLeft: () => headerLeft("Add New Task"),
        }}
      />
      <Stack.Screen
        name="regularizationsPage"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight,
          headerLeft: () => headerLeft("Regularizations"),
        }}
      />
    </Stack>
  );
}
