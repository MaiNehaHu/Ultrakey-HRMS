import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import taskStatus from "@/constants/taskStatus";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/contexts/AppTheme";
import { LinearGradient } from "expo-linear-gradient";
type RootStackParamList = {
  task: undefined;
  holidaysList: undefined;
  leaves: undefined;
};

export default function OnGoingTasksCard() {
  const { darkTheme } = useAppTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const tasksList = [
    {
      task_id: 1,
      assignee: "",
      assigner: "",
      name: "Ultrakey HRMS",
      description: "Create HRMS App for Ulytrakey IT Solutions.",
      deadline: "2024-11-20T09:00:00.000Z", // November 20, 2024, 09:00 AM UTC
      createdAt: "2024-09-10T15:30:00.000Z", // September 10, 2024, 03:30 PM UTC
      status: "Ongoing",
    },
  ];

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  const filteredTasks = tasksList.filter(
    (task) =>
      (new Date(task.createdAt).toLocaleString("default", { month: "long" }) ===
        currentMonth &&
        new Date(task.createdAt).getFullYear() === currentYear) ||
      task.status === taskStatus.Ongoing ||
      task.status === taskStatus.Overdue
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <SafeAreaView style={styles.cardContainer}>
      {!darkTheme ? (
        <LinearGradient
          colors={["#1F366A", "#1A6FA8"]}
          style={styles.duplicateCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      ) : (
        <View
          style={[styles.duplicateCard, { backgroundColor: Colors.lightBlue }]}
        />
      )}

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
            Ongoing Tasks
          </Text>

          <Text
            style={{
              color: Colors.darkBlue,
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            {filteredTasks.length > 0 ? "Deadline by" : ""}
          </Text>
        </SafeAreaView>

        {/* Table */}
        <SafeAreaView>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <SafeAreaView key={task.createdAt} style={styles.flex_row}>
                <Text
                  style={{
                    width: "60%",
                    color: Colors.black,
                    overflow: "scroll",
                  }}
                >
                  {task.name}
                </Text>
                <Text style={{ color: Colors.black, maxWidth: "30%" }}>
                  {formatDate(task.createdAt)}
                </Text>
              </SafeAreaView>
            ))
          ) : (
            <Text style={{ color: Colors.black }}>No tasks assigned</Text>
          )}
        </SafeAreaView>

        <SafeAreaView>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => {
              navigation.navigate("task");
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
