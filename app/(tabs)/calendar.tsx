import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars"; // Add DateObject for correct typing
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/contexts/AppTheme";
import moment from "moment";
import ApplyLeave from "@/app/applyLeave";
import { useLeavesContext } from "@/contexts/Leaves";

const CalendarScreen = () => {
  const [showAttendance, setShowAttendance] = useState(true);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [isModalVisible, setModalVisible] = useState(false);

  const { darkTheme } = useAppTheme();
  const { leaves, setLeaves } = useLeavesContext();

  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const oppBgColor = Colors[!darkTheme ? "dark" : "light"].background;
  const textColor = Colors[darkTheme ? "dark" : "light"].text;
  const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;

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

  // Toggle the modal visibility
  const toggleModal = () => {
    setTimeout(() => {
      setModalVisible(!isModalVisible);
    }, 100);
  };

  return (
    <View
      style={{
        backgroundColor: bgColor,
        flex: 1,
        padding: 15,
        paddingBottom: 110,
      }}
    >
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => setShowAttendance(true)}
          style={[
            styles.button,
            {
              backgroundColor: showAttendance ? oppBgColor : "transparent",
              borderWidth: 2,
              borderColor: oppBgColor,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              { color: !showAttendance ? oppBgColor : bgColor },
            ]}
          >
            Attendance
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setShowAttendance(false)}
          style={[
            styles.button,
            {
              backgroundColor: !showAttendance ? oppBgColor : "transparent",
              borderWidth: 2,
              borderColor: oppBgColor,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              { color: showAttendance ? oppBgColor : bgColor },
            ]}
          >
            Leaves
          </Text>
        </Pressable>
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
            leaves={leaves}
            toggleModal={toggleModal}
            textColor={textColor}
            oppBgColor={oppBgColor}
            oppTextColor={oppTextColor}
          />
        )}
      </View>

      {/* Add Leave Modal */}
      {isModalVisible && (
        <ApplyLeave
          isVisible={isModalVisible}
          toggleModal={toggleModal}
          setLeaves={setLeaves}
        />
      )}
    </View>
  );
};

export default CalendarScreen;

// Leaves Component
const Leaves = ({
  leaves,
  textColor,
  toggleModal,
  oppBgColor,
  oppTextColor,
}: {
  leaves: any;
  textColor: string;
  toggleModal: any;
  oppBgColor: string;
  oppTextColor: string;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View>
      <View style={styles.flex_row_top}>
        <Text style={{ color: textColor, fontSize: 16, fontWeight: 500 }}>
          Your Leaves:
        </Text>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={toggleModal}
            style={[styles.addButton, { backgroundColor: "#2f95dc" }]}
          >
            <Text style={[styles.buttonText, { color: "#fff", fontSize: 12 }]}>
              Apply Now
            </Text>
          </Pressable>
        </Animated.View>
      </View>

      <ScrollView style={{ marginTop: 15 }}>
        {leaves.length === 0 ? (
          <Text style={[styles.noDataText, { color: textColor }]}>
            No Leaves data found
          </Text>
        ) : (
          leaves.map((leave: any) => (
            <View
              key={leave.id}
              style={[styles.leaveCard, { backgroundColor: oppBgColor }]}
            >
              <View style={styles.flex_row_top}>
                <View>
                  <Text style={{ color: oppTextColor }}>
                    From {formatDate(leave.from.date)}
                    {" - "}
                    Session {leave.from.session}
                  </Text>
                  <Text style={{ color: oppTextColor }}>
                    To {formatDate(leave.to.date)}
                    {" - "}
                    Session {leave.to.session}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.status,
                    {
                      backgroundColor:
                        leave.status === "Pending"
                          ? "orange"
                          : leave.status === "Approved"
                          ? "green"
                          : "red",
                    },
                  ]}
                >
                  {leave.status}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  button: {
    width: "48%",
    paddingVertical: 8,
    borderRadius: 30,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    borderRadius: 30,
    padding: 10,
    paddingHorizontal: 20,
  },
  // flex_row_center: {
  //   display: "flex",
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  // },
  flex_row_top: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  leaveCard: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  status: {
    color: "#fff",
    paddingVertical: 2,
    paddingHorizontal: 8,
    fontSize: 12,
    borderRadius: 20,
  },
  noDataText: {
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
});
