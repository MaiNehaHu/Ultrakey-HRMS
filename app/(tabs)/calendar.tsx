import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/contexts/AppTheme";
import { useLeavesContext } from "@/contexts/Leaves";
import DateDetails from "@/components/myApp/dateDetails";

import attendace from "@/constants/attendace";
import holidays from "@/constants/holidaysList";
import calendarColors from "@/constants/calendarColors";
import { LinearGradient } from "expo-linear-gradient";

interface LeaveSession {
  date: string;
  session: string;
}

interface AttendanceSession {
  date: Date;
  percentage: number;
  latePunchIn: number;
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
  clickedDate: Date | null;
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
  const [currentDate, setCurrentDate] = useState(moment());
  const [clickedDate, setClickedDate] = useState<ClickedDate>({
    selectedAttendance: null,
    selectedHoliday: null,
    selectedLeave: null,
    clickedDate: new Date(),
  });

  const { darkTheme } = useAppTheme();
  const { leaves } = useLeavesContext();

  const oppBgColor = Colors[!darkTheme ? "dark" : "light"].background;

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
          selectedColor: "#666666",
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
      const color = entry.percentage >= 95 ? "#3f8a53" : "#e68f73";
      attendanceMarked[date] = {
        selected: true,
        selectedColor: color,
        marked: entry.isRegularized,
        dotColor: "#e68f73",
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
        marked: true,
        dotColor: "#fcba03",
        // selected: true,
        // selectedColor: "#ff752b",
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
        marked: true,
        dotColor: "#2b79ff",
        // selected: true,
        // selectedColor: "#ff752b", // Color for 4th Saturday
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
            // selected: true,
            // selectedColor: "#ff3838",
            marked: true,
            dotColor: "#ff3838", // Color for leaves
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
            marked: true,
            dotColor: "#2b79ff",
            // selected: true,
            // selectedColor: "navy", // Color for 4th Saturday
          };
        }
      }
    }
    return marked;
  };

  const markedDates = useMemo(() => {
    const sundays = markSundays(currentDate.month() + 1, currentDate.year());
    const attendanceMarks = markAttendance();
    const leaveMarks = markLeaves();
    const holidayMarks = markHolidays();

    return {
      ...attendanceMarks,
      ...leaveMarks,
      ...sundays,
      ...holidayMarks,
    };
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
      clickedDate: date,
      selectedAttendance: attendance
        ? {
            date: new Date(attendance.date),
            percentage: attendance.percentage,
            latePunchIn: attendance.latePunchIn,
            // earlyPunchIn: attendance.earlyPunchIn,
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
        ? { date, name: "Week Off" }
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
  };

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: oppBgColor,
      }}
    >
      {/* <ScrollView> */}
      <CalendarAndDetails
        darkTheme={darkTheme}
        markedDates={markedDates}
        clickedDate={clickedDate}
        onDayPress={onDayPress}
        onMonthChange={onMonthChange}
      />
      {/* </ScrollView> */}
    </View>
  );
};

export default CalendarScreen;

const CalendarAndDetails = ({
  darkTheme,
  markedDates,
  onMonthChange,
  onDayPress,
  clickedDate,
}: {
  darkTheme: boolean;
  markedDates: any;
  onMonthChange: any;
  onDayPress: any;
  clickedDate: any;
}) => {
  const textColor = Colors[darkTheme ? "dark" : "light"].text;
  const oppBgColor = !darkTheme ? "#1e3669" : "#fff";
  const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;
  const bgColor = Colors[!darkTheme ? "dark" : "light"].background;

  const calendarStyles = {
    textDayFontSize: 16,
    textMonthFontSize: 20,
    textDisabledColor: "#949494",
    arrowColor: oppTextColor,
    dayTextColor: oppTextColor,
    monthTextColor: oppTextColor,
    indicatorColor: oppTextColor,
    textSectionTitleColor: oppTextColor,
    backgroundColor: bgColor,
    calendarBackground: bgColor,
    textDayFontWeight: "600",
    todayTextColor: darkTheme ? "#2f00ff" : "#2fff00",
  };

  return (
    <>
      <Calendar
        theme={calendarStyles}
        onDayPress={onDayPress}
        onMonthChange={onMonthChange}
        key={darkTheme ? "dark" : "light"}
        style={{ backgroundColor: oppBgColor }}
        markedDates={markedDates} // Your marked dates for Sundays, attendance, holidays, etc.
      />

      <View
        style={[
          styles.detailsContainer,
          { backgroundColor: darkTheme ? Colors.darkBlue : Colors.white },
        ]}
      >
        {/* Color code */}
        <CalendarColorsList />

        {/* Display Holidays */}
        <LinearGradient
          colors={!darkTheme ? ["#1F366A", "#1A6FA8"] : ["#fff", "#fff"]}
          style={{ borderRadius: 30, marginBottom: 5 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text
            style={[
              styles.date_header,
              {
                color: oppTextColor,
              },
            ]}
          >
            {moment(clickedDate.clickedDate).format("DD MMMM, YYYY")}
          </Text>
        </LinearGradient>

        {/* Date Detail */}
        <DateDetails clickedDate={clickedDate} textColor={textColor} />
      </View>
    </>
  );
};

const CalendarColorsList = () => {
  const { darkTheme } = useAppTheme();
  const textColor = Colors[darkTheme ? "dark" : "light"].text;
  // Convert calendarColors object to an array of items for rendering
  const calendarData = Object.entries(calendarColors).map(
    ([status, color]) => ({
      status,
      color,
    })
  );

  return (
    <View style={{ marginBottom: 20 }}>
      <SafeAreaView style={styles.display_flex}>
        {calendarData.map((item) => (
          <View key={item.status} style={styles.itemContainer}>
            <View
              style={[styles.circle, { backgroundColor: item.color }]}
            ></View>
            <Text style={{ fontSize: 11, color: textColor }}>
              {item.status}
            </Text>
          </View>
        ))}
      </SafeAreaView>
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
    paddingVertical: 4,
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
  date_header: {
    padding: 10,
    borderRadius: 25,
    textAlign: "center",
    fontWeight: "500",
    // marginBottom: 5,
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
    marginTop: 20,
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
  },
  itemContainer: {
    width: "33%",
    paddingVertical: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 15,
    marginRight: 10,
    display: "flex",
    justifyContent: "center",
  },
  display_flex: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
