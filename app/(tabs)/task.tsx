import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useRef } from "react";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";
import { Animated } from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const tasks = [
  {
    task: 1,
    assignee: "",
    assigner: "",
    name: "Ultrakey HRMS",
    description: "Create HRMS App for Ulytrakey IT Solutions.",
    deadline: "",
  },
  {
    task: 2,
    assignee: "",
    assigner: "",
    name: "Trending News Guru App",
    description: "Create Trending News Guru App for Ulytrakey IT Solutions.",
    deadline: "",
  },
];

const task = () => {
  const { darkTheme } = useAppTheme();
  const navigation = useNavigation();

  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const oppBgColor = Colors[!darkTheme ? "dark" : "light"].background;
  const textColor = Colors[darkTheme ? "dark" : "light"].text;
  const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => {
              /* Your action to add a task */
            }}
            style={[
              styles.addTask,
              { backgroundColor: oppBgColor, marginRight: 20 },
            ]}
          >
            <Ionicons name="add" size={24} color={oppTextColor} />
          </Pressable>
        </Animated.View>
      ),
    });
  }, [navigation, textColor]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: bgColor, padding: 15 }}
    ></ScrollView>
  );
};

export default task;

const styles = StyleSheet.create({
  addTask: {
    borderRadius: 30,
    padding: 5,
  },
});
