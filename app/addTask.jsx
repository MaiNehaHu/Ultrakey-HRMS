import { ImageBackground, StyleSheet, Text, TextInput, View, TouchableOpacity, TouchableWithoutFeedback, FlatList, Keyboard } from 'react-native';
import React, { useState } from 'react';
import Colors from '../constants/Colors';
import { useAppTheme } from '../contexts/AppTheme';
import taskStatus from '../constants/taskStatus';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

import { formatDateInGB } from '../constants/formatDateInGB'
const backgroundImage = require('../assets/images/body_bg.png');

export default function AddTask() {
    const { darkTheme } = useAppTheme();
    const bgColor = Colors[darkTheme ? "dark" : "light"].background;

    const [taskData, setTaskData] = useState({
        taskName: "",
        deadline: "",
        subTasks: [],
        assigner: "Neha",
        assignee: [],
        description: "",
        status: taskStatus.New,
        task_id: Math.random() * 100,
        createdAt: new Date().toISOString(),
        subTaskOf: { taskName: "", task_id: 1 },
        underProject: { projectName: "", project_id: 1 },
    });

    const assigneeList = [
        { name: "Neha", id: 1 },
        { name: "Srivani Kodimyala from Karimnagar", id: 2 },
        { name: "Arun", id: 3 },
        { name: "Bheem", id: 4 },
    ];

    const [showDatePicker, setShowDatePicker] = useState(false);

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

    let hideAssigneeListRef;

    const handleHideAssigneeList = (hideFunction) => {
        hideAssigneeListRef = hideFunction;
    };

    const hideAssigneeListFromParent = () => {
        if (hideAssigneeListRef) {
            hideAssigneeListRef();
        }
    };

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
                hideAssigneeListFromParent();
            }}>
            <View style={{ flex: 1, backgroundColor: bgColor }}>
                <ImageBackground source={backgroundImage} style={styles.bgImage} />

                <View style={{ padding: 15, flex: 1, paddingBottom: 0 }}>
                    <Inputs
                        header="Task Name"
                        value={taskData.taskName}
                        placeholder="Start Working on ..."
                        onChangeText={(value) => handleInputChange("taskName", value)}
                    />

                    <Inputs
                        header="Deadline"
                        value={taskData.deadline ? formatDateInGB(taskData.deadline) : ""}
                        placeholder="Select deadline"
                        isDatePicker
                        onPressIcon={() => setShowDatePicker(true)}
                    />

                    <Inputs
                        header="Select Assignee"
                        value={taskData.assignee}
                        assigneeList={assigneeList}
                        placeholder="Select assignees"
                        isAssigneeInput
                        onAssigneesUpdate={handleAssigneesUpdate}
                        hideAssigneeList={handleHideAssigneeList}
                    />

                    {showDatePicker && (
                        <DateTimePicker
                            value={taskData.deadline ? new Date(taskData.deadline) : new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                </View>
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
    assigneeList,
    onAssigneesUpdate,
    hideAssigneeList
}) {
    const { darkTheme } = useAppTheme();
    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;

    const [assigneeInput, setAssigneeInput] = useState("");
    const [showAssigneeList, setShowAssigneeList] = useState(false);
    const [filteredAssignees, setFilteredAssignees] = useState(assigneeList);
    const [selectedAssignees, setSelectedAssignees] = useState(value || []);
    const [assigneeInputHeight, setAssigneeInputHeight] = useState(0);

    const handleAssigneeSearch = (input) => {
        setAssigneeInput(input);
        setFilteredAssignees(
            assigneeList.filter((assignee) =>
                assignee.name.toLowerCase().includes(input.toLowerCase())
            )
        );
    };

    const handleAddAssignee = (assignee) => {
        if (!selectedAssignees.some(selected => selected.id === assignee.id)) {
            const updatedAssignees = [...selectedAssignees, assignee];
            setSelectedAssignees(updatedAssignees);
            onAssigneesUpdate(updatedAssignees);
        }
        setAssigneeInput("");
        setShowAssigneeList(false);
    };

    const handleRemoveAssignee = (assigneeId) => {
        const updatedAssignees = selectedAssignees.filter(a => a.id !== assigneeId);
        setSelectedAssignees(updatedAssignees);
        onAssigneesUpdate(updatedAssignees);
    };

    // Function to hide assignee list
    const closeAssigneeList = () => {
        setShowAssigneeList(false);
    };

    // Call the hideAssigneeList prop function if provided by the parent
    React.useEffect(() => {
        if (hideAssigneeList) {
            hideAssigneeList(closeAssigneeList);
        }
    }, [hideAssigneeList]);

    return (
        <TouchableWithoutFeedback onPress={closeAssigneeList}>
            <View style={{ padding: 5, marginBottom: 10 }}>
                <View style={[styles.cardContainer, { borderColor: textColor }]}>
                    <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>{header}</Text>

                    <View
                        style={styles.inputWrapper}
                        onLayout={(event) => {
                            const { height } = event.nativeEvent.layout;
                            setAssigneeInputHeight(height);
                        }}
                    >
                        {isAssigneeInput ? (
                            <>
                                <View style={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                                    {selectedAssignees.map((assignee) => (
                                        <View key={assignee.id} style={styles.assigneeTag}>
                                            <Text style={styles.assigneeText}>{assignee.name}</Text>
                                            <TouchableOpacity onPress={() => handleRemoveAssignee(assignee.id)}>
                                                <Ionicons name="close-circle" size={18} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}

                                    <TouchableOpacity onPress={() => setShowAssigneeList(true)}>
                                        <Text style={{ color: 'gray', padding: 5 }}>{placeholder}</Text>
                                    </TouchableOpacity>
                                </View>

                                <TextInput
                                    style={[
                                        styles.inputField,
                                        {
                                            color: textColor,
                                            borderColor: textColor,
                                            flexGrow: 1,
                                            minWidth: 100,
                                            maxWidth: '100%'
                                        }
                                    ]}
                                    value={assigneeInput}
                                    onFocus={() => setShowAssigneeList(true)}
                                    onChangeText={(text) => handleAssigneeSearch(text)}
                                    placeholderTextColor={darkTheme ? "#e3e3e3" : "#666666"}
                                />

                                {showAssigneeList && (
                                    <FlatList
                                        style={[styles.assigneeFlatList, { top: assigneeInputHeight + 15 }]}
                                        data={filteredAssignees}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.assigneeOption}
                                                onPress={() => handleAddAssignee(item)}
                                            >
                                                <Text numberOfLines={1}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                )}
                            </>
                        ) : (
                            <TextInput
                                style={[styles.inputField, { color: textColor, borderColor: textColor }]}
                                placeholder={placeholder}
                                value={value}
                                onChangeText={onChangeText}
                                placeholderTextColor={darkTheme ? "#e3e3e3" : "#666666"}
                                editable={!isDatePicker}
                            />
                        )}

                        {isDatePicker && (
                            <TouchableOpacity onPress={onPressIcon}>
                                <Ionicons name="calendar" size={24} color={headerText} style={styles.icon} />
                            </TouchableOpacity>
                        )}
                    </View>
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
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        position: 'relative',
        justifyContent: 'center',
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
        marginRight: 8,
    },
    inputField: {
        flex: 1,
    },
    assigneeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d1dfeb',
        padding: 5,
        marginRight: 5,
        borderRadius: 5,
    },
    assigneeText: {
        marginRight: 5,
        fontSize: 14,
    },
    assigneeOption: {
        padding: 10,
    },
    assigneeFlatList: {
        position: 'absolute',
        width: '70%',
        backgroundColor: '#d1dfeb',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    }
});
