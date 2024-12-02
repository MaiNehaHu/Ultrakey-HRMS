import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { router, Stack, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { PunchProvider } from "@/contexts/Punch";
import { LeavesProvider } from "@/contexts/Leaves";
import { ProfileDetailsProvider } from "@/contexts/ProfileDetails";
import { LoginProvider, useLogin } from "@/contexts/Login";
import { AppThemeProvider, useAppTheme } from "@/contexts/AppTheme";
import { RegularizationProvider } from "@/contexts/RegularizationRequest";
import { TasksProvider } from "@/contexts/Tasks";
import { Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native";
import { Text } from "react-native";
import Colors from "@/constants/Colors";

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
  return (
    <AppThemeProvider>
      <LoginProvider>
        <PunchProvider>
          <LeavesProvider>
            <RegularizationProvider>
              <TasksProvider>
                    <ProfileDetailsProvider>
                      <RootLayoutNav />
                    </ProfileDetailsProvider>
              </TasksProvider>
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
  const { darkTheme } = useAppTheme();

  const [loading, setLoading] = useState(true);
  const textColor = Colors[darkTheme ? "dark" : "light"].text;

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

  const headerRightTitle = (name: string) => (
    <SafeAreaView style={{ width: "70%" }}>
      <Text
        style={{
          color: textColor,
          fontSize: 18,
          fontWeight: 500,
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {name}
      </Text>
    </SafeAreaView>
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
        headerStyle: {
          backgroundColor: Colors[darkTheme ? "dark" : "light"].background,
        },
        headerShown: true,
        headerTitleStyle: {},
        headerBackVisible: true,
        headerTintColor: textColor,
        animation: "ios_from_right",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="forgotPassword" options={{ headerShown: false }} />
      <Stack.Screen
        name="morePage"
        options={{
          headerLeft: imageHeaderLeft,
          headerRight,
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="profileDetails"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight,
          headerLeft: () => headerRightTitle("Profile Details"),
        }}
      />
      <Stack.Screen
        name="bankDetails"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight,
          headerLeft: () => headerRightTitle("Bank Details"),
        }}
      />
      <Stack.Screen
        name="paySlips"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight,
          headerLeft: () => headerRightTitle("Pay Slips"),
        }}
      />
      <Stack.Screen
        name="holidaysList"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight,
          headerLeft: () => headerRightTitle("All Holidays"),
        }}
      />
      <Stack.Screen
        name="applyRegularization"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight,
          headerLeft: () => headerRightTitle("Apply Regularizationnnnnn"),
        }}
      />
      <Stack.Screen
        name="regularizationsPage"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight,
          headerLeft: () => headerRightTitle("Regularizations"),
        }}
      />
      <Stack.Screen
        name="applyLeave"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight,
          headerLeft: () => headerRightTitle("Apply Leave"),
        }}
      />
      <Stack.Screen
        name="addTask"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight,
          headerLeft: () => headerRightTitle("Add New Task"),
        }}
      />
      <Stack.Screen
        name="editTask"
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight,
          headerLeft: () => headerRightTitle("Edit Task"),
        }}
      />
    </Stack>
  );
}
