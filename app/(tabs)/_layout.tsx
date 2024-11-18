import React from "react";
import { router, Tabs } from "expo-router";
import { View, TouchableOpacity, Image, Text, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AwesomeIcon from "react-native-vector-icons/FontAwesome6";

import Colors from "@/constants/Colors";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

import { useAppTheme } from "@/contexts/AppTheme";
import { SafeAreaView } from "react-native";

function AwesomeIcons(props: {
  name: React.ComponentProps<typeof AwesomeIcon>["name"];
  color: string;
  size: number;
}) {
  return <AwesomeIcon {...props} />; // Use AwesomeIcon
}

export default function TabLayout() {
  // const navigation =
  //   useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { darkTheme, setDarkTheme } = useAppTheme();

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[!darkTheme ? "dark" : "light"].text,
        tabBarStyle: {
          backgroundColor: Colors[!darkTheme ? "dark" : "light"].background,
          paddingBottom: 5,
          // paddingTop: 5,
        },
        headerShown: useClientOnlyValue(false, true),
        headerTitleStyle: {
          display: "none",
        },
        headerStyle: {
          backgroundColor: Colors[darkTheme ? "dark" : "light"].background,
        },
        headerRight: () => (
          <TouchableOpacity onPress={toggleTheme}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name={darkTheme ? "moon" : "sunny"}
                size={20}
                color={Colors[darkTheme ? "dark" : "light"].text}
                style={{ margin: 15 }}
              />
            </View>
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <Pressable
            style={{
              gap: 10,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => {
              router.push("/morePage");
              // navigation.navigate("morePage");
            }}
          >
            <Image
              source={{
                uri: "https://i.pinimg.com/736x/e7/1e/ed/e71eed228bdb81e9b08fdf6b55c81191.jpg",
              }}
              style={{
                width: 40,
                minHeight: 40,
                marginLeft: 10,
                borderWidth: 2,
                borderRadius: 50,
                objectFit: "cover",
                borderColor: darkTheme ? Colors.white : Colors.light.border,
              }}
            />

            <SafeAreaView>
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: 17,
                  color: darkTheme ? Colors.white : Colors.darkBlue,
                }}
              >
                Neha Kumari
              </Text>
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: 11,
                  color: darkTheme ? Colors.white : "#666666",
                }}
              >
                Android Developer
              </Text>
            </SafeAreaView>
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          // tab bar icon using AwesomeIcon
          tabBarIcon: () => (
            <AwesomeIcons
              name="house"
              size={20}
              color={Colors[darkTheme ? "dark" : "light"].background}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="task"
        options={{
          title: "Tasks",
          // headerTitle: "Your Tasks",
          tabBarIcon: () => (
            <AwesomeIcons
              name="square-check"
              size={20}
              color={Colors[darkTheme ? "dark" : "light"].background}
            /> // Use AwesomeIcon
          ),
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: () => (
            <Ionicons
              name="calendar"
              size={20}
              color={Colors[darkTheme ? "dark" : "light"].background}
            /> // Use AwesomeIcon
          ),
        }}
      />

      <Tabs.Screen
        name="leaves"
        options={{
          title: "Leaves",
          // headerTitle: "Your Salary Details",
          tabBarIcon: () => (
            <AwesomeIcons
              name="mug-saucer"
              size={20}
              color={Colors[darkTheme ? "dark" : "light"].background}
            /> // Use AwesomeIcon
          ),
        }}
      />
    </Tabs>
  );
}
