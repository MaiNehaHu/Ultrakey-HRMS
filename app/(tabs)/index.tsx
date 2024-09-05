import React, { useState, useEffect } from "react";
import { Alert, Pressable, ScrollView, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";
import AwesomeIcon from "react-native-vector-icons/FontAwesome6";
import { usePunching } from "@/contexts/Punch";
import { Audio } from "expo-av";

interface PunchRecord {
  punchIn: Date | null;
  punchOut: Date | null;
}

interface BreakRecord {
  breakStartAt: string;
  breakEndAt: string | null;
}

export default function TabOneScreen() {
  const { darkTheme } = useAppTheme();
  const { punchedIn, setPunchedIn } = usePunching();
  const [punchRecords, setPunchRecords] = useState<PunchRecord[]>([]);
  const [breakRecords, setBreakRecords] = useState<BreakRecord[]>([]);
  const [punchInTime, setPunchInTime] = useState<Date | null>(null);
  const [isRestricted, setIsRestricted] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const oppBgColor = Colors[!darkTheme ? "dark" : "light"].background;
  const textColor = Colors[darkTheme ? "dark" : "light"].text;

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());

      if (punchInTime) {
        const elapsedTime =
          (new Date().getTime() - punchInTime.getTime()) / 1000;
        const remaining = Math.max(0.1 * 60 - elapsedTime, 0);
        setRemainingTime(remaining);
        if (remaining === 0) {
          setIsRestricted(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [punchInTime]);

  let hour = currentTime.getHours();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  const minute = currentTime.getMinutes().toString().padStart(2, "0");
  const second = currentTime.getSeconds().toString().padStart(2, "0");

  const day = currentTime.getDate().toString().padStart(2, "0");
  const month = currentTime.toLocaleString("default", { month: "short" });
  const year = currentTime.getFullYear();

  const formattedDate = `${day} ${month}, ${year}`;

  function handlePunchClick() {
    if (!punchedIn) {
      // Punch In
      setPunchedIn(true);
      const newPunchInTime = new Date();
      setPunchInTime(newPunchInTime);
      setIsRestricted(true);

      // Add a new punch-in record
      setPunchRecords((prevRecords) => [
        ...prevRecords,
        { punchIn: newPunchInTime, punchOut: null },
      ]);

      // Handle breaks
      handleBreaksOnPunchIn();

      playSound("punchin");
    } else {
      // Punch Out
      if (isRestricted && remainingTime > 0) {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = Math.floor(remainingTime % 60);
        Alert.alert(`Please try after ${minutes} mins ${seconds} secs.`);
      } else {
        setPunchedIn(false);
        setPunchInTime(null);

        // Update the latest record with the punch-out time
        setPunchRecords((prevRecords) => {
          const updatedRecords = [...prevRecords];
          if (updatedRecords.length > 0) {
            updatedRecords[updatedRecords.length - 1].punchOut = new Date();
          }
          return updatedRecords;
        });

        // Handle breaks
        handleBreaksOnPunchOut();

        playSound("punchout");
      }
    }
  }
  
  function handleBreaksOnPunchIn() {
    setBreakRecords((prevBreakRecords) => {
      const updatedBreakRecords = [...prevBreakRecords];
      const lastBreak = updatedBreakRecords[updatedBreakRecords.length - 1];

      if (lastBreak && lastBreak.breakEndAt === null) {
        // End the ongoing break with the punch-in time
        lastBreak.breakEndAt = new Date().toLocaleTimeString();
      }

      return updatedBreakRecords;
    });
  }

  function handleBreaksOnPunchOut() {
    setBreakRecords((prevBreakRecords) => {
      const updatedBreakRecords = [...prevBreakRecords];
      const lastBreak = updatedBreakRecords[updatedBreakRecords.length - 1];

      if (!lastBreak || lastBreak.breakEndAt !== null) {
        // Start a new break record if there is no ongoing break
        const newBreakRecord: BreakRecord = {
          breakStartAt: new Date().toLocaleTimeString(),
          breakEndAt: null,
        };
        return [...updatedBreakRecords, newBreakRecord];
      }

      return updatedBreakRecords;
    });
  }

  async function playSound(action: string) {
    const soundFile =
      action === "punchin"
        ? require("@/assets/mp3/punchin.mp3")
        : require("@/assets/mp3/punchout.mp3");

    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  }

  useEffect(() => {
    console.log("Break Records Updated:", breakRecords);
  }, [breakRecords]);

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
        {hour < 12 && ampm === "AM"
          ? "Good Morning, Name"
          : (hour <= 4 || hour === 12) && ampm === "PM"
          ? "Good Afternoon, Name"
          : "Good Evening, Name"}
      </Text>

      <Text style={{ color: textColor }}>
        {`${formattedDate} || ${
          hour < 10 ? `0${hour}` : hour
        }:${minute}:${second} ${ampm}`}
      </Text>

      <View style={styles.punchContainer}>
        <Pressable
          onPress={handlePunchClick}
          style={[
            styles.punch,
            {
              borderColor: oppBgColor,
              backgroundColor: punchedIn
                ? darkTheme
                  ? "#00e32d"
                  : "green"
                : "#ff4040",
            },
          ]}
        >
          <Text>
            {punchedIn ? (
              <AwesomeIcon
                name="hand-pointer"
                size={50}
                style={{ color: "#fff" }}
              />
            ) : (
              <AwesomeIcon name="mug-hot" size={50} style={{ color: "#fff" }} />
            )}
          </Text>
        </Pressable>

        <Text
          style={{
            color: punchedIn ? (darkTheme ? "#00e32d" : "green") : "#ff4040",
            marginTop: 10,
            fontWeight: "500",
            fontSize: 18,
          }}
        >
          {punchedIn ? "Work Started" : "Work Paused"}
        </Text>
      </View>

      <View style={styles.recordContainer}>
        <View style={styles.recordRow}>
          <Text
            style={{
              color: darkTheme ? "#00e32d" : "green",
              fontWeight: 500,
              fontSize: 16,
            }}
          >
            Punch In(s):{" "}
          </Text>
          <Text style={{ color: "#ff4040", fontWeight: 500, fontSize: 16 }}>
            Punch Out(s):
          </Text>
        </View>
        {punchRecords.length > 0 ? (
          punchRecords.map((record, index) => (
            <View key={index} style={styles.recordRow}>
              <Text style={{ color: textColor }}>
                {record?.punchIn?.toLocaleTimeString() ?? "~~"}
              </Text>
              <Text style={{ color: textColor }}>
                {record?.punchOut?.toLocaleTimeString() ?? "~~"}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ color: textColor }}>No punch recorded</Text>
        )}
      </View>

      {/* Display break records */}
      <View style={styles.recordContainer}>
        <View style={styles.recordRow}>
          <Text
            style={{
              color: darkTheme ? "#00e32d" : "green",
              fontWeight: 500,
              fontSize: 16,
            }}
          >
            Break Start(s):{" "}
          </Text>
          <Text style={{ color: "#ff4040", fontWeight: 500, fontSize: 16 }}>
            Break End(s):
          </Text>
        </View>
        {breakRecords.length > 0 ? (
          breakRecords.map((record, index) => (
            <View key={index} style={styles.recordRow}>
              <Text style={{ color: textColor }}>
                {record.breakStartAt ?? "~~"}
              </Text>
              <Text style={{ color: textColor }}>
                {record.breakEndAt ?? "~~"}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ color: textColor }}>No breaks recorded</Text>
        )}
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
    width: 150,
    height: 150,
    display: "flex",
    borderWidth: 5,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  recordContainer: {
    marginTop: 20,
    paddingHorizontal: 50,
    backgroundColor: "transparent",
  },
  recordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    backgroundColor: "transparent",
  },
});
