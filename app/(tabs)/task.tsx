import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";
import TaskDetails from "@/components/Modals/taskDetails";
import { FontAwesome6 } from "@expo/vector-icons";
import SelectMonthAndYear from "@/components/myApp/selectMonth&Year";
import months from "@/constants/months";
import years from "@/constants/years";
import TaskCard from "@/components/Cards/TaskCard";

const backgroundImage = require("../../assets/images/body_bg.png");

interface Task {
  task_id: number;
  assignee: string;
  assigner: string;
  name: string;
  description: string;
  deadline: string;
  createdAt: string;
  status: string;
}

const tasks: Task[] = [
  {
    task_id: 1,
    assignee: "",
    assigner: "",
    name: "Ultrakey HRMS",
    description: "Create HRMS App for Ulytrakey IT Solutions.",
    deadline: "2024-11-20T09:00:00.000Z",
    createdAt: "2024-09-10T15:30:00.000Z",
    status: "Ongoing",
  },
  {
    task_id: 2,
    assignee: "",
    assigner: "",
    name: "Trending News Guru App",
    description:
      "Create Trending News Guru App for Ulytrakey IT Solutions. Hello, I hope you are doing good. Also, Owrk on Website with Java Backend and JavaScript on Frontend Create Trending News Guru App for Ulytrakey IT Solutions. Frontend Create Trending News Guru App for Ulytrakey IT Solutions. Create Trending News Guru App for Ulytrakey IT Solutions.",
    deadline: "2024-10-15T12:45:00.000Z",
    createdAt: "2024-09-13T09:00:00.000Z",
    status: "Completed",
  },
  {
    task_id: 3,
    assignee: "",
    assigner: "",
    name: "Ulytrakey CRM",
    description: "Create CRM for Ulytrakey IT Solutions.",
    deadline: "2024-09-30T18:00:00.000Z",
    createdAt: "2024-10-05T08:15:00.000Z",
    status: "Overdue",
  },
];

const TaskScreen = () => {
  const { darkTheme } = useAppTheme();
  const [showModal, setShowModal] = useState(false);
  const [clickedTask, setClickedTask] = useState<Task>();
  const [pickerModalState, setPickerModalState] = useState({
    tempYear: new Date().getFullYear(),
    selectedYear: new Date().getFullYear(),
    tempMonth: new Date().getMonth(),
    selectedMonth: new Date().getMonth(),
    showPickerMonthModal: false,
    showPickerYearModal: false,
  });

  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const textColor = Colors[darkTheme ? "dark" : "light"].text;

  const handleModalDisplay = (task_id: number) => {
    const selectedTask = tasks.find((task) => task.task_id === task_id);
    setClickedTask(selectedTask);
    setShowModal(true);
  };

  const onClose = () => {
    setShowModal(false);
  };

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
              <TaskCard key={task.task_id} task={task} handleModalDisplay={handleModalDisplay} />
            ))
          ) : (
            <Text
              style={{ color: textColor, textAlign: "center", marginTop: 30 }}
            >
              No tasks for this month.
            </Text>
          )}
        </SafeAreaView>

        {showModal && clickedTask && (
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
            setPickerModalState={setPickerModalState}
            clickedMonth={pickerModalState.tempMonth}
            clickedYear={pickerModalState.tempYear}
            isMonthVisible={pickerModalState.showPickerMonthModal}
            isYearVisible={pickerModalState.showPickerYearModal}
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
    marginVertical: 25,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  pickerContainer: {
    padding: 15,
    width: "80%",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  picker: {
    width: "100%",
  },
  confirmButton: {
    padding: 10,
    marginTop: 20,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.darkBlue,
  },
  flex_row_top: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
});
