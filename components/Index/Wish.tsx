import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/contexts/AppTheme";

export default function Wish({ currentTime }: { currentTime: Date }) {
  const { darkTheme } = useAppTheme();
  const textColor = Colors[darkTheme ? "dark" : "light"].text;

  let hour = currentTime.getHours();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return (
    <Text
      style={{
        color: textColor,
        fontSize: 20,
        fontWeight: "500",
      }}
    >
      {hour < 12 && ampm === "AM"
        ? "Good Morning :)"
        : (hour <= 4 || hour === 12) && ampm === "PM"
        ? "Good Afternoon :)"
        : "Good Evening :)"}
    </Text>
  );
}

const styles = StyleSheet.create({});
