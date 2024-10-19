import React from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Pressable } from "react-native";
import moment from "moment";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

const DateDetailModal = ({
  isVisible,
  data,
  onClose,
  textColor,
  bgColor,
}) => {
  // Format the date fields
  const formattedSelectedDate = data?.selectedAttendance?.date
    ? moment(data.selectedAttendance?.date).format("MMM D, YYYY")
    : moment(data?.clickedDate).format("MMM D, YYYY");

  const formattedFromDate = data?.selectedLeave?.from?.date
    ? moment(data.selectedLeave.from.date).format("MMM D, YYYY")
    : "N/A";

  const formattedToDate = data?.selectedLeave?.to?.date
    ? moment(data.selectedLeave.to.date).format("MMM D, YYYY")
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
      console.log(formatTime(from), formatTime(to));

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
        <Text style={[styles.modalContent, { color: textColor, textAlign: "center", marginBottom: 20 }]}>
          Over Time: {formatWorkedHours(overtimeMilliseconds)}
        </Text>
      );
    } else {
      const dueTimeMilliseconds = nineHoursInMilliseconds - workedMilliseconds;
      return (
        <Text style={[styles.modalContent, { color: textColor, textAlign: "center", marginBottom: 20 }]}>
          Due Time: {formatWorkedHours(dueTimeMilliseconds)}
        </Text>
      );
    }
  };


  return (
    <Modal transparent={true} visible={isVisible} animationType="none">
      <Pressable style={styles.modalBackground} onPress={() => onClose(false)}>
        <View style={styles.modalContainerWrapper}>
          <Pressable style={[styles.modalContainer, { backgroundColor: bgColor }]} onPress={(e) => e.stopPropagation()}>
            {data && (
              <View
                style={[styles.flex_row_top, {
                  borderBottomWidth: 1,
                  borderColor: "#e0e0e0",
                  paddingBottom: 8,
                  marginBottom: 10,
                }]}>
                <Text style={{ color: textColor, fontSize: 16, fontWeight: "600" }}>
                  {formattedSelectedDate}
                </Text>

                <TouchableOpacity onPress={() => onClose(false)}>
                  <Text style={{ color: textColor }}>
                    <FontAwesome6Icon name="xmark" size={22} />
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={{ fontSize: 32, color: textColor, padding: 5, textAlign: 'center' }}>
              {data?.selectedAttendance?.percentage
                ? `${data.selectedAttendance.percentage}`
                : data?.selectedLeave?.noOfDays
                  ? data.selectedLeave.noOfDays
                  : moment(data?.clickedDate).format("MMM D")}

              {/**tag */}
              <Text style={{ fontSize: 12 }}>
                {data.selectedAttendance?.percentage ?
                  " %"
                  : data.selectedHoliday ?
                    " Holiday"
                    : data.selectedLeave ?
                      " Day(s) Leave"
                      : " Working day"}
              </Text>
            </Text>

            {data.selectedHoliday &&
              <Text style={[styles.modalContent, { color: textColor, textAlign: 'center', marginBottom: 15 }]}>
                {`${data.selectedHoliday?.name} ✨` || 'N/A'}
              </Text>
            }

            {data.selectedLeave &&
              <>
                <Text style={[styles.modalContent, { color: textColor, textAlign: 'center' }]}>
                  From: {formattedFromDate} - Session {data.selectedLeave?.from.session}
                </Text>
                <Text style={[styles.modalContent, { color: textColor, textAlign: 'center', marginBottom: 10 }]}>
                  To: {formattedToDate} - Session {data.selectedLeave?.to.session}
                </Text>
              </>
            }

            {data.selectedAttendance && (
              <View style={{ display: "flex", alignItems: "center" }}>
                {/* Render Overtime or Due Time */}
                {renderOvertimeOrDueTime(
                  data.selectedAttendance?.punchRecords?.[0]?.punchIn,
                  data.selectedAttendance?.punchRecords?.[data.selectedAttendance.punchRecords.length - 1]?.punchOut
                )}

                {/* Punch Records */}
                {renderPunchRecords(data.selectedAttendance?.punchRecords)}

                {/* Break Records */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginBottom: 5 }}>
                  <Text style={[styles.punchTableHeading, { color: textColor }]}>Break Start</Text>
                  <Text style={[styles.punchTableHeading, { color: textColor }]}>Break End</Text>
                </View>
                {renderBreakRecords(data.selectedAttendance?.breakRecords)}
              </View>
            )}

            {/* Work Hours */}
            {workHoursRecords(
              data.selectedAttendance?.punchRecords?.[0]?.punchIn,
              data.selectedAttendance?.punchRecords?.[data.selectedAttendance.punchRecords.length - 1]?.punchOut
            )}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainerWrapper: {
    width: "85%",
  },
  modalContainer: {
    gap: 10,
    padding: 15,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
  },
  flex_row_top: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalContent: {
    fontSize: 16,
    color: "#333",
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
    marginBottom: 0,
  },
  punchTableHeading: {
    fontSize: 16,
    fontWeight: "600",
  },
  punchTableTime: {
    fontSize: 16,
    fontWeight: '400',
  },
});

export default DateDetailModal;
