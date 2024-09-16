import React from "react";
import { Modal, StyleSheet, Text, View, Pressable, TouchableOpacity } from "react-native";
import moment from "moment";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

const DateDetailModal = ({
  isVisible,
  data,
  onClose,
  textColor,
  bgColor
}) => {
  // Format the date fields
  const formattedSelectedDate = moment(data.selectedAttendance?.date).format("MMM D, YYYY");
  const formattedFromDate = data.selectedLeave?.from?.date
    ? moment(data.selectedLeave.from.date).format("MMM D, YYYY")
    : 'N/A';
  const formattedToDate = data.selectedLeave?.to?.date
    ? moment(data.selectedLeave.to.date).format("MMM D, YYYY")
    : 'N/A';

  return (
    <Modal transparent={true} visible={isVisible} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer, { backgroundColor: bgColor }]}>
          {data && (
            <View style={
              [styles.flex_row_top,
              { borderBottomWidth: 1, borderColor: '#e0e0e0', paddingBottom: 8, marginBottom: 10 }]
            }>
              <>
                <Text style={{ color: textColor, fontSize: 16, fontWeight: 600 }}>
                  {formattedSelectedDate}
                </Text>

                <TouchableOpacity onPress={() => onClose(false)}>
                  <Text style={{ color: textColor }}>
                    <FontAwesome6Icon name='xmark' size={22} />
                  </Text>
                </TouchableOpacity>
              </>
            </View>
          )}

          <Text
            style={{ fontSize: 32, color: textColor, padding: 5, textAlign: 'center' }}
          >
            {data.selectedAttendance?.percentage
              ? data.selectedAttendance?.percentage
              : data.selectedLeave
                ? data.selectedLeave?.noOfDays
                : moment(data.selectedHoliday?.date).format("MMM D")
            }
            <Text style={{ fontSize: 12, }}>
              {data.selectedAttendance?.percentage ? " %" : data.selectedHoliday ? " Holiday" : data.selectedLeave ? " Day(s) Leave" : " Working day"}
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
        </View>
      </View>
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
  modalContainer: {
    gap: 10,
    width: '85%',
    padding: 15,
    borderRadius: 20,
    display: 'flex',
    borderRadius: 10,
    flexDirection: 'column',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 16,
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  flex_row_top: {
    display: "flex",
    width: '100%',
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
});

export default DateDetailModal;
