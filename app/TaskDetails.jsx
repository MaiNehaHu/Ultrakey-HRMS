import { Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
import { useAppTheme } from '../contexts/AppTheme';
import Colors from '../constants/Colors';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { TouchableOpacity } from 'react-native';

const taskStatus = {
    Ongoing: "Ongoing",
    Completed: "Completed",
    Deferred: "Deferred",
    Overdue: "Overdue",
};

const TaskDetails = ({ isVisible, onClose, clickedTask }) => {
    const { darkTheme } = useAppTheme();
    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("en-US", {
            day: "2-digit", // Day as 2 digits (DD)
            month: "short", // Month as short name (MMM)
            hour: "2-digit", // Hour as 2 digits (HH)
            minute: "2-digit", // Minute as 2 digits (MM)
            hour12: true, // 12-hour format with AM/PM
        }).format(new Date(date));
    };

    return (
        <Modal transparent={true} visible={isVisible} animationType="none">
            <Pressable style={styles.modalBackground} onPress={onClose}>
                <View style={styles.modalContainerWrapper}>
                    <Pressable style={[styles.modalContainer, { backgroundColor: bgColor }]} onPress={(e) => e.stopPropagation()}>
                        <View
                            style={[styles.flex_row_top, {
                                borderBottomWidth: 1,
                                borderColor: "#e0e0e0",
                                paddingBottom: 8,
                                marginBottom: 10,
                            }]}>
                            <Text
                                style={[
                                    styles.status,
                                    {
                                        backgroundColor:
                                            clickedTask.status === taskStatus.Ongoing
                                                ? "orange"
                                                : clickedTask.status === taskStatus.Completed
                                                    ? "green"
                                                    : clickedTask.status === taskStatus.Deferred
                                                        ? "blue"
                                                        : "red",
                                    },
                                ]}
                            >
                                {clickedTask.status}
                            </Text>

                            <TouchableOpacity onPress={() => onClose(false)}>
                                <Text style={{ color: textColor }}>
                                    <FontAwesome6Icon name="xmark" size={22} />
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={{ color: textColor }}>Task Name: {clickedTask.name}</Text>
                        <Text style={{ color: textColor }}>Deadline: {formatDate(clickedTask.deadline)}</Text>
                        <Text style={{ color: textColor }}>Assignee: {clickedTask.assignee}</Text>
                        <Text style={{ color: textColor }}>Assigner: {clickedTask.assigner}</Text>
                        <Text style={{ color: textColor, marginBottom: 10 }}>Description: {clickedTask.description}</Text>

                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    )
}

export default TaskDetails

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainerWrapper: {
        width: "85%",
    },
    modalContainer: {
        gap: 10,
        padding: 15,
        borderRadius: 20,
        display: "flex",
        flexDirection: "column",
    },
    flex_row_top: {
        display: "flex",
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        alignItems: "center",
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
})