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

interface BreaksProps {
  darkTheme: boolean;
  textColor: string;
  breakRecords: BreakRecord[];
}

interface PunchProps {
  darkTheme: boolean;
  textColor: string;
  punchRecords: PunchRecord[];
}

interface TrackerProps {
  darkTheme: boolean;
  percentage: number;
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

  // Time
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());

      if (punchInTime) {
        const elapsedTime =
          (new Date().getTime() - punchInTime.getTime()) / 1000;
        const remaining = Math.max(1 * 60 - elapsedTime, 0);
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

  // Helper function to check if current time is after 6:30 PM
  const isAfterCutoff = (time: Date): boolean => {
    const cutoffHour = 18; // 6 PM in 24-hour format
    const cutoffMinute = 30;
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffHour, cutoffMinute, 0, 0);
    return time.getTime() > cutoffTime.getTime();
  };

  function handleBreaksOnPunchIn() {
    setBreakRecords((prevBreakRecords) => {
      const updatedBreakRecords = [...prevBreakRecords];
      const lastBreak = updatedBreakRecords[updatedBreakRecords.length - 1];

      if (lastBreak && lastBreak.breakEndAt === null) {
        // End the ongoing break with the punch-in time
        lastBreak.breakEndAt = new Date().toISOString();
      }

      return updatedBreakRecords;
    });
  }

  function handleBreaksOnPunchOut() {
    if (isAfterCutoff(currentTime)) {
      return; // Do not record a break if it's after 6:30 PM
    }

    setBreakRecords((prevBreakRecords) => {
      const updatedBreakRecords = [...prevBreakRecords];
      const lastBreak = updatedBreakRecords[updatedBreakRecords.length - 1];

      if (!lastBreak || lastBreak.breakEndAt !== null) {
        // Start a new break record if there is no ongoing break
        const newBreakRecord: BreakRecord = {
          breakStartAt: new Date().toISOString(),
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

  // Calculate the percentage of time worked
  const calculatePercentage = (): number => {
    if (punchRecords.length === 0) return 0; // No punch records

    const firstPunchIn = punchRecords[0].punchIn;
    if (!firstPunchIn) return 0; // If no valid punch-in time

    // Get the last punch-out time or fallback to the current time
    const lastPunchOut = punchRecords
      .filter((record) => record.punchOut)
      .map((record) => record.punchOut!)
      .reduce(
        (latest, current) => (current > latest ? current : latest),
        new Date(0)
      );

    // Determine whether to use lastPunchOut or currentTime
    const useTime =
      lastPunchOut && isAfterCutoff(lastPunchOut) ? lastPunchOut : currentTime;

    // Calculate total work duration
    const totalWorkDuration = useTime.getTime() - firstPunchIn.getTime();

    // Assuming 8 hours workday (adjust as needed)
    const workdayDuration = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
    const percentage = (totalWorkDuration / workdayDuration) * 100;

    return Math.min(100, percentage);
  };

  // Update this function if a punch-out is clicked
  const handlePunchClick = () => {
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
      const now = new Date();

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
            updatedRecords[updatedRecords.length - 1].punchOut = now;
          }
          return updatedRecords;
        });

        // Handle breaks
        handleBreaksOnPunchOut();

        playSound("punchout");
      }
    }
  };

  // Work done time percentage
  const percentage = calculatePercentage();

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
                : "#f54c68",
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
            color: punchedIn ? (darkTheme ? "#00e32d" : "green") : "#f54c68",
            marginTop: 10,
            fontWeight: "500",
            fontSize: 18,
          }}
        >
          {punchedIn ? "Work Started" : "Work Paused"}
        </Text>
      </View>

      {/* Tracker */}
      <Tracker darkTheme={darkTheme} percentage={percentage} />

      {/* Punch in and Punch outs */}
      <Punch
        darkTheme={darkTheme}
        textColor={textColor}
        punchRecords={punchRecords}
      />

      {/* Display break records */}
      <Breaks
        darkTheme={darkTheme}
        breakRecords={breakRecords}
        textColor={textColor}
      />
    </ScrollView>
  );
}

const Tracker = ({ darkTheme, percentage }: TrackerProps) => {
  return (
    <View
      style={{
        marginTop: 10,
        paddingHorizontal: 40,
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <View
        style={[
          styles.track,
          {
            borderWidth: 1,
            backgroundColor: "transparent",
            borderColor: darkTheme ? "#00e32d" : "#1e3669",
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${percentage < 100 ? percentage : 100}%`,
              backgroundColor: darkTheme ? "#00e32d" : "#1e3669",
            },
          ]}
        />
      </View>
      <Text
        style={[
          styles.percentageText,
          { color: darkTheme ? "#00e32d" : "#1e3669" },
        ]}
      >{`${Math.round(percentage < 100 ? percentage : 100)}%`}</Text>
    </View>
  );
};

const Punch = ({ darkTheme, punchRecords, textColor }: PunchProps) => {
  return (
    <View style={styles.recordContainer}>
      <View style={styles.recordRow}>
        <Text
          style={{
            color: darkTheme ? "#00e32d" : "green",
            fontWeight: "500",
            fontSize: 16,
          }}
        >
          Punch In:{" "}
        </Text>
        <Text style={{ color: "#f54c68", fontWeight: "500", fontSize: 16 }}>
          Punch Out:
        </Text>
      </View>
      {punchRecords.length > 0 ? (
        <View style={styles.recordRow}>
          <Text style={{ color: textColor }}>
            {punchRecords[0].punchIn?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }) ?? "~~"}
          </Text>
          <Text style={{ color: textColor }}>
            {punchRecords[punchRecords.length - 1].punchOut?.toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ) ?? "~~"}
          </Text>
        </View>
      ) : (
        <Text style={{ color: textColor }}>No punch recorded</Text>
      )}
    </View>
  );
};

const Breaks = ({ darkTheme, textColor, breakRecords }: BreaksProps) => {
  return (
    <View style={styles.recordContainer}>
      <View style={styles.recordRow}>
        <Text
          style={{
            color: darkTheme ? "#00e32d" : "green",
            fontWeight: "500",
            fontSize: 16,
          }}
        >
          Break Start(s):
        </Text>
        <Text style={{ color: "#f54c68", fontWeight: "500", fontSize: 16 }}>
          Break End(s):
        </Text>
      </View>
      {breakRecords.length > 0 ? (
        breakRecords.map((breakRecord, index) => (
          <View key={index} style={styles.recordRow}>
            <Text style={{ color: textColor }}>
              {breakRecord.breakStartAt
                ? new Date(breakRecord.breakStartAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "~~"}
            </Text>
            <Text style={{ color: textColor }}>
              {breakRecord.breakEndAt
                ? new Date(breakRecord.breakEndAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "~~"}
            </Text>
          </View>
        ))
      ) : (
        <Text style={{ color: textColor }}>No breaks recorded</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    flexDirection: "column",
  },
  punchContainer: {
    display: "flex",
    width: "100%",
    marginTop: 30,
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
