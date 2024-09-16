import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Animated,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/contexts/AppTheme";
import moment from "moment";
import ApplyLeave from "@/app/ApplyLeave";
import LeaveDetails from "@/app/LeaveDetails";
import { useLeavesContext } from "@/contexts/Leaves";
import PunchDetails from "@/app/PunchDetails";

interface LeaveSession {
  date: string;
  session: string;
}

interface AttendanceSession {
  date: Date;
  percentage: number;
  latePunchIn: number;
  earlyPunchIn: number;
  punchRecords: PunchRecord[];
  breakRecords: BreakRecord[];
}

interface PunchRecord {
  punchIn: Date;
  punchOut: Date;
}

interface BreakRecord {
  breakStartAt: Date;
  breakEndAt: Date;
}

interface ClickedDate {
  selectedAttendance: AttendanceSession | null;
  selectedHoliday: { date: string; name: string } | null;
  selectedLeave: {
    reason: string;
    from: LeaveSession;
    to: LeaveSession;
    type: string;
    noOfDays: number;
  } | null;
}

const CalendarScreen = () => {
  const [showAttendance, setShowAttendance] = useState(true);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [isLeaveModalVisible, setLeaveModalVisible] = useState(false);
  const [leaveModalId, setLeaveModalId] = useState(null);
  const [isPunchModalVisible, setPunchModalVisible] = useState(false);
  const [showLeaveDetailsModal, setShowLeaveDetailsModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(moment());
  const [clickedDate, setClickedDate] = useState<ClickedDate>({
    selectedAttendance: null,
    selectedHoliday: null,
    selectedLeave: null,
  });

  const { darkTheme } = useAppTheme();
  const { leaves, setLeaves } = useLeavesContext();

  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const oppBgColor = Colors[!darkTheme ? "dark" : "light"].background;
  const textColor = Colors[darkTheme ? "dark" : "light"].text;
  const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;

  // Sample attendance data
  const attendace = [
    {
      date: "2024-09-19T00:00:00.857Z",
      percentage: 100,
      latePunchIn: 800,
      earlyPunchIn: 0,
      punchRecords: [
        {
          punchIn: "2024-09-19T09:39:00.857Z",
          punchOut: "2024-09-19T0018:09:00.857Z",
        },
      ],
      breakRecords: [
        {
          breakStartAt: "2024-09-13T09:39:00.857Z",
          breakEndAt: "2024-09-13T09:39:00.857Z",
        },
      ],
    },
    {
      date: "2024-09-13T00:00:00.857Z",
      percentage: 60,
      latePunchIn: 800,
      earlyPunchIn: 0,
      punchRecords: [
        {
          punchIn: "2024-09-13T09:39:00.857Z",
          punchOut: "2024-09-13T0018:09:00.857Z",
        },
      ],
      breakRecords: [
        {
          breakStartAt: "2024-09-13T09:39:00.857Z",
          breakEndAt: "2024-09-13T09:39:00.857Z",
        },
      ],
    },
    {
      date: "2024-09-12T00:00:00.857Z",
      percentage: 20,
      latePunchIn: 800,
      earlyPunchIn: 0,
      punchRecords: [
        {
          punchIn: "2024-09-13T09:39:00.857Z",
          punchOut: "2024-09-13T0018:09:00.857Z",
        },
      ],
      breakRecords: [
        {
          breakStartAt: "2024-09-13T09:39:00.857Z",
          breakEndAt: "2024-09-13T09:39:00.857Z",
        },
      ],
    },
  ];

  const holidays = [
    { date: "2024-01-01T00:00:00.857Z", name: "New Year’s Day" },
    { date: "2024-01-15T00:00:00.857Z", name: "Makar Sankranti" },
    { date: "2024-01-26T00:00:00.857Z", name: "Republic Day" },
    { date: "2024-03-08T00:00:00.857Z", name: "Maha Shivaratri" },
    { date: "2024-04-09T00:00:00.857Z", name: "Udgadi" },
    { date: "2024-06-02T00:00:00.857Z", name: "Telangana State Formation Day" },
    { date: "2024-05-01T00:00:00.857Z", name: "May Day" },
    { date: "2024-08-15T00:00:00.857Z", name: "Independence Day" },
    { date: "2024-04-17T00:00:00.857Z", name: "Rama Navami" },
    { date: "2024-09-07T00:00:00.857Z", name: "Ganesh Chaturthi" },
    { date: "2024-10-02T00:00:00.857Z", name: "Gandhi Jayanti" },
    { date: "2024-10-12T00:00:00.857Z", name: "Dussehra" },
    { date: "2024-10-31T00:00:00.857Z", name: "Diwali (Deepavali)" },
    { date: "2024-12-25T00:00:00.857Z", name: "Christmas" },
    { date: "2025-01-01T00:00:00.857Z", name: "New Year’s Day" },
    { date: "2025-01-14T00:00:00.857Z", name: "Makar Sankranti" },
    { date: "2025-01-26T00:00:00.857Z", name: "Republic Day" },
    { date: "2025-02-26T00:00:00.857Z", name: "Maha Shivaratri" },
    { date: "2025-03-30T00:00:00.857Z", name: "Udgadi" },
    { date: "2025-05-01T00:00:00.857Z", name: "May Day" },
    { date: "2025-06-02T00:00:00.857Z", name: "Telangana State Formation Day" },
    { date: "2025-08-15T00:00:00.857Z", name: "Independence Day" },
    { date: "2025-04-06T00:00:00.857Z", name: "Rama Navami" },
    { date: "2025-08-27T00:00:00.857Z", name: "Ganesh Chaturthi" },
    { date: "2025-10-02T00:00:00.857Z", name: "Gandhi Jayanti" },
    { date: "2025-10-02T00:00:00.857Z", name: "Dussehra" },
    { date: "2025-10-21T00:00:00.857Z", name: "Diwali (Deepavali)" },
    { date: "2025-12-25T00:00:00.857Z", name: "Christmas" },
  ];

  // Function to get all Sundays in the selected month
  const markSundays = (month: number, year: number) => {
    const marked: Record<string, any> = {};
    const currentMonth = moment()
      .year(year)
      .month(month - 1)
      .startOf("month");
    const daysInMonth = currentMonth.daysInMonth();

    for (let i = 1; i <= daysInMonth; i++) {
      const date = currentMonth.clone().date(i);
      if (date.day() === 0) {
        // Sunday
        marked[date.format("YYYY-MM-DD")] = {
          selected: true,
          selectedColor: "gray",
        };
      }
    }
    return marked;
  };

  // Function to mark attendance
  const markAttendance = () => {
    const attendanceMarked: Record<string, any> = {};
    attendace.forEach((entry) => {
      const date = moment(entry.date).format("YYYY-MM-DD");
      const color =
        entry.percentage === 100
          ? "green"
          : entry.percentage < 50
          ? "orange"
          : "red";
      attendanceMarked[date] = {
        selected: true,
        selectedColor: color,
      };
    });
    return attendanceMarked;
  };

  // Function to mark holidays and 4th Saturday
  const markHolidays = () => {
    const holidayMarked: Record<string, any> = {};

    // Mark regular holidays
    holidays.forEach((holiday) => {
      const date = moment(holiday.date).format("YYYY-MM-DD");
      holidayMarked[date] = {
        selected: true,
        selectedColor: "navy",
        holidayName: holiday.name, // Store holiday name
      };
    });

    // Mark 4th Saturdays
    const fourthSaturdays = markFourthSaturday(
      currentDate.month() + 1,
      currentDate.year()
    );
    Object.keys(fourthSaturdays).forEach((date) => {
      holidayMarked[date] = {
        selected: true,
        selectedColor: "navy", // Color for 4th Saturday
        holidayName: "4th Saturday", // Distinct name for 4th Saturday
      };
    });

    return holidayMarked;
  };

  // Function to mark leaves in the calendar
  const markLeaves = () => {
    const leaveMarkedDates: Record<string, any> = { ...markedDates };

    leaves?.forEach((leave: any) => {
      if (leave.status === "Approved") {
        const start = moment(leave.from.date);
        const end = moment(leave.to.date);

        while (start.isSameOrBefore(end)) {
          const formattedDate = start.format("YYYY-MM-DD");
          leaveMarkedDates[formattedDate] = {
            marked: true,
            dotColor: "navy", // Color for leaves
          };
          start.add(1, "days");
        }
      }
    });

    return leaveMarkedDates;
  };

  // Function to mark the 4th Saturday of a given month and year
  const markFourthSaturday = (month: number, year: number) => {
    const marked: Record<string, any> = {};
    const startOfMonth = moment()
      .year(year)
      .month(month - 1)
      .startOf("month");
    let saturdayCount = 0;

    for (let day = 1; day <= startOfMonth.daysInMonth(); day++) {
      const date = startOfMonth.clone().date(day);
      if (date.day() === 6) {
        // Saturday
        saturdayCount++;
        if (saturdayCount === 4) {
          marked[date.format("YYYY-MM-DD")] = {
            selected: true,
            selectedColor: "navy", // Color for 4th Saturday
          };
        }
      }
    }
    return marked;
  };

  // UseEffect to mark Sundays, attendance, leaves, holidays, and 4th Saturday for the current month on initial load
  useEffect(() => {
    const sundays = markSundays(currentDate.month() + 1, currentDate.year());
    const attendanceMarks = markAttendance();
    const leaveMarks = markLeaves();
    const holidayMarks = markHolidays();

    // Merge all the marked dates
    setMarkedDates({
      ...sundays,
      ...attendanceMarks,
      ...leaveMarks,
      ...holidayMarks,
    });
  }, [leaves, currentDate]);

  // Handle month change in calendar
  const onMonthChange = (date: any) => {
    setCurrentDate(moment(date.dateString, "YYYY-MM-DD"));
  };

  const onDayPress = (day: any) => {
    const date = day.dateString;

    // Check if the date is an attendance, holiday, or leave
    const attendance = attendace.find(
      (entry) => moment(entry.date).format("YYYY-MM-DD") === date
    );
    const holiday = holidays.find(
      (entry) => moment(entry.date).format("YYYY-MM-DD") === date
    );
    const leave = leaves.find(
      (entry: any) =>
        moment(entry.from.date).format("YYYY-MM-DD") <= date &&
        moment(entry.to.date).format("YYYY-MM-DD") >= date
    );

    // Check if the date is a 4th Saturday or Sunday
    const isFourthSaturday = markFourthSaturday(
      currentDate.month() + 1,
      currentDate.year()
    )[date];
    const isSunday = markSundays(currentDate.month() + 1, currentDate.year())[
      date
    ];

    setClickedDate({
      selectedAttendance: attendance
        ? {
            date: new Date(attendance.date),
            percentage: attendance.percentage,
            latePunchIn: attendance.latePunchIn,
            earlyPunchIn: attendance.earlyPunchIn,
            punchRecords: attendance.punchRecords.map((record) => ({
              punchIn: new Date(record.punchIn),
              punchOut: new Date(record.punchOut),
            })),
            breakRecords: attendance.breakRecords.map((record) => ({
              breakStartAt: new Date(record.breakStartAt),
              breakEndAt: new Date(record.breakEndAt),
            })),
          }
        : null,
      selectedHoliday: holiday
        ? { date: holiday.date, name: holiday.name }
        : isFourthSaturday
        ? { date, name: "4th Saturday" }
        : isSunday
        ? { date, name: "Sunday" }
        : null,
      selectedLeave: leave
        ? {
            reason: leave.reason,
            from: {
              date: leave.from.date,
              session: leave.from.session,
            },
            to: {
              date: leave.to.date,
              session: leave.to.session,
            },
            type: leave.type,
            noOfDays: leave.noOfDays,
          }
        : null,
    });

    setPunchModalVisible(true);
  };

  // Close the modal
  const closeModal = () => {
    setPunchModalVisible(false);
    setClickedDate({
      selectedAttendance: null,
      selectedHoliday: null,
      selectedLeave: null,
    });
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
    }).format(new Date(date));
  };

  // Filter holidays based on current month and year
  const currentMonthHolidays = holidays.filter(
    (holiday) =>
      moment(holiday.date).month() === currentDate.month() &&
      moment(holiday.date).year() === currentDate.year()
  );

  // Toggle the modal visibility
  const toggleModal = () => {
    setTimeout(() => {
      setLeaveModalVisible(!isLeaveModalVisible);
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

      <View style={{ marginTop: 15, flex: 1 }}>
        {showAttendance ? (
          <>
            <Calendar
              markedDates={markedDates} // Marked Sundays, attendance, holidays, and leaves
              onMonthChange={onMonthChange} // Handle month change
              onDayPress={onDayPress} // Handle day press
              style={{
                borderRadius: 5,
                borderWidth: 2,
                borderColor: textColor,
              }}
            />

            <View style={{ marginTop: 20, flex: 1, minHeight: "47%" }}>
              {/* Display Holidays */}
              <Text
                style={[
                  styles.holiday_header,
                  {
                    color: textColor,
                    borderWidth: 2,
                    borderColor: textColor,
                  },
                ]}
              >
                Holidays for {currentDate.format("MMM YYYY")}
              </Text>

              <ScrollView>
                {currentMonthHolidays.length > 0 ? (
                  currentMonthHolidays.map((holiday, index) => (
                    <View
                      key={index}
                      style={[
                        styles.holiday_card,
                        {
                          backgroundColor: darkTheme
                            ? "#001f3f"
                            : Colors.dark.background,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        {formatDate(holiday.date)}
                        <Text style={{ fontSize: 13, color: "#D3D3D3" }}>
                          {" "}
                          for {holiday.name}
                        </Text>
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text
                    style={{
                      color: textColor,
                      fontSize: 16,
                      textAlign: "center",
                      marginTop: 10,
                    }}
                  >
                    No holidays in this month
                  </Text>
                )}
              </ScrollView>
            </View>
          </>
        ) : (
          <Leaves
            leaves={leaves}
            toggleModal={toggleModal}
            textColor={textColor}
            oppBgColor={oppBgColor}
            oppTextColor={oppTextColor}
            setLeaveModalId={setLeaveModalId}
            setShowLeaveDetailsModal={setShowLeaveDetailsModal}
          />
        )}
      </View>

      {/* Add Leave Modal */}
      {isLeaveModalVisible && (
        <ApplyLeave
          isVisible={isLeaveModalVisible}
          toggleModal={toggleModal}
          setLeaves={setLeaves}
        />
      )}

      {showLeaveDetailsModal && (
        <LeaveDetails
          leaveModalId={leaveModalId}
          isVisible={showLeaveDetailsModal}
          setShowLeaveDetailsModal={setShowLeaveDetailsModal}
        />
      )}

      {/* Date Detail Modal */}
      <PunchDetails
        isVisible={isPunchModalVisible}
        data={clickedDate}
        onClose={closeModal}
        textColor={textColor}
        bgColor={bgColor}
      />
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
  setLeaveModalId,
  setShowLeaveDetailsModal,
}: {
  leaves: any;
  textColor: string;
  toggleModal: any;
  oppBgColor: string;
  oppTextColor: string;
  setLeaveModalId: any;
  setShowLeaveDetailsModal: any;
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
            <Pressable
              key={leave.id}
              onPress={() => {
                setLeaveModalId(leave.id);
                setShowLeaveDetailsModal(true);
              }}
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
            </Pressable>
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
  flex_row_center: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flex_row_top: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  leaveCard: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
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
  holiday_card: {
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    marginBottom: 5,
  },
  holiday_header: {
    padding: 8,
    borderRadius: 25,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 10,
  },
});
