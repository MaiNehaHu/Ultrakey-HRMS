import React, { useState, useEffect } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";
import AwesomeIcon from "react-native-vector-icons/FontAwesome6";
import { usePunching } from "@/contexts/Punch";
import Sound from "react-native-sound";

export default function TabOneScreen() {
  const { darkTheme } = useAppTheme();
  const { punchedIn, setPunchedIn } = usePunching();
  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const oppBgColor = Colors[!darkTheme ? "dark" : "light"].background;
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
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  const minute = currentTime.getMinutes().toString().padStart(2, "0");
  const second = currentTime.getSeconds().toString().padStart(2, "0");

  function handlePunchClick() {
    setPunchedIn(!punchedIn);
  }

  function playSound() {
    // const sound = new Sound("", Sound.MAIN_BUNDLE, (error) => {
    //   if (error) {
    //     console.log("failed to load sound: ", error);
    //     return;
    //   }

    //   sound.play((success) => {
    //     if (success) {
    //       console.log("Finished playing");
    //     } else {
    //       console.log("Failed playing");
    //     }
    //   });
    // });
  }

  useEffect(() => {
    playSound()
  }, [])
  

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
      <Text
        style={{
          color: textColor,
          fontSize: 20,
          fontWeight: "500",
          marginBottom: 5,
        }}
      >
        {hour < 12 && ampm == "AM"
          ? "Good Morning, Name"
          : (hour <= 4 || hour == 12) && ampm == "PM"
          ? "Good Afternoon, Name"
          : "Good Evening, Name"}
      </Text>

      <Text style={{ color: textColor }}>
        {`${hour < 10 ? `0${hour}` : hour}:${minute}:${second} ${ampm}`}
      </Text>

      <View style={styles.punchContainer}>
        <Pressable
          onPress={handlePunchClick}
          style={[
            styles.punch,
            {
              borderColor: oppBgColor,
              backgroundColor: punchedIn ? "green" : "red",
            },
          ]}
        >
          <Text>
            <AwesomeIcon
              name="hand-pointer"
              size={50}
              style={{ color: "#fff" }}
            />
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    flexDirection: "column",
  },
  punchContainer: {
    display: "flex",
    width: "100%",
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  punch: {
    padding: 40,
    borderWidth: 5,
    borderRadius: 100,
  },
});
