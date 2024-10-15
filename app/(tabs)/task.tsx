import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";
import TaskDetails from "../taskDetails";

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
    deadline: "2024-09-13T09:39:00.857Z",
    status: "Completed",
  },
];

const taskStatus = {
  Ongoing: "Ongoing",
  Completed: "Completed",
  Deferred: "Deferred",
  Overdue: "Overdue",
};

const task = () => {
  const { darkTheme } = useAppTheme();
  const [showModal, setShowModal] = useState(false);
  const [clickedTask, setClickedTask] = useState<Task>();

  const bgColor = Colors[darkTheme ? "dark" : "light"].background;

  function handleModalDisplay(task_id: number) {
    const taskList = [...tasks];
    const clickedTask = taskList.find((task) => task.task_id == task_id);
    setClickedTask(clickedTask);
    setShowModal(true);
  }

  function onClose() {
    setShowModal(false);
  }

  const formatDate = (date: any) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit", // Day as 2 digits (DD)
      month: "short", // Month as short name (MMM)
      hour: "2-digit", // Hour as 2 digits (HH)
      minute: "2-digit", // Minute as 2 digits (MM)
      hour12: true, // 12-hour format with AM/PM
    }).format(new Date(date));
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: bgColor, padding: 15 }}>
      {tasks.map((task) => (
        <Pressable
          key={task.name}
          onPress={() => handleModalDisplay(task.task_id)}
        >
          <View
            key={task.name}
            style={[
              styles.task,
              {
                backgroundColor: darkTheme ? "#001f3f" : Colors.dark.background,
              },
            ]}
          >
            <View style={styles.flex_row_top}>
              <Text
                style={{
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: 16,
                  width: "70%",
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
                        ? "green"
                        : task.status === taskStatus.Deferred
                        ? "blue"
                        : "red",
                  },
                ]}
              >
                {task.status}
              </Text>
            </View>
            <Text style={{ color: "#fff" }}>
              Deadline: {formatDate(task.deadline)}
            </Text>
          </View>
        </Pressable>
      ))}

      {showModal && (
        <TaskDetails
          isVisible={showModal}
          onClose={onClose}
          clickedTask={clickedTask}
        />
      )}
    </ScrollView>
  );
};

export default task;

const styles = StyleSheet.create({
  task: {
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  status: {
    color: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 12,
    borderRadius: 20,
    textAlign: "center",
    fontWeight: 500,
  },
  flex_row_top: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
});
