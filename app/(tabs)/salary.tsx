import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";
import { useState } from "react";
import moment from "moment";

export default function Salary() {
  const { darkTheme } = useAppTheme();
  const [currentDate, setCurrentDate] = useState(moment());

  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const textColor = Colors[darkTheme ? "dark" : "light"].text;

  // Function to go to the previous month
  const handlePrevMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, "month"));
  };

  // Function to go to the next month
  const handleNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, "month"));
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.table}>
        {/* Row 1: Employee ID */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { color: textColor }]}>
            Employee ID:
          </Text>
          <Text style={[styles.tableCellValue, { color: textColor }]}>
            AKEY24015
          </Text>
        </View>

        {/* Row 2: CTC */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { color: textColor }]}>CTC:</Text>
          <Text style={[styles.tableCellValue, { color: textColor }]}>
            1.8 LPA
          </Text>
        </View>

        {/* Row 3: Per Month */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { color: textColor }]}>
            Per month:
          </Text>
          <Text style={[styles.tableCellValue, { color: textColor }]}>
            ₹15,000/-
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 20, backgroundColor: "transparent" }}>
        <View
          style={[
            styles.flex_row_center,
            {
              borderWidth: 2,
              borderColor: textColor,
              borderRadius: 25,
              backgroundColor: "transparent",
            },
          ]}
        >
          <TouchableOpacity onPress={handlePrevMonth}>
            <Text style={{ color: textColor, paddingHorizontal: 15 }}>
              Prev
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.header,
              {
                color: textColor,
                borderLeftColor: textColor,
                borderRightColor: textColor,
              },
            ]}
          >
              {currentDate.format("MMMM YYYY")}
          </Text>

          <TouchableOpacity onPress={handleNextMonth}>
            <Text style={{ color: textColor, paddingHorizontal: 15 }}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  table: {
    width: "100%",
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderBottomWidth: 0,
    backgroundColor: "transparent",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    borderBottomColor: "#ddd",
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  tableCell: {
    fontSize: 14,
    fontWeight: "400",
  },
  tableCellValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  header: {
    width:"50%",
    fontWeight: "500",
    paddingVertical: 8,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    textAlign: "center",
    paddingHorizontal: 15,
  },
  flex_row_center: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
