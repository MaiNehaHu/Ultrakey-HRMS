import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";

export default function TabOneScreen() {
  const { darkTheme } = useAppTheme();
  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const textColor = Colors[darkTheme ? "dark" : "light"].text;

  // State to store the current time
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update the time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  let hour = currentTime.getHours();
  // Convert 24-hour time to 12-hour time
  hour = hour % 12 || 12;

  const minute = currentTime.getMinutes().toString().padStart(2, "0");
  const second = currentTime.getSeconds().toString().padStart(2, "0");

  const ampm = hour >= 12 ? "PM" : "AM";

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={{ color: textColor, fontSize: 20, fontWeight: "500" }}>
        {hour < 12 && ampm == "AM"
          ? "Good Morning, Name"
          : (hour <= 5 || hour == 12) && ampm == "PM"
          ? "Good Afternoon, Name"
          : "Good Evening, Name"}
      </Text>

      <Text style={{ color: textColor }}>
        {`${hour < 10 ? `0${hour}` : hour}:${minute}:${second} ${ampm}`}
      </Text>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    padding: 15,
    flexDirection: "column",
  },
});
