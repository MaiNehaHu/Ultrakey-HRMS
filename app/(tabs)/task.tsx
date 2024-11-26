import {
  Easing,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/contexts/AppTheme";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import TaskCard from "@/components/Cards/TaskCard";
import TaskDetails from "@/components/Modals/taskDetails";
import SelectMonthAndYear from "@/components/myApp/selectMonth&Year";

import months from "@/constants/months";
import years from "@/constants/years";
// import tasks from "@/constants/tasks";
import { useTasksContext } from "@/contexts/Tasks";
import taskStatus from "@/constants/taskStatus";

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

const TaskScreen = () => {
  const { darkTheme } = useAppTheme();
  const { tasksList } = useTasksContext();

  const navigation = useNavigation();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideModalAnim = useRef(new Animated.Value(200)).current; // Start position off-screen

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
    const selectedTask = tasksList.find(
      (task: any) => task.task_id === task_id
    );
    setClickedTask(selectedTask);
    handleOpenModal();
  };

  const filteredTasks = tasksList.filter((task: any) => {
    const createdAtDate = new Date(task.createdAt);
    const deadlineDate = new Date(task.deadline);
    const status = task.status;

    return (
      (createdAtDate.getFullYear() === pickerModalState.selectedYear &&
        createdAtDate.getMonth() === pickerModalState.selectedMonth) ||
      (deadlineDate.getFullYear() === pickerModalState.selectedYear &&
        deadlineDate.getMonth() === pickerModalState.selectedMonth) ||
      status === taskStatus.Overdue ||
      status === taskStatus.Ongoing
    );
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Animated.View
          style={{ transform: [{ scale: scaleAnim }], marginRight: 10 }}
        >
          {!darkTheme ? (
            <LinearGradient
              colors={["#1F366A", "#1A6FA8"]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => {
                  router.push({ pathname: "/addTask" });
                }}
              >
                <Text style={{ fontWeight: 500, color: "#fff" }}>Add Task</Text>
              </Pressable>
            </LinearGradient>
          ) : (
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => {
                router.push({ pathname: "/addTask" });
              }}
              style={[{ backgroundColor: Colors.lightBlue }, styles.gradient]}
            >
              <Text style={{ fontWeight: 500, color: "#fff" }}>Add Task</Text>
            </Pressable>
          )}
        </Animated.View>
      ),
    });
  }, [darkTheme]);

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

  const handleOpenModal = () => {
    setShowModal(true);
    Animated.timing(slideModalAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleCloseModal = () => {
    Animated.timing(slideModalAnim, {
      toValue: 700, // Slide back down
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
    });
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
            <Ionicons name="calendar" size={22} color={textColor} />
          </TouchableOpacity>
        </SafeAreaView>

        <SafeAreaView style={styles.cardsContainer}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task: any) => (
              <TaskCard
                key={task.task_id}
                task={task}
                handleModalDisplay={handleModalDisplay}
              />
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
            handleCloseModal={handleCloseModal}
            clickedTask={clickedTask}
            slideModalAnim={slideModalAnim}
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
    // gap: 14,
    display: "flex",
    marginTop: 15,
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
  gradient: {
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
});
