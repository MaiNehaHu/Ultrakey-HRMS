import React, { useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, Tabs } from "expo-router";
import { View, TouchableOpacity, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import Colors from "@/constants/Colors";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

import { useAppTheme } from "@/contexts/AppTheme";
import logo_light from "@/assets/images/logo_light.jpg";
import logo_dark from "@/assets/images/logo_dark.jpg";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} {...props} />;
}

export default function TabLayout() {
  const { darkTheme, setDarkTheme } = useAppTheme();

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[darkTheme ? "dark" : "light"].tint,
        tabBarStyle: {
          backgroundColor: Colors[!darkTheme ? "dark" : "light"].background,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerShown: useClientOnlyValue(false, true),
        headerStyle: {
          backgroundColor: Colors[darkTheme ? "dark" : "light"].background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "", // no title on header
          title: "Home", // title on tab bar

          // header
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              {/* logo for dark and light theme */}
              <Image
                source={darkTheme ? logo_dark : logo_light}
                style={{ width: 50, height: 50 }}
              />
            </View>
          ),

          // tab bar icon colors
          tabBarIcon: ({}) => (
            <TabBarIcon
              name="home"
              color={Colors[darkTheme ? "dark" : "light"].background}
            />
          ),

          tabBarActiveTintColor: Colors[darkTheme ? "dark" : "light"].text,

          // color of title in tab bar
          tabBarLabelStyle: {
            color: Colors[darkTheme ? "dark" : "light"].background,
          },

          // dark and light theme toggle button
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
        }}
      />

      <Tabs.Screen
        name="two"
        options={{
          title: "Tab Two",
          tabBarIcon: ({}) => (
            <TabBarIcon
              name="leaf"
              color={Colors[darkTheme ? "dark" : "light"].background}
            />
          ),

          // color of title in tab bar
          tabBarLabelStyle: {
            color: Colors[darkTheme ? "dark" : "light"].background,
          },
        }}
      />
    </Tabs>
  );
}
