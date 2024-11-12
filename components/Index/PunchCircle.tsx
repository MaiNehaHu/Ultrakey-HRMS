import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/contexts/AppTheme";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native";

export default function PunchCircle({
  punchedIn,
  currentTime,
  handlePunchClick,
}: {
  punchedIn: boolean;
  currentTime: Date;
  handlePunchClick: any;
}) {
  const { darkTheme } = useAppTheme();
  const borderColor = darkTheme
    ? punchedIn
      ? Colors.lightBlue
      : Colors.dark.border
    : Colors.light.border;

  const day = currentTime.getDate().toString().padStart(2, "0");
  const month = currentTime.toLocaleString("default", { month: "short" });
  const year = currentTime.getFullYear();

  let hour = currentTime.getHours();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  const minute = currentTime.getMinutes().toString().padStart(2, "0");
  const second = currentTime.getSeconds().toString().padStart(2, "0");

  const formattedDate = `${day} ${month} ${year}`;

  return (
    <View style={styles.punchContainer}>
      <View
        style={[
          styles.punch,
          {
            top: -8,
            width: 203,
            height: 203,
            position: "absolute",
            backgroundColor: borderColor,
          },
        ]}
      ></View>
      <Pressable
        onPress={handlePunchClick}
        style={[styles.punch, { width: 200, height: 200 }]}
      >
        <LinearGradient
          colors={
            punchedIn
              ? [Colors.white, Colors.white]
              : [Colors.lightBlue, Colors.darkBlue]
          }
          style={{ width: "100%", height: "100%", borderRadius: 100 }}
        >
          <SafeAreaView
            style={{
              gap: 25,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SafeAreaView>
              <Text
                style={{
                  color: punchedIn ? Colors.darkBlue : Colors.white,
                  fontSize: 18,
                  fontWeight: 500,
                }}
              >
                {formattedDate}
              </Text>

              <Text
                style={{
                  color: punchedIn ? Colors.darkBlue : Colors.white,
                  fontSize: 14,
                  fontWeight: "400",
                  textAlign: "center",
                }}
              >
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "long",
                })}
              </Text>
            </SafeAreaView>

            <Text
              style={{
                color: punchedIn ? Colors.darkBlue : Colors.white,
                fontSize: 22,
                fontWeight: 500,
              }}
            >{`${
              hour < 10 ? `0${hour}` : hour
            }:${minute}:${second} ${ampm}`}</Text>
          </SafeAreaView>
        </LinearGradient>
      </Pressable>

      <Text
        style={{
          marginTop: 15,
          fontWeight: "500",
          fontSize: 18,
          color: darkTheme ? Colors.white : Colors.light.border,
        }}
      >
        {punchedIn ? "Work Started" : "Work Paused"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  punchContainer: {
    display: "flex",
    width: "100%",
    marginTop: 30,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  punch: {
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowRadius: 6,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
});
