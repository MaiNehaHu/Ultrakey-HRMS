import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useAppTheme } from "@/contexts/AppTheme";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import Colors from "@/constants/Colors";
import { useLeavesContext } from "@/contexts/Leaves";
import leaveStatus from "@/constants/leaveStatus";
type RootStackParamList = {
  task: undefined;
  holidaysList: undefined;
  leaves: undefined;
};

export default function LeavesRequestsCard() {
  const { darkTheme } = useAppTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { leaves } = useLeavesContext();

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  const filteredLeaves = leaves.filter(
    (leave: any) =>
      (new Date(leave.from.date).toLocaleString("default", {
        month: "long",
      }) === currentMonth &&
        new Date(leave.from.date).getFullYear() === currentYear) ||
      leave.status === leaveStatus.Pending
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      // year: "numeric",
    }).format(new Date(date));
  };

  return (
    <SafeAreaView style={styles.cardContainer}>
      <View
        style={[
          styles.duplicateCard,
          {
            backgroundColor: darkTheme ? Colors.lightBlue : Colors.light.border,
          },
        ]}
      />
      <View style={styles.cardStyle}>
        {/**Header */}
        <SafeAreaView style={styles.flex_row}>
          <Text
            style={{
              color: Colors.darkBlue,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Leave Requests
          </Text>

          <Text
            style={{
              color: Colors.darkBlue,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {filteredLeaves.length > 0 ? "Status" : ""}
          </Text>
        </SafeAreaView>

        {/* Table */}
        <SafeAreaView>
          {filteredLeaves.length > 0 ? (
            filteredLeaves.map((leave: any, index: number) => (
              <SafeAreaView key={index} style={styles.flex_row}>
                <Text
                  style={{
                    width: "60%",
                    color: Colors.black,
                    overflow: "scroll",
                  }}
                >
                  From {formatDate(leave.from.date)} for {leave.noOfDays}{" "}
                  {leave.noOfDays > 1 ? "days" : "day"}
                </Text>
                <Text style={{ color: Colors.black, maxWidth: "60%" }}>
                  {leave.status}
                </Text>
              </SafeAreaView>
            ))
          ) : (
            <Text style={{ color: Colors.black }}>No leave requests</Text>
          )}
        </SafeAreaView>

        <SafeAreaView>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => {
              navigation.navigate("leaves");
            }}
          >
            <Text style={styles.viewAllButtonText}>
              View All <FontAwesome6Icon name="arrow-right" />
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: "relative",
    // marginHorizontal: 10,
  },
  duplicateCard: {
    position: "absolute",
    top: -6,
    left: 0,
    right: 0,
    zIndex: -1,
    height: "100%",
    borderRadius: 20,
    elevation: 5,
    shadowRadius: 15,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  cardStyle: {
    display: "flex",
    gap: 5,
    padding: 12,
    borderRadius: 15,
    borderWidth: 0.5,
    borderTopWidth: 0,
    borderColor: "#929394",
    backgroundColor: Colors.white,
  },
  flex_row: {
    gap: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewAllButton: {
    marginTop: 5,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-end",
    backgroundColor: Colors.lightBlue,
  },
  viewAllButtonText: {
    color: Colors.white,
    textAlign: "right",
    fontWeight: "500",
    fontSize: 10,
  },
});
