import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import DatePicker from "react-native-date-picker";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";
import TaskDetails from "../taskDetails";
import { FontAwesome6 } from "@expo/vector-icons";

const backgroundImage = require("../../assets/images/body_bg.png");

interface Task {
  task_id: number;
  assignee: string;
  assigner: string;
  name: string;
  description: string;
  deadline: string;
  status: string;
}

const tasks = [
  {
    task_id: 1,
    assignee: "",
    assigner: "",
    name: "Ultrakey HRMS",
    description: "Create HRMS App for Ulytrakey IT Solutions.",
    deadline: "2024-09-13T09:39:00.857Z",
    status: "Ongoing",
  },
  {
    task_id: 2,
    assignee: "",
    assigner: "",
    name: "Trending News Guru App",
    description: "Create Trending News Guru App for Ulytrakey IT Solutions.",
    deadline: "2024-10-13T09:39:00.857Z",
    status: "Completed",
  },
  {
    task_id: 3,
    assignee: "",
    assigner: "",
    name: "Ulytrakey CRM",
    description: "Create CRM for Ulytrakey IT Solutions.",
    deadline: "2024-11-13T09:39:00.857Z",
    status: "Overdue",
  },
  // Add more tasks
];

const taskStatus = {
  Ongoing: "Ongoing",
  Completed: "Completed",
  Deferred: "Deferred",
  Overdue: "Overdue",
};

const TaskScreen = () => {
  const { darkTheme } = useAppTheme();
  const [showModal, setShowModal] = useState(false);
  const [clickedTask, setClickedTask] = useState<Task>();
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const textColor = Colors[darkTheme ? "dark" : "light"].text;

  const handleModalDisplay = (task_id: number) => {
    const clickedTask = tasks.find((task) => task.task_id == task_id);
    setClickedTask(clickedTask);
    setShowModal(true);
  };

  const onClose = () => {
    setShowModal(false);
  };

  const formatDate = (date: any) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  // Filter tasks by selected month
  const filteredTasks = tasks.filter((task) => {
    const taskDate = new Date(task.deadline);
    return (
      taskDate.getFullYear() === selectedMonth.getFullYear() &&
      taskDate.getMonth() === selectedMonth.getMonth()
    );
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <ImageBackground source={backgroundImage} style={styles.backImage} />

      <ScrollView style={{ padding: 15 }}>
        <SafeAreaView style={styles.flex_row_top}>
          <Text
            style={{
              color: textColor,
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            Tasks for{" "}
            {selectedMonth.toLocaleString("default", { month: "long" })}
          </Text>

          <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
            <FontAwesome6 name="calendar-alt" size={22} color={textColor} />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Month Picker */}
        <DatePicker
          modal
          mode="date"
          open={openDatePicker}
          date={selectedMonth}
          title="Select Month"
          confirmText="Confirm"
          cancelText="Cancel"
          onConfirm={(date: Date) => {
            setSelectedMonth(date);
            setOpenDatePicker(false);
          }}
          onCancel={() => {
            setOpenDatePicker(false);
          }}
        />

        {/* List of Filtered Tasks */}
        <SafeAreaView style={styles.cardsContainer}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Pressable
                key={task.task_id}
                onPress={() => handleModalDisplay(task.task_id)}
              >
                <View
                  style={[
                    styles.duplicateTaskCard,
                    {
                      backgroundColor:
                        task.status === taskStatus.Ongoing
                          ? "orange"
                          : task.status === taskStatus.Completed
                          ? Colors.lightBlue
                          : task.status === taskStatus.Deferred
                          ? Colors.lightBlue
                          : "red",
                    },
                  ]}
                />
                <View key={task.name} style={styles.taskCard}>
                  <View style={styles.flex_row_top}>
                    <Text
                      style={{
                        width: "70%",
                        fontSize: 16,
                        fontWeight: "500",
                        color: Colors.darkBlue,
                      }}
                    >
                      {task.name}
                    </Text>

                    <Text
                      style={[
                        styles.status,
                        {
                          backgroundColor:
                            task.status === taskStatus.Ongoing
                              ? "orange"
                              : task.status === taskStatus.Completed
                              ? Colors.lightBlue
                              : task.status === taskStatus.Deferred
                              ? Colors.lightBlue
                              : "red",
                        },
                      ]}
                    >
                      {task.status}
                    </Text>
                  </View>
                  <Text style={{ color: "#000" }}>
                    Deadline: {formatDate(task.deadline)}
                  </Text>
                </View>
              </Pressable>
            ))
          ) : (
            <Text
              style={{ color: textColor, textAlign: "center", marginTop: 30 }}
            >
              No tasks for this month.
            </Text>
          )}
        </SafeAreaView>

        {showModal && (
          <TaskDetails
            isVisible={showModal}
            onClose={onClose}
            clickedTask={clickedTask}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
  backImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  cardsContainer: {
    gap: 20,
    display: "flex",
    marginVertical: 30,
  },
  taskCard: {
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    display: "flex",
    borderWidth: 0.5,
    borderColor: "#D4D4D4",
    backgroundColor: Colors.white,
  },
  duplicateTaskCard: {
    position: "absolute",
    top: -7,
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
  status: {
    color: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 12,
    borderRadius: 20,
    textAlign: "center",
    fontWeight: "500",
  },
  flex_row_top: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
});
