import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/contexts/AppTheme";
import { useLeavesContext } from "@/contexts/Leaves";
import PunchDetails from "@/components/myApp/punchDetails";

import holidays from "@/constants/holidaysList";

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
  const textColor = Colors[darkTheme ? "dark" : "light"].text;

  // Sample attendance data
  const attendace = [
    {
      date: "2024-09-19T00:00:00.857Z",
      percentage: 100,
      latePunchIn: 800,
      punchRecords: [
        {
          punchIn: "2024-09-19T09:39:00.857Z",
          punchOut: "2024-09-19T0018:09:00.857Z",
        },
        {
          punchIn: "2024-09-19T09:39:00.857Z",
          punchOut: "2024-09-19T0020:09:00.857Z",
        },
      ],
      breakRecords: [
        {
          breakStartAt: "2024-09-13T18:39:00.857Z",
          breakEndAt: "2024-09-13T09:39:00.857Z",
        },
        {
          breakStartAt: "2024-09-13T18:39:00.857Z",
          breakEndAt: "2024-09-13T09:39:00.857Z",
        },
      ],
    },
    {
      date: "2024-09-13T00:00:00.857Z",
      percentage: 60,
      latePunchIn: 800,
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
      const color = entry.percentage >= 100 ? "green" : "orange";
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
        marked: true,
        dotColor: "#2b79ff",
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
            // selectedColor: "red",
            marked: true,
            dotColor: "red", // Color for leaves
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
      ...sundays,
      ...attendanceMarks,
      ...leaveMarks,
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
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: oppBgColor,
      }}
    >
      <CalendarAndTexts
        textColor={textColor}
        darkTheme={darkTheme}
        markedDates={markedDates}
        onMonthChange={onMonthChange}
        onDayPress={onDayPress}
        clickedDate={clickedDate}
      />
    </ScrollView>
  );
};

export default CalendarScreen;

const CalendarAndTexts = ({
  textColor,
  darkTheme,
  markedDates,
  onMonthChange,
  onDayPress,
  clickedDate,
}: {
  textColor: string;
  darkTheme: boolean;
  markedDates: any;
  onMonthChange: any;
  onDayPress: any;
  clickedDate: any;
}) => {
  const oppBgColor = !darkTheme ? "#1e3669" : "#fff";
  const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;
  const bgColor = Colors[!darkTheme ? "dark" : "light"].background;

  const calendarStyles = {
    textDayFontSize: 16,
    textMonthFontSize: 20,
    textDisabledColor: "#e3e3e3",
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
    <SafeAreaView style={{ flex: 1, marginTop: 5 }}>
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
          styles.contextContainer,
          { backgroundColor: darkTheme ? Colors.darkBlue : Colors.white },
        ]}
      >
        {/* Display Holidays */}
        <Text
          style={[
            styles.date_header,
            {
              color: textColor,
              borderWidth: 2,
              borderColor: textColor,
            },
          ]}
        >
          {moment(clickedDate.clickedDate).format("DD MMMM, YYYY")}
        </Text>

        {/* Date Detail */}
        <PunchDetails clickedDate={clickedDate} textColor={textColor} />
      </View>
    </SafeAreaView>
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
    padding: 8,
    borderRadius: 25,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 5,
  },
  contextContainer: {
    flex: 1,
    padding: 20,
    marginTop: 10,
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
  },
});
