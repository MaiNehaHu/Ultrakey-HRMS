import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars"; // Add DateObject for correct typing
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/contexts/AppTheme";
import moment from "moment";

const CalendarScreen = () => {
  const [showAttendance, setShowAttendance] = useState(true);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});

  const { darkTheme } = useAppTheme();
  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const oppBgColor = Colors[!darkTheme ? "dark" : "light"].background;
  const textColor = Colors[darkTheme ? "dark" : "light"].text;
  const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;
  const tintColor = Colors[darkTheme ? "dark" : "light"].tint;

  // Function to get all Sundays in the selected month
  const markSundays = (month: number, year: number) => {
    const marked: Record<string, any> = {};
    const currentMonth = moment()
      .year(year)
      .month(month - 1)
      .startOf("month"); // Adjust to zero-indexed month
    const daysInMonth = currentMonth.daysInMonth();

    for (let i = 1; i <= daysInMonth; i++) {
      const date = currentMonth.clone().date(i);
      if (date.day() === 0) {
        // Sunday
        marked[date.format("YYYY-MM-DD")] = {
          selected: true,
          selectedColor: "red",
        };
      }
    }

    setMarkedDates(marked);
  };

  // UseEffect to mark Sundays for the current month on initial load
  useEffect(() => {
    const currentDate = moment();
    markSundays(currentDate.month() + 1, currentDate.year());
  }, []);

  // Handle month change
  const onMonthChange = (date: any) => {
    markSundays(date.month, date.year); // Call markSundays when the month changes
  };

  return (
    <View style={{ backgroundColor: bgColor, flex: 1, padding: 15 }}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => setShowAttendance(true)}
          style={[
            styles.button,
            {
              backgroundColor: showAttendance
                ? oppBgColor
                : darkTheme
                ? oppBgColor
                : "#2f95dc",
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: showAttendance
                  ? darkTheme
                    ? "#2f95dc"
                    : "#fff"
                  : bgColor,
              },
            ]}
          >
            Attendance
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowAttendance(false)}
          style={[
            styles.button,
            {
              backgroundColor: !showAttendance
                ? oppBgColor
                : darkTheme
                ? oppBgColor
                : "#2f95dc",
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: !showAttendance
                  ? darkTheme
                    ? "#2f95dc"
                    : "#fff"
                  : bgColor,
              },
            ]}
          >
            Leaves
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 15 }}>
        {showAttendance ? (
          <Calendar
            markedDates={markedDates} // Marked Sundays
            onMonthChange={onMonthChange} // Handle month change
            style={{ borderRadius: 5, borderWidth: 2, borderColor: oppBgColor }}
          />
        ) : (
          <Leaves
            textColor={textColor}
            oppBgColor={oppBgColor}
            oppTextColor={oppTextColor}
          />
        )}
      </View>
    </View>
  );
};

export default CalendarScreen;

// Leaves Component
const Leaves = ({
  textColor,
  oppBgColor,
  oppTextColor,
}: {
  textColor: string;
  oppBgColor: string;
  oppTextColor: string;
}) => {
  return (
    <View>
      <View style={styles.flex_row}>
        <Text style={{ color: textColor, fontSize: 16, fontWeight: 500 }}>
          Your Leaves:
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: oppBgColor }]}
        >
          <Text
            style={[styles.buttonText, { color: oppTextColor, fontSize: 12 }]}
          >
            Apply Now
          </Text>
        </TouchableOpacity>
      </View>
      <View></View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  button: {
    width: "48%",
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    borderRadius: 10,
    padding: 10,
  },
  flex_row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
