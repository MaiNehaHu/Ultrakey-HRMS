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
import { router, useNavigation } from "expo-router";
import { ImageBackground } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import holidaysList from "@/constants/holidaysList";
import { useLeavesContext } from "@/contexts/Leaves";
import taskStatus from "@/constants/taskStatus";
import leaveStatus from "@/constants/leaveStatus";
import Wish from "@/components/Index/Wish";
import Tracker from "@/components/Index/Tracker";
import OnGoingTasksCard from "@/components/Index/OnGoingTasksCard";
import UpcomingHolidaysCard from "@/components/Index/UpcomingHolidaysCard";
import LeavesRequestsCard from "@/components/Index/LeavesRequestsCard";
import PunchCircle from "@/components/Index/PunchCircle";
import PunchRecords from "@/components/Index/PunchRecords";
import BreakRecords from "@/components/Index/BreakRecords";

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
      totalWorkDuration += currentTime?.getTime() - firstPunchIn?.getTime();
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
        // Calculate late punch-in time
        calculateLateAndEarlyPunchInTime(newPunchInTime);
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
        <Wish currentTime={currentTime} />

        {/* Punch Circle */}
        <PunchCircle
          punchedIn={punchedIn}
          currentTime={currentTime}
          handlePunchClick={handlePunchClick}
        />

        {/* Tracker */}
        <Tracker percentage={percentage} />

        {/* Punch in and Punch outs */}
        <PunchRecords punchRecords={punchRecords} />

        {/* Display break records */}
        <BreakRecords breakRecords={breakRecords} />

        <SafeAreaView style={{ marginTop: 30, gap: 15, display: "flex" }}>
          <OnGoingTasksCard />

          <UpcomingHolidaysCard />

          <LeavesRequestsCard />
        </SafeAreaView>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  recordContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
  },
  recordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    backgroundColor: "transparent",
  },
});
