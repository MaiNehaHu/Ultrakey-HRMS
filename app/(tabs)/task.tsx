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
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";
import TaskDetails from "../taskDetails";
import { FontAwesome6 } from "@expo/vector-icons";
import SelectMonthAndYear from "@/components/myApp/selectMonth&Year";

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
    deadline: "2024-11-20T09:00:00.000Z", // November 20, 2024, 09:00 AM UTC
    createdAt: "2024-09-10T15:30:00.000Z", // September 10, 2024, 03:30 PM UTC
    status: "Ongoing",
  },
  {
    task_id: 2,
    assignee: "",
    assigner: "",
    name: "Trending News Guru App",
    description: "Create Trending News Guru App for Ulytrakey IT Solutions.",
    deadline: "2024-10-15T12:45:00.000Z", // October 15, 2024, 12:45 PM UTC
    createdAt: "2024-09-13T09:00:00.000Z", // September 13, 2024, 09:00 AM UTC
    status: "Completed",
  },
  {
    task_id: 3,
    assignee: "",
    assigner: "",
    name: "Ulytrakey CRM",
    description: "Create CRM for Ulytrakey IT Solutions.",
    deadline: "2024-09-30T18:00:00.000Z", // September 30, 2024, 06:00 PM UTC
    createdAt: "2024-10-05T08:15:00.000Z", // October 5, 2024, 08:15 AM UTC
    status: "Overdue",
  },
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
  const [pickerModalState, setPickerModalState] = useState({
    tempYear: 2024,
    selectedYear: 2024,
    tempMonth: new Date().getMonth(),
    selectedMonth: new Date().getMonth(),
    showPickerMonthModal: false,
    showPickerYearModal: false,
  });

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

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const filteredTasks = tasks.filter((task) => {
    const createdAtDate = new Date(task.createdAt);
    const deadlineDate = new Date(task.deadline);

    return (
      (createdAtDate.getFullYear() === pickerModalState.selectedYear &&
        createdAtDate.getMonth() === pickerModalState.selectedMonth) ||
      (deadlineDate.getFullYear() === pickerModalState.selectedYear &&
        deadlineDate.getMonth() === pickerModalState.selectedMonth)
    );
  });

  const handleMonthYearSelection = () => {
    setPickerModalState((prevState) => ({
      ...prevState,
      selectedMonth: prevState.tempMonth,
      selectedYear: prevState.tempYear,
    }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <ImageBackground source={backgroundImage} style={styles.backImage} />

      <ScrollView style={{ padding: 15 }}>
        <SafeAreaView style={styles.flex_row_top}>
          <Text style={{ color: textColor, fontSize: 16, fontWeight: "500" }}>
            Tasks for {months[pickerModalState.selectedMonth]}{" "}
            {pickerModalState.selectedYear}
          </Text>

          <TouchableOpacity
            onPress={() =>
              setPickerModalState((prevState) => ({
                ...prevState,
                showPickerMonthModal: true,
              }))
            }
          >
            <FontAwesome6 name="calendar-alt" size={22} color={textColor} />
          </TouchableOpacity>
        </SafeAreaView>

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
                <View style={styles.taskCard}>
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
                    Created: {formatDate(task.deadline)}
                  </Text>

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

        {(pickerModalState.showPickerMonthModal ||
          pickerModalState.showPickerYearModal) && (
          <SelectMonthAndYear
            months={months}
            years={years}
            clickedMonth={pickerModalState.tempMonth}
            clickedYear={pickerModalState.tempYear}
            isMonthVisible={pickerModalState.showPickerMonthModal}
            isYearVisible={pickerModalState.showPickerYearModal}
            setClickedMonth={(month: number) =>
              setPickerModalState((prevState) => ({
                ...prevState,
                tempMonth: month,
              }))
            }
            setClickedYear={(year: number) =>
              setPickerModalState((prevState) => ({
                ...prevState,
                tempYear: year,
              }))
            }
            onClose={() =>
              setPickerModalState((prevState) => ({
                ...prevState,
                showPickerMonthModal: false,
                showPickerYearModal: false,
              }))
            }
            onDone={() => {
              handleMonthYearSelection();
              setPickerModalState((prevState) => ({
                ...prevState,
                showPickerMonthModal: false,
                showPickerYearModal: false,
              }));
            }}
            onNext={() =>
              setPickerModalState((prevState) => ({
                ...prevState,
                showPickerYearModal: true,
                showPickerMonthModal: false,
              }))
            }
            onBack={() => {
              setPickerModalState((prevState) => ({
                ...prevState,
                showPickerYearModal: false,
                showPickerMonthModal: true,
              }));
            }}
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  picker: {
    width: "100%",
  },
  confirmButton: {
    backgroundColor: Colors.darkBlue,
    padding: 10,
    marginTop: 20,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
});
