import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/contexts/AppTheme";

export default function Tracker({ percentage }: { percentage: number }) {
  const { darkTheme } = useAppTheme();

  return (
    <View style={styles.trackerContainer}>
      <View
        style={[
          styles.track,
          {
            borderWidth: 1,
            backgroundColor: "transparent",
            borderColor: darkTheme ? Colors.white : Colors.black,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${percentage < 100 ? percentage : 100}%`,
              backgroundColor: darkTheme ? Colors.white : Colors.black,
            },
          ]}
        />
      </View>
      <Text
        style={[
          styles.percentageText,
          { color: darkTheme ? Colors.white : Colors.black },
        ]}
      >{`${Math.round(percentage < 100 ? percentage : 100)}%`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  trackerContainer: {
    marginTop: 10,
    paddingHorizontal: 40,
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "row",
  },
  track: {
    width: "80%",
    height: 12,
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
  },
  fill: {
    height: "100%",
  },
  percentageText: {
    fontSize: 18,
    width: "20%",
    textAlign: "right",
    fontWeight: "bold",
    marginTop: 5,
  },
});
