import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";
import { useRef, useState } from "react";
import moment from "moment";
import { shareAsync } from "expo-sharing";
import ViewShot from "react-native-view-shot";
import { FontAwesome6 } from "@expo/vector-icons";
import { printToFileAsync } from "expo-print";

export default function Salary() {
  const viewShotRef = useRef<ViewShot>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const { darkTheme } = useAppTheme();
  const [currentDate, setCurrentDate] = useState(moment());

  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const textColor = Colors[darkTheme ? "dark" : "light"].text;

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, "month"));
  };

  const handleShare = async () => {
    const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: ${bgColor}; color: ${textColor}; }
          .header { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; }
          .table { width: 100%; border-collapse: collapse; }
          .tableRow { border-bottom: 1px solid ${textColor}; }
          .tableCell { padding: 10px; }
          .tableCellValue { padding: 10px; }
        </style>
      </head>
      <body>
        <div class="header">Salary Details - ${currentDate.format(
          "MMMM YYYY"
        )}</div>
        <table class="table">
          <tr class="tableRow">
            <td class="tableCell">Employee Name:</td>
            <td class="tableCellValue">Neha Kumari</td>
          </tr>
          <tr class="tableRow">
            <td class="tableCell">Employee ID:</td>
            <td class="tableCellValue">AKEY24015</td>
          </tr>
          <!-- Add other rows here in a similar fashion -->
          <tr class="tableRow">
            <td class="tableCell">Total Pay:</td>
            <td class="tableCellValue">₹14050/-</td>
          </tr>
        </table>
      </body>
    </html>
  `;

    try {
      const file = await printToFileAsync({ html: htmlContent, base64: false });
      await shareAsync(file.uri);
    } catch (error) {
      console.error("Error sharing screenshot:", error);
    }
  };

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

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: bgColor, position: "relative" },
      ]}
    >
      <View style={{ backgroundColor: bgColor }}>
        <View
          style={[
            styles.flex_row_center,
            {
              margin: 15,
              borderWidth: 2,
              borderColor: textColor,
              borderRadius: 25,
              marginBottom: 0,
              backgroundColor: bgColor,
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

        {/* Table */}
        <ViewShot
          ref={viewShotRef}
          options={{ format: "jpg", quality: 1 }}
          style={{ width: "100%", padding: 15, backgroundColor: bgColor }}
        >
          <View
            style={[
              styles.table,
              {
                borderColor: textColor,
                backgroundColor: bgColor,
              },
            ]}
          >
            {/* Employee Details */}
            <View
              style={{
                borderColor: textColor,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: textColor,
                backgroundColor: bgColor,
              }}
            >
              <Text
                style={{
                  color: textColor,
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Employee Details
              </Text>
            </View>

            {/* Row 1: Employee ID */}
            <View
              style={[
                styles.tableRow,
                { backgroundColor: bgColor, borderColor: textColor },
              ]}
            >
              <Text style={[styles.tableCell, { color: textColor }]}>
                Employee Name:
              </Text>
              <Text style={[styles.tableCellValue, { color: textColor }]}>
                Neha Kumari
              </Text>
            </View>

            <View
              style={[
                styles.tableRow,
                { backgroundColor: bgColor, borderColor: textColor },
              ]}
            >
              <Text style={[styles.tableCell, { color: textColor }]}>
                Employee ID:
              </Text>
              <Text style={[styles.tableCellValue, { color: textColor }]}>
                AKEY24015
              </Text>
            </View>

            <View
              style={[
                styles.tableRow,
                { backgroundColor: bgColor, borderColor: textColor },
              ]}
            >
              <Text style={[styles.tableCell, { color: textColor }]}>
                Department:
              </Text>
              <Text style={[styles.tableCellValue, { color: textColor }]}>
                Software
              </Text>
            </View>

            <View
              style={[
                styles.tableRow,
                { backgroundColor: bgColor, borderColor: textColor },
              ]}
            >
              <Text style={[styles.tableCell, { color: textColor }]}>
                Designation:
              </Text>
              <Text style={[styles.tableCellValue, { color: textColor }]}>
                Android Developer
              </Text>
            </View>

            {/* Employer  */}
            <View
              style={[
                styles.tableRow,
                { backgroundColor: bgColor, borderColor: textColor },
              ]}
            >
              <Text style={[styles.tableCell, { color: textColor }]}>
                Employer Name:
              </Text>
              <Text style={[styles.tableCellValue, { color: textColor }]}>
                Ultrakey IT Solutions Pvt Ltd
              </Text>
            </View>

            {/* Bank Details */}
            <View
              style={{
                borderColor: textColor,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: textColor,
                backgroundColor: bgColor,
              }}
            >
              <Text
                style={{
                  color: textColor,
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Bank Details
              </Text>
            </View>

            {/* Bank Name */}
            <View
              style={[
                styles.tableRow,
                { backgroundColor: bgColor, borderColor: textColor },
              ]}
            >
              <Text style={[styles.tableCell, { color: textColor }]}>
                Bank Name:
              </Text>
              <Text style={[styles.tableCellValue, { color: textColor }]}>
                Union Bank Of India
              </Text>
            </View>

            {/* Account Number */}
            <View
              style={[
                styles.tableRow,
                { backgroundColor: bgColor, borderColor: textColor },
              ]}
            >
              <Text style={[styles.tableCell, { color: textColor }]}>
                Account Number:
              </Text>
              <Text style={[styles.tableCellValue, { color: textColor }]}>
                112233445566778899
              </Text>
            </View>

            {/* IFSC */}
            <View
              style={[
                styles.tableRow,
                { backgroundColor: bgColor, borderColor: textColor },
              ]}
            >
              <Text style={[styles.tableCell, { color: textColor }]}>
                IFSC Code:
              </Text>
              <Text style={[styles.tableCellValue, { color: textColor }]}>
                UBIN09799
              </Text>
            </View>

            {/* PAN */}
            <View
              style={[
                styles.tableRow,
                { backgroundColor: bgColor, borderColor: textColor },
              ]}
            >
              <Text style={[styles.tableCell, { color: textColor }]}>PAN:</Text>
              <Text style={[styles.tableCellValue, { color: textColor }]}>
                PKJL5678J
              </Text>
            </View>

            {/* Employee Details */}
            <View
              style={{
                borderColor: textColor,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: textColor,
                backgroundColor: bgColor,
              }}
            >
              <Text
                style={{
                  color: textColor,
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Salary Details
              </Text>
            </View>

            {/* Row 2: CTC */}
            <View
              style={[
                styles.tableRow,
                { backgroundColor: bgColor, borderColor: textColor },
              ]}
            >
              <Text style={[styles.tableCell, { color: textColor }]}>CTC:</Text>
              <Text style={[styles.tableCellValue, { color: textColor }]}>
                1.8 LPA
              </Text>
            </View>

            {/* Per Month */}
            <View
              style={[
                styles.tableRow,
                { backgroundColor: bgColor, borderColor: textColor },
              ]}
            >
              <Text style={[styles.tableCell, { color: textColor }]}>
                Gross Salary:
              </Text>
              <Text style={[styles.tableCellValue, { color: textColor }]}>
                ₹15,000/-
              </Text>
            </View>

            {/* Home Allowance */}
            <View
              style={[
                styles.tableRow,
                { backgroundColor: bgColor, borderColor: textColor },
              ]}
            >
              <Text style={[styles.tableCell, { color: textColor }]}>
                Home Allowance:
              </Text>
              <Text style={[styles.tableCellValue, { color: textColor }]}>
                11000
              </Text>
            </View>

            {/* Taxes */}
            <View
              style={[
                styles.tableRow,
                { backgroundColor: bgColor, borderColor: textColor },
              ]}
            >
              <Text style={[styles.tableCell, { color: textColor }]}>
                Tax Deduction:
              </Text>
              <Text style={[styles.tableCellValue, { color: textColor }]}>
                - 200
              </Text>
            </View>

            {/* Leaves deduction */}
            <View
              style={[
                styles.tableRow,
                { backgroundColor: bgColor, borderColor: textColor },
              ]}
            >
              <Text style={[styles.tableCell, { color: textColor }]}>
                Casual Leave for 1.5 days:
              </Text>
              <Text style={[styles.tableCellValue, { color: textColor }]}>
                - 750
              </Text>
            </View>

            {/* Leaves deduction */}
            <View
              style={[
                styles.tableRow,
                { backgroundColor: bgColor, borderColor: textColor },
              ]}
            >
              <Text style={[styles.tableCell, { color: textColor }]}>
                Health Insurance:
              </Text>
              <Text style={[styles.tableCellValue, { color: textColor }]}>
                - 0
              </Text>
            </View>

            {/* Total  */}
            <View
              style={[
                styles.tableRow,
                { backgroundColor: bgColor, borderColor: textColor },
              ]}
            >
              <Text style={[styles.tableCell, { color: textColor }]}>
                Total Pay:
              </Text>
              <Text style={[styles.tableCellValue, { color: textColor }]}>
                ₹14050/-
              </Text>
            </View>
          </View>
        </ViewShot>
      </View>

      <Animated.View
        style={{
          backgroundColor: bgColor,
          padding: 20,
          paddingTop: 0,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Pressable
          style={{
            backgroundColor: textColor,
            padding: 10,
            borderRadius: 100,
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => {
            setTimeout(() => {
              handleShare();
            }, 100);
          }}
        >
          <Text
            style={{
              color: bgColor,
              fontWeight: 600,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Share{"   "}
            <FontAwesome6
              name="share"
              size={18}
              style={{
                color: bgColor,
              }}
            />
          </Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 15,
  },
  table: {
    width: "100%",
    marginTop: 5,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
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
    width: "50%",
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
