import { ImageBackground, StyleSheet, Text, TextInput, View, TouchableOpacity, TouchableWithoutFeedback, FlatList, Keyboard, ScrollView, Pressable, Animated, ActivityIndicator, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import Colors from '../constants/Colors';
import { useAppTheme } from '../contexts/AppTheme';
import taskStatus from '../constants/taskStatus';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

import SelectProject from '../components/AddTask/SelectProject'
import SelectAssignee from '../components/AddTask/SelectAssignee'
import { formatDateInGB } from '../constants/formatDateInGB';
import { LinearGradient } from 'expo-linear-gradient';
import { useTasksContext } from '../contexts/Tasks';
import { useNavigation } from 'expo-router';

const backgroundImage = require('../assets/images/body_bg.png');

export default function AddTask() {
    const { darkTheme } = useAppTheme();
    const navigation = useNavigation();
    const { setTasksList } = useTasksContext();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const oppBgColor = Colors[!darkTheme ? "dark" : "light"].background;

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const [loading, setLoading] = useState(false)
    const [taskData, setTaskData] = useState({
        taskName: "",
        deadline: "",
        assigner: "Neha",
        assignee: [],
        description: "",
        // subTasks: [], //default
        // subTaskOf: { taskName: "", task_id: null },
        underProject: { projectName: "", project_id: null },
    });

    const projectList = [
        { projectName: "HRMS", project_id: 1 },
        { projectName: "Trending News Guru", project_id: 2 },
    ]

    const [showDatePicker, setShowDatePicker] = useState(false);

    function handleSaveTasks() {
        setLoading(true);

        if (taskData.taskName === "") {
            Alert.alert("No Task Name Provided", "Please provide a name to the task");
            setLoading(false);
            return;
        } else if (taskData.deadline == "") {
            Alert.alert("No Deadline Provided", "Please provide a deadline date to the task");
            setLoading(false);
            return;
        } else if (taskData.assignee.length <= 0) {
            Alert.alert("No Assignees Provided", "Please provide list of assignees for the task");
            setLoading(false);
            return;
        } else if (taskData.underProject.projectName == "") {
            Alert.alert("No Project Provided", "Please provide project for this task");
            setLoading(false);
            return;
        } else if (taskData.description == "") {
            Alert.alert("No Description Provided", "Please provide a description to the task");
            setLoading(false);
            return;
        }

        const newTask = {
            task_id: Date.now(), // Unique ID
            taskName: taskData.taskName,
            deadline: taskData.deadline,
            assigner: taskData.assigner,
            assignee: taskData.assignee,
            description: taskData.description,
            underProject: taskData.underProject,
            status: taskStatus.New, // default
            task_id: Math.random() * 100, // default
            createdAt: new Date().toISOString(), // default,,
        };

        setTimeout(() => {
            setTasksList((prev) => [newTask, ...prev]);
            setLoading(false);
            navigation.goBack();
        }, 500);
    }

    const handleInputChange = (field, value) => {
        setTaskData(prevData => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const isoDate = selectedDate.toISOString();
            handleInputChange("deadline", isoDate);
        }
    };

    const handleAssigneesUpdate = (selectedAssignees) => {
        setTaskData(prevData => ({
            ...prevData,
            assignee: selectedAssignees,
        }));
    };

    const handleProjectsUpdate = (selectedProjects) => {
        setTaskData(prevData => ({
            ...prevData,
            underProject: selectedProjects,
        }));
    };

    const handleDescriptionUpdate = (selectedProjects) => {
        setTaskData(prevData => ({
            ...prevData,
            description: selectedProjects,
        }));
    };

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
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
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
            }}
        >
            <View style={{ flex: 1, backgroundColor: bgColor, display: 'flex', justifyContent: 'space-between' }}>
                <ImageBackground source={backgroundImage} style={styles.bgImage} />

                <ScrollView keyboardShouldPersistTaps="handled" style={{ padding: 15, flex: 1, paddingBottom: 0 }}>
                    <Inputs
                        header="Task Name"
                        value={taskData.taskName}
                        placeholder="Start Working On ..."
                        onChangeText={(value) => handleInputChange("taskName", value)}
                    />

                    <Inputs
                        header="Deadline"
                        value={taskData.deadline ? formatDateInGB(taskData.deadline) : ""}
                        placeholder="Select Deadline"
                        isDatePicker
                        onPressIcon={() => setShowDatePicker(true)}
                    />

                    <Inputs
                        header="Assigner"
                        value={"Neha Kumari (You)"}
                        placeholder="Select Assigner"
                    />

                    <Inputs
                        header="Select Assignee"
                        placeholder="Select Assignees"
                        isAssigneeInput
                        onAssigneesUpdate={handleAssigneesUpdate}
                    />

                    <Inputs
                        header="Task Given Under Project"
                        projectList={projectList}
                        placeholder="Select Project"
                        isProjectInput
                        onProjectsUpdate={handleProjectsUpdate}
                    />

                    <Inputs
                        header="Description"
                        placeholder="Description for the task"
                        isDescription
                        onDescriptionUpdate={handleDescriptionUpdate}
                    />

                    {showDatePicker && (
                        <DateTimePicker
                            value={taskData.deadline ? new Date(taskData.deadline) : new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                </ScrollView>

                {/* Apply Button or Loader */}
                <Animated.View style={{ padding: 15, paddingTop: 5, transform: [{ scale: scaleAnim }] }}>
                    {!darkTheme ?
                        <LinearGradient
                            colors={['#1F366A', '#1A6FA8']}
                            style={styles.saveButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Pressable
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                onPress={handleSaveTasks}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color={bgColor} />
                                ) : (
                                    <Text style={[styles.saveButtonText, { color: bgColor }]}>Add Task</Text>
                                )}
                            </Pressable>
                        </LinearGradient>
                        :
                        <Pressable
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={handleSaveTasks}
                            style={[styles.saveButton, { backgroundColor: oppBgColor }]}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={bgColor} />
                            ) : (
                                <Text style={[styles.saveButtonText, { color: bgColor }]}>Add Task</Text>
                            )}
                        </Pressable>
                    }
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
}

function Inputs({
    header,
    value,
    onChangeText,
    placeholder,
    isDatePicker,
    onPressIcon,
    isAssigneeInput,
    isProjectInput,
    isDescription,
    onAssigneesUpdate,
    onProjectsUpdate,
    onDescriptionUpdate
}) {
    const { darkTheme } = useAppTheme();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;
    const logoColor = darkTheme ? Colors.white : Colors.lightBlue;

    return (
        <TouchableWithoutFeedback>
            <View style={{ padding: 5, marginBottom: 10 }}>
                <View style={[styles.cardContainer, { borderColor: textColor }]}>
                    <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>{header}</Text>

                    {isAssigneeInput ? (
                        <SelectAssignee onAssigneesUpdate={onAssigneesUpdate} />
                    ) :
                        isProjectInput ? (
                            <SelectProject placeholder={placeholder} onProjectsUpdate={onProjectsUpdate} />
                        ) : (
                            isDescription ? (
                                <View style={{ minHeight: 100 }}>
                                    <TextInput
                                        value={value}
                                        multiline
                                        numberOfLines={10}
                                        placeholder="Post Description"
                                        placeholderTextColor={textColor}
                                        onChangeText={(value) => onDescriptionUpdate(value)}
                                        style={[styles.textArea, { backgroundColor: bgColor, color: textColor, paddingVertical: 15 }]}
                                    />
                                </View>
                            ) : (
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={[styles.inputField, { color: textColor, borderColor: textColor, paddingVertical: 15 }]}
                                        placeholder={placeholder}
                                        value={value}
                                        onChangeText={onChangeText}
                                        placeholderTextColor={darkTheme ? "#e3e3e3" : "#666666"}
                                        editable={!isDatePicker}
                                    />

                                    {isDatePicker && (
                                        <TouchableOpacity onPress={onPressIcon}>
                                            <Ionicons name="calendar" size={24} color={logoColor} style={styles.icon} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )
                        )}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    bgImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover'
    },
    cardContainer: {
        borderWidth: 1,
        borderRadius: 10,
        position: 'relative',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    headerText: {
        top: -10,
        left: 10,
        fontSize: 12,
        fontWeight: '500',
        position: 'absolute',
        paddingHorizontal: 5,
    },
    inputWrapper: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    icon: {
        marginRight: 4,
    },
    inputField: {
        flex: 1,
    },
    textArea: {
        width: '100%',
        fontSize: 14,
        textAlignVertical: 'top',
    },
    saveButton: {
        padding: 10,
        borderRadius: 30,
        marginTop: 10,
    },
    saveButtonText: {
        textAlign: "center",
        fontWeight: 600,
        fontSize: 14
    },
});
