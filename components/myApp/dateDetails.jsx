import React from "react";
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import moment from "moment";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

const formatTime = (date) => moment(date).format("h:mm A");

const DateDetailModal = ({ clickedDate, textColor }) => {
  const formattedFromDate = clickedDate?.selectedLeave?.from?.date
    ? moment(clickedDate.selectedLeave.from.date).format("MMM D, YYYY")
    : "N/A";

  const formattedToDate = clickedDate?.selectedLeave?.to?.date
    ? moment(clickedDate.selectedLeave.to.date).format("MMM D, YYYY")
    : "N/A";

  const formatWorkedHours = (workedMilliseconds) => {
    const totalMinutes = Math.floor(workedMilliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours > 0 ? `${hours} hr${hours !== 1 ? 's' : ''}` : ""} ${minutes} min${minutes !== 1 ? 's' : ''}`;
  };

  const workHours = (from, to) => {
    if (from && to) {
      const workedMilliseconds = to - from;
      const formattedWorkedHours = formatWorkedHours(workedMilliseconds);

      return formattedWorkedHours;
    };
  }

  const workHoursRecordsCard = (from, to) => {
    if (from && to) {
      const workedMilliseconds = to - from;
      const formattedWorkedHours = formatWorkedHours(workedMilliseconds);

      return (
        <CardUI header={"Worked for"} data={formattedWorkedHours} />
      );
    }
    return null;
  };

  const renderPunchRecordsCard = (punchRecords) => {
    if (punchRecords && punchRecords.length > 0) {
      const firstPunchIn = punchRecords[0]?.punchIn;
      const lastPunchOut = punchRecords[punchRecords.length - 1]?.punchOut || "~~";

      return (
        <>
          <CardUI header={"First Punch In"} data={formatTime(firstPunchIn)} />
          <CardUI header={"Last Punch Out"} data={lastPunchOut} />
        </>
      );
    }
    return null;
  };

  const renderBreakRecords = (breakRecords) => {
    if (breakRecords && breakRecords.length > 0) {
      return breakRecords.map((breakRecord, index) => (
        <View key={index} style={[styles.breakRecord, { flexDirection: 'column', alignItems: 'center' }]}>
          <View style={[styles.breakTableRow, { flexDirection: 'row', justifyContent: 'space-between', width: '100%' }]}>
            <Text style={[styles.punchTableTime, { color: textColor }]}>{formatTime(breakRecord.breakStartAt)}</Text>
            <Text style={[styles.punchTableTime, { color: textColor }]}>{formatTime(breakRecord.breakEndAt)}</Text>
          </View>
        </View>
      ));
    }
    return null;
  };

  const renderOvertimeOrDueTimeCard = (from, to) => {
    const nineHoursInMilliseconds = 9 * 60 * 60 * 1000;
    const workedMilliseconds = to - from;

    if (workedMilliseconds > nineHoursInMilliseconds) {
      const overtimeMilliseconds = workedMilliseconds - nineHoursInMilliseconds;
      return <CardUI header={"Over Time"} data={formatWorkedHours(overtimeMilliseconds)} />;
    } else {
      const dueTimeMilliseconds = nineHoursInMilliseconds - workedMilliseconds;
      return <CardUI header={"Due Time"} data={formatWorkedHours(dueTimeMilliseconds)} />;
    }
  };

  const workPercentageCard = () => {
    return <CardUI header={"Work In Percent"} data={`${clickedDate.selectedAttendance?.percentage}%`} />
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: 500, color: textColor, textAlign: 'center', marginTop: 10, }}>
        {clickedDate?.selectedAttendance?.percentage
          ? `You Worked For` : clickedDate?.selectedLeave?.noOfDays
            ? `You are on leave for` : clickedDate.selectedHoliday
              ? " Holiday ✨" : "Working day"
        }
      </Text>

      <Text style={{ fontSize: 30, color: textColor, padding: 5, textAlign: 'center' }}>
        {clickedDate?.selectedAttendance?.punchRecords
          ? `${workHours(
            clickedDate.selectedAttendance?.punchRecords?.[0]?.punchIn,
            clickedDate.selectedAttendance?.punchRecords?.[clickedDate.selectedAttendance.punchRecords.length - 1]?.punchOut
          )}` : clickedDate?.selectedLeave?.noOfDays
            ? clickedDate.selectedLeave.noOfDays : clickedDate.selectedHoliday
              ? clickedDate.selectedHoliday?.name : ""
        }

        <Text style={{ fontSize: 12 }}>
          {clickedDate.selectedAttendance?.punchRecords
            ? "" : clickedDate.selectedHoliday
              ? "" : clickedDate.selectedLeave
                ? clickedDate.selectedLeave.noOfDays <= 1
                  ? " Day" : " Days" : "No data for now"
          }
        </Text>
      </Text>

      {clickedDate.selectedLeave && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10, }}>
          <View style={{ gap: 12, display: 'flex', flexDirection: 'row' }}>
            <CardUI header={"From"} data={`Session ${clickedDate.selectedLeave?.from.session} of ${formattedFromDate}`} />
            <CardUI header={"To"} data={`Session ${clickedDate.selectedLeave?.to.session} of ${formattedToDate}`} />
          </View>
        </ScrollView>
      )}

      {clickedDate.selectedAttendance && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10, }}>
          <View style={{ gap: 12, display: 'flex', flexDirection: 'row' }}>
            {/* Punch records */}
            {renderPunchRecordsCard(clickedDate.selectedAttendance?.punchRecords)}

            {/*  WOrked for in hours */}
            {/* {workHoursRecordsCard(
                clickedDate.selectedAttendance?.punchRecords?.[0]?.punchIn,
                clickedDate.selectedAttendance?.punchRecords?.[clickedDate.selectedAttendance.punchRecords.length - 1]?.punchOut
              )} */}

            {/* Over time or due time */}
            {renderOvertimeOrDueTimeCard(
              clickedDate.selectedAttendance?.punchRecords?.[0]?.punchIn,
              clickedDate.selectedAttendance?.punchRecords?.[clickedDate.selectedAttendance.punchRecords.length - 1]?.punchOut
            )}

            {workPercentageCard()}

            {/* Total working hours */}
            <CardUI header={"Standard Hours"} data={"9"} />

          </View>
          {/* {renderBreakRecords(clickedDate.selectedAttendance?.breakRecords)} */}
        </ScrollView>
      )}
    </View>
  );
};

const CardUI = ({ header, data }) => {
  const { darkTheme } = useAppTheme();
  const textColor = '#000';

  return (
    <SafeAreaView style={styles.cardContainer}>
      {
        !darkTheme ?
          <LinearGradient
            colors={['#1F366A', '#1A6FA8']}
            style={styles.duplicateCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          :
          <View
            style={[
              styles.duplicateCard,
              { backgroundColor: darkTheme ? Colors.lightBlue : Colors.light.border },
            ]}
          />
      }

      <View style={styles.cardStyle}>
        <Text style={{ color: Colors.lightBlue, fontSize: 12, fontWeight: 500, paddingHorizontal: 10, }}>{header}</Text>
        <Text style={{ color: textColor, fontSize: 16, fontWeight: 400 }}>{typeof data === "object" ? formatTime(data) : data}</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    color: "#333",
    textAlign: "center",
    marginBottom: 20
  },
  punchRecord: {
    marginBottom: 5,
    width: "90%"
  },
  breakRecord: {
    marginBottom: 5,
    width: "90%"
  },
  punchTableRow: {
    marginBottom: 5,
  },
  breakTableRow: {
    marginBottom: 5,
  },
  punchTableHeading: {
    fontSize: 16,
    fontWeight: "600",
  },
  punchTableTime: {
    fontSize: 14,
    fontWeight: '400',
  },
  cardContainer: {
    height: "75%", //modify
    marginTop: 10,
    position: "relative",
  },
  duplicateCard: {
    position: "absolute",
    top: -6,
    left: 0,
    right: 0,
    zIndex: -1,
    height: "100%",
    borderRadius: 20,
    // elevation: 5,
    // shadowRadius: 15,
    // shadowOpacity: 0.3,
    // shadowOffset: { width: 0, height: 4 },
  },
  cardStyle: {
    gap: 10,
    // flex: 1,
    padding: 12,
    height: "100%",
    display: "flex",
    borderRadius: 15,
    borderWidth: 0.5,
    borderTopWidth: 0,
    alignItems: 'center',
    borderColor: "#929394",
    backgroundColor: Colors.white,
  },
});

export default DateDetailModal;