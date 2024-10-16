import React, { useState, useEffect } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";
import AwesomeIcon from "react-native-vector-icons/FontAwesome6";
import { usePunching } from "@/contexts/Punch";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ImageBackground } from "react-native";

const backgroundImage = require("../../assets/images/body_bg.png");

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

interface PunchCircleProps {
  darkTheme: boolean;
  punchedIn: string;
  handlePunchClick: any;
  formattedDate: string;
  hour: number;
  second: string;
  ampm: string;
  minute: string;
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
  const [latePunchIn, setLatePunchIn] = useState<Number | null>(null);
  const [earlyPunchIn, setEarlyPunchIn] = useState<Number | null>(null);
  const [isRestricted, setIsRestricted] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
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

    let totalWorkDuration = 0;
    let firstPunchIn: Date | null = null;

    punchRecords.forEach((record) => {
      // Ensure punchIn and punchOut are Date or null
      const punchIn = record.punchIn instanceof Date ? record.punchIn : null;
      const punchOut = record.punchOut instanceof Date ? record.punchOut : null;

      if (punchIn) {
        // If a punch-in exists, start tracking work duration
        firstPunchIn = punchIn;
      }

      if (punchOut && firstPunchIn) {
        // If a punch-out exists, calculate the work duration from the last punch-in
        totalWorkDuration += punchOut.getTime() - firstPunchIn.getTime();
        firstPunchIn = null; // Reset the punch-in since the work period is closed
      }
    });

    // If there's a punch-in without a punch-out, calculate up to the current time
    if (firstPunchIn) {
      totalWorkDuration += currentTime.getTime() - firstPunchIn.getTime();
    }

    // Assuming 9 hours workday (adjust as needed)
    const workdayDuration = 9 * 60 * 60 * 1000; // 9 hours in milliseconds

    // Calculate percentage
    const percentage = (totalWorkDuration / workdayDuration) * 100;

    // Ensure percentage does not exceed 100%
    return Math.min(100, percentage);
  };

  const calculateLateAndEarlyPunchInTime = (punchInTime: Date | null) => {
    if (!punchInTime) return; // No punch-in time

    const cutoffHour = 9;
    const cutoffMinute = 30;
    const cutoffTime = new Date(punchInTime); // Start with the same date as punch-in
    cutoffTime.setHours(cutoffHour, cutoffMinute, 0, 0); // Set cutoff time to 9:30 AM

    if (punchInTime.getTime() > cutoffTime.getTime()) {
      // Late punch-in
      const lateTimeMs = punchInTime.getTime() - cutoffTime.getTime(); // late time in milliseconds

      setLatePunchIn(lateTimeMs);
      setEarlyPunchIn(0);
    } else if (punchInTime.getTime() <= cutoffTime.getTime()) {
      // Early punch-in
      const earlyTimeMs = cutoffTime.getTime() - punchInTime.getTime(); // early time in milliseconds

      setLatePunchIn(0);
      setEarlyPunchIn(earlyTimeMs);
    }
  };

  const handlePunchClick = () => {
    if (!punchedIn) {
      // Punch In
      setPunchedIn(true);
      const newPunchInTime = new Date();

      setPunchInTime(newPunchInTime); // Punch in time recorded

      // Only calculate late punch-in on the first punch-in
      if (punchRecords.length === 0) {
        calculateLateAndEarlyPunchInTime(newPunchInTime); // Calculate late punch-in time
      }

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
    <ScrollView style={{ backgroundColor: bgColor, flex: 1 }}>
      <ImageBackground source={backgroundImage} style={styles.backImage} />
      <SafeAreaView style={{ padding: 15 }}>
        {/**Wishes */}
        <Wish hour={hour} ampm={ampm} textColor={textColor} />

        {/* Punch Circle */}
        <PunchCircle
          hour={hour}
          minute={minute}
          second={second}
          ampm={ampm}
          punchedIn={punchedIn}
          darkTheme={darkTheme}
          handlePunchClick={handlePunchClick}
          formattedDate={formattedDate}
        />

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

        <SafeAreaView style={{ marginTop: 30, gap: 20, display: "flex" }}>
          <OnGoingTasksCard darkTheme={darkTheme} />

          <UpcomingHolidays darkTheme={darkTheme} />

          <LeavesRequest darkTheme={darkTheme} />
        </SafeAreaView>
      </SafeAreaView>
    </ScrollView>
  );
}

const Wish = ({
  textColor,
  hour,
  ampm,
}: {
  textColor: string;
  hour: number;
  ampm: string;
}) => {
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
};

const PunchCircle = ({
  punchedIn,
  darkTheme,
  handlePunchClick,
  formattedDate,
  hour,
  second,
  ampm,
  minute,
}: PunchCircleProps) => {
  const borderColor = darkTheme
    ? punchedIn
      ? Colors.lightBlue
      : Colors.dark.border
    : Colors.light.border;

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
                {new Date().toLocaleDateString("en-US", {
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
          marginTop: 10,
          fontWeight: "500",
          fontSize: 18,
          color: darkTheme ? Colors.white : Colors.light.border,
        }}
      >
        {punchedIn ? "Work Started" : "Work Paused"}
      </Text>
    </View>
  );
};

const Tracker = ({ darkTheme, percentage }: TrackerProps) => {
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
};

const Punch = ({ darkTheme, punchRecords, textColor }: PunchProps) => {
  return (
    <View style={styles.recordContainer}>
      <SafeAreaView style={styles.recordRow}>
        <Text
          style={{
            color: darkTheme ? Colors.white : Colors.black,
            fontWeight: "500",
            fontSize: 16,
          }}
        >
          Punch In:{" "}
        </Text>
        <Text
          style={{
            fontWeight: "500",
            fontSize: 16,
            color: darkTheme ? Colors.white : Colors.black,
          }}
        >
          Punch Out:
        </Text>
      </SafeAreaView>

      {punchRecords.length > 0 ? (
        <SafeAreaView style={styles.recordRow}>
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
        </SafeAreaView>
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
            color: darkTheme ? Colors.white : Colors.black,
            fontWeight: "500",
            fontSize: 16,
          }}
        >
          Break Start:
        </Text>
        <Text
          style={{
            fontWeight: "500",
            fontSize: 16,
            color: darkTheme ? Colors.white : Colors.black,
          }}
        >
          Break End:
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

const OnGoingTasksCard = ({ darkTheme }: { darkTheme: boolean }) => {
  return (
    <SafeAreaView style={styles.cardContainer}>
      <View
        style={[
          styles.duplicateCard,
          {
            backgroundColor: darkTheme ? Colors.lightBlue : Colors.light.border,
          },
        ]}
      />
      <View style={styles.cardStyle}>
        {/**Header */}
        <SafeAreaView style={styles.flex_row}>
          <Text
            style={{
              color: Colors.darkBlue,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            On Going Tasks
          </Text>

          <Text
            style={{
              color: Colors.darkBlue,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Deadline by
          </Text>
        </SafeAreaView>

        {/* Table */}
        <SafeAreaView style={{ display: "flex", gap: 5 }}>
          <SafeAreaView style={styles.flex_row}>
            <Text
              style={{ width: "60%", color: Colors.black, overflow: "scroll" }}
            >
              HRMS for Ultrakey
            </Text>
            <Text style={{ color: Colors.black, maxWidth: "30%" }}>20 Oct</Text>
          </SafeAreaView>
          <SafeAreaView style={styles.flex_row}>
            <Text
              style={{ width: "60%", color: Colors.black, overflow: "scroll" }}
            >
              Trending News Guru
            </Text>
            <Text style={{ color: Colors.black, maxWidth: "30%" }}>20 Oct</Text>
          </SafeAreaView>
        </SafeAreaView>

        <SafeAreaView>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => {
              router.push({ pathname: "/(tabs)/task" });
            }}
          >
            <Text style={styles.viewAllButtonText}>
              View All <AwesomeIcon name="arrow-right" />
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
};

const UpcomingHolidays = ({ darkTheme }: { darkTheme: boolean }) => {
  return (
    <SafeAreaView style={styles.cardContainer}>
      <View
        style={[
          styles.duplicateCard,
          {
            backgroundColor: darkTheme ? Colors.lightBlue : Colors.light.border,
          },
        ]}
      />
      <View style={styles.cardStyle}>
        {/**Header */}
        <SafeAreaView style={styles.flex_row}>
          <Text
            style={{
              color: Colors.darkBlue,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Upcoming Holidays
          </Text>

          <Text
            style={{
              color: Colors.darkBlue,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Deadline by
          </Text>
        </SafeAreaView>

        {/* Table */}
        <SafeAreaView style={{ display: "flex", gap: 5 }}>
          <SafeAreaView style={styles.flex_row}>
            <Text
              style={{ width: "30%", color: Colors.black, overflow: "scroll" }}
            >
              2 Oct
            </Text>
            <Text style={{ color: Colors.black, maxWidth: "60%" }}>
              Gandhi Jayanti
            </Text>
          </SafeAreaView>
          <SafeAreaView style={styles.flex_row}>
            <Text
              style={{ width: "30%", color: Colors.black, overflow: "scroll" }}
            >
              12 Oct
            </Text>
            <Text style={{ color: Colors.black, maxWidth: "60%" }}>
              Dassehra
            </Text>
          </SafeAreaView>
          <SafeAreaView style={styles.flex_row}>
            <Text
              style={{ width: "30%", color: Colors.black, overflow: "scroll" }}
            >
              12 Oct
            </Text>
            <Text style={{ color: Colors.black, maxWidth: "60%" }}>
              Diwali/Deepawali
            </Text>
          </SafeAreaView>
        </SafeAreaView>

        <SafeAreaView>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => {
              router.push({ pathname: "/(tabs)/task" });
            }}
          >
            <Text style={styles.viewAllButtonText}>
              View All <AwesomeIcon name="arrow-right" />
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
};

const LeavesRequest = ({ darkTheme }: { darkTheme: boolean }) => {
  return (
    <SafeAreaView style={styles.cardContainer}>
      <View
        style={[
          styles.duplicateCard,
          {
            backgroundColor: darkTheme ? Colors.lightBlue : Colors.light.border,
          },
        ]}
      />
      <View style={styles.cardStyle}>
        {/**Header */}
        <SafeAreaView style={styles.flex_row}>
          <Text
            style={{
              color: Colors.darkBlue,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Leave Requests
          </Text>

          <Text
            style={{
              color: Colors.darkBlue,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Status
          </Text>
        </SafeAreaView>

        {/* Table */}
        <SafeAreaView style={{ display: "flex", gap: 5 }}>
          <SafeAreaView style={styles.flex_row}>
            <Text
              style={{ width: "30%", color: Colors.black, overflow: "scroll" }}
            >
              2 Oct
            </Text>
            <Text style={{ color: Colors.black, maxWidth: "60%" }}>
              Gandhi Jayanti
            </Text>
          </SafeAreaView>
          <SafeAreaView style={styles.flex_row}>
            <Text
              style={{ width: "30%", color: Colors.black, overflow: "scroll" }}
            >
              12 Oct
            </Text>
            <Text style={{ color: Colors.black, maxWidth: "60%" }}>
              Dassehra
            </Text>
          </SafeAreaView>
        </SafeAreaView>

        <SafeAreaView>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => {
              router.push({ pathname: "/(tabs)/task" });
            }}
          >
            <Text style={styles.viewAllButtonText}>
              View All <AwesomeIcon name="arrow-right" />
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
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
  recordContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  recordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    backgroundColor: "transparent",
  },
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
  cardContainer: {
    position: "relative",
    marginHorizontal: 10,
  },
  duplicateCard: {
    position: "absolute",
    top: -7,
    left: 0,
    right: 0,
    zIndex: -1,
    height: "100%",
    borderRadius: 20,
    elevation: 5,
    shadowRadius: 15,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  cardStyle: {
    display: "flex",
    gap: 10,
    padding: 15,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: "#D4D4D4",
  },
  flex_row: {
    gap: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewAllButton: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-end",
  },
  viewAllButtonText: {
    color: Colors.white,
    textAlign: "right",
    fontWeight: 500,
    fontSize: 10,
  },
});
