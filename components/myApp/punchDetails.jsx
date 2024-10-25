import React from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Pressable } from "react-native";
import moment from "moment";

const DateDetailModal = ({
  clickedDate,
  textColor,
}) => {
  const formattedFromDate = clickedDate?.selectedLeave?.from?.date
    ? moment(clickedDate.selectedLeave.from.date).format("MMM D, YYYY")
    : "N/A";

  const formattedToDate = clickedDate?.selectedLeave?.to?.date
    ? moment(clickedDate.selectedLeave.to.date).format("MMM D, YYYY")
    : "N/A";

  // Format punch time
  const formatTime = (date) => {
    return moment(date).format("h:mm A");
  };

  const formatWorkedHours = (workedMilliseconds) => {
    const totalMinutes = Math.floor(workedMilliseconds / (1000 * 60)); // Convert milliseconds to total minutes
    const hours = Math.floor(totalMinutes / 60); // Get hours
    const minutes = totalMinutes % 60; // Get remaining minutes
    return `${hours > 0 ? `${hours} hr${hours !== 1 ? 's' : ''}` : ""} ${minutes} min${minutes !== 1 ? 's' : ''}`;
  };

  // Format work hours
  const workHoursRecords = (from, to) => {
    if (from && to) {
      const workedMilliseconds = to - from;

      const formattedWorkedHours = formatWorkedHours(workedMilliseconds); // Convert milliseconds to readable format

      return (
        <View style={[styles.breakRecord, { flexDirection: 'column', alignItems: 'center', width: "100%" }]}>
          {/* Row for headings */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginBottom: 5 }}>
            <Text style={[styles.punchTableHeading, { color: textColor }]}>
              Worked for
            </Text>
            <Text style={[styles.punchTableHeading, { color: textColor }]}>
              Standard hours
            </Text>
          </View>
          {/* Row for times */}
          <View style={[styles.breakTableRow, { flexDirection: 'row', justifyContent: 'space-between', width: '90%' }]}>
            <Text style={[styles.punchTableTime, { color: textColor }]}>
              {formattedWorkedHours}
            </Text>
            <Text style={[styles.punchTableTime, { color: textColor }]}>
              9 hours
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };

  // Render punch records
  const renderPunchRecords = (punchRecords) => {
    if (punchRecords && punchRecords.length > 0) {
      const firstPunchIn = punchRecords[0]?.punchIn;
      const lastPunchOut = punchRecords[punchRecords.length - 1]?.punchOut || "~~"; // Handle undefined punchOut

      return (
        <View style={[styles.punchRecord, { flexDirection: 'column', alignItems: 'center' }]}>
          {/* Row for headings */}
          <View style={[styles.punchTableRow, { flexDirection: 'row', justifyContent: 'space-between', width: '100%' }]}>
            <Text style={[styles.punchTableHeading, { color: textColor }]}>
              First Punch In
            </Text>
            <Text style={[styles.punchTableHeading, { color: textColor }]}>
              Last Punch Out
            </Text>
          </View>
          {/* Row for times */}
          <View style={[styles.punchTableRow, { flexDirection: 'row', justifyContent: 'space-between', width: '100%' }]}>
            <Text style={[styles.punchTableTime, { color: textColor }]}>
              {formatTime(firstPunchIn)}
            </Text>
            <Text style={[styles.punchTableTime, { color: textColor }]}>
              {lastPunchOut !== "~~" ? formatTime(lastPunchOut) : "~~"}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };

  // Format break records
  const renderBreakRecords = (breakRecords) => {
    if (breakRecords && breakRecords.length > 0) {
      return breakRecords.map((breakRecord, index) => (
        <View key={index} style={[styles.breakRecord, { flexDirection: 'column', alignItems: 'center' }]}>
          {/* Row for times */}
          <View style={[styles.breakTableRow, { flexDirection: 'row', justifyContent: 'space-between', width: '100%' }]}>
            <Text style={[styles.punchTableTime, { color: textColor }]}>
              {formatTime(breakRecord.breakStartAt)}
            </Text>
            <Text style={[styles.punchTableTime, { color: textColor }]}>
              {formatTime(breakRecord.breakEndAt)}
            </Text>
          </View>
        </View>
      ));
    }
    return null;
  };

  // Calculate and render overtime or due time
  const renderOvertimeOrDueTime = (from, to) => {
    const nineHoursInMilliseconds = 9 * 60 * 60 * 1000; // 9 hours in milliseconds
    const workedMilliseconds = to - from;

    if (workedMilliseconds > nineHoursInMilliseconds) {
      const overtimeMilliseconds = workedMilliseconds - nineHoursInMilliseconds;
      return (
        <Text style={[styles.modalContent, { color: textColor }]}>
          Over Time: {formatWorkedHours(overtimeMilliseconds)}
        </Text>
      );
    } else {
      const dueTimeMilliseconds = nineHoursInMilliseconds - workedMilliseconds;
      return (
        <Text style={[styles.modalContent, { color: textColor }]}>
          Due Time: {formatWorkedHours(dueTimeMilliseconds)}
        </Text>
      );
    }
  };


  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 32, color: textColor, padding: 5, textAlign: 'center' }}>
        {clickedDate?.selectedAttendance?.percentage
          ? `${clickedDate.selectedAttendance.percentage}`
          : clickedDate?.selectedLeave?.noOfDays
            ? clickedDate.selectedLeave.noOfDays
            : moment(clickedDate?.clickedDate).format("MMM D")}

        {/**tag */}
        <Text style={{ fontSize: 12 }}>
          {clickedDate.selectedAttendance?.percentage ?
            " %"
            : clickedDate.selectedHoliday ?
              " Holiday"
              : clickedDate.selectedLeave ?
                " Day(s) Leave"
                : " Working day"}
        </Text>
      </Text>

      {clickedDate.selectedHoliday &&
        <Text style={[styles.modalContent, { color: textColor, textAlign: 'center', marginBottom: 15 }]}>
          {`${clickedDate.selectedHoliday?.name} ✨` || 'N/A'}
        </Text>
      }

      {clickedDate.selectedLeave &&
        <>
          <Text style={[styles.modalContent, { color: textColor, textAlign: 'center' }]}>
            From: {formattedFromDate} - Session {clickedDate.selectedLeave?.from.session}
          </Text>
          <Text style={[styles.modalContent, { color: textColor, textAlign: 'center', marginBottom: 10 }]}>
            To: {formattedToDate} - Session {clickedDate.selectedLeave?.to.session}
          </Text>
        </>
      }

      {clickedDate.selectedAttendance && (
        <View style={{ display: "flex", alignItems: "center" }}>
          {/* Render Overtime or Due Time */}
          {renderOvertimeOrDueTime(
            clickedDate.selectedAttendance?.punchRecords?.[0]?.punchIn,
            clickedDate.selectedAttendance?.punchRecords?.[clickedDate.selectedAttendance.punchRecords.length - 1]?.punchOut
          )}

          {/* Punch Records */}
          {renderPunchRecords(clickedDate.selectedAttendance?.punchRecords)}

          {/* Break Records */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginBottom: 5 }}>
            <Text style={[styles.punchTableHeading, { color: textColor }]}>Break Start</Text>
            <Text style={[styles.punchTableHeading, { color: textColor }]}>Break End</Text>
          </View>
          {renderBreakRecords(clickedDate.selectedAttendance?.breakRecords)}
        </View>
      )}

      {/* Work Hours */}
      {workHoursRecords(
        clickedDate.selectedAttendance?.punchRecords?.[0]?.punchIn,
        clickedDate.selectedAttendance?.punchRecords?.[clickedDate.selectedAttendance.punchRecords.length - 1]?.punchOut
      )}
    </View>
  );
};

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
});

export default DateDetailModal;
