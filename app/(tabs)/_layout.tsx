import React from "react";
import { Tabs } from "expo-router";
import { View, TouchableOpacity, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AwesomeIcon from "react-native-vector-icons/FontAwesome6";

import Colors from "@/constants/Colors";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

import { useAppTheme } from "@/contexts/AppTheme";
const logo_light = require("@/assets/images/logo_light.jpg");
const logo_dark = require("@/assets/images/logo_dark.jpg");

function AwesomeIcons(props: {
  name: React.ComponentProps<typeof AwesomeIcon>["name"];
  color: string;
  size: number;
}) {
  return <AwesomeIcon {...props} />; // Use AwesomeIcon
}

function IoniconsIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  size: number;
}) {
  return <Ionicons {...props} />; // Use Ionicons
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

          // tab bar icon using AwesomeIcon
          tabBarIcon: () => (
            <AwesomeIcons
              name="house"
              size={20}
              color={Colors[darkTheme ? "dark" : "light"].background}
            /> // Use "house" icon from FontAwesome6
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
        name="task"
        options={{
          title: "Tasks",
          headerTitle: "Your Tasks",
          tabBarIcon: () => (
            <AwesomeIcons
              name="square-check"
              size={20}
              color={Colors[darkTheme ? "dark" : "light"].background}
            /> // Use AwesomeIcon
          ),

          // color of title in tab bar
          tabBarLabelStyle: {
            color: Colors[darkTheme ? "dark" : "light"].background,
          },

          // header tint
          headerTintColor: Colors[darkTheme ? "dark" : "light"].tint,
        }}
      />

      <Tabs.Screen
        name="salary"
        options={{
          title: "Salary",
          tabBarIcon: () => (
            <AwesomeIcons
              name="wallet"
              size={20}
              color={Colors[darkTheme ? "dark" : "light"].background}
            /> // Use AwesomeIcon
          ),

          // color of title in tab bar
          tabBarLabelStyle: {
            color: Colors[darkTheme ? "dark" : "light"].background,
          },

           // header tint
           headerTintColor: Colors[darkTheme ? "dark" : "light"].tint,
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: () => (
            <AwesomeIcons
              name="calendar-alt"
              size={20}
              color={Colors[darkTheme ? "dark" : "light"].background}
            /> // Use AwesomeIcon
          ),

          // color of title in tab bar
          tabBarLabelStyle: {
            color: Colors[darkTheme ? "dark" : "light"].background,
          },

          // header tint
          headerTintColor: Colors[darkTheme ? "dark" : "light"].tint,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "You",
          headerTitle: "Your Profile",
          tabBarIcon: () => (
            <IoniconsIcon
              name="person"
              size={20}
              color={Colors[darkTheme ? "dark" : "light"].background}
            /> // Use AwesomeIcon
          ),

          // color of title in tab bar
          tabBarLabelStyle: {
            color: Colors[darkTheme ? "dark" : "light"].background,
          },

          // header tint
          headerTintColor: Colors[darkTheme ? "dark" : "light"].tint,
        }}
      />
    </Tabs>
  );
}
