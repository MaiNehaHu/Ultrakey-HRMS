import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
import { useAppTheme } from '../../contexts/AppTheme';
import Colors from '../../constants/Colors';
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
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit", // Day as 2 digits (DD)
            month: "short", // Month as short name (MMM)
            hour: "2-digit", // Hour as 2 digits (HH)
            minute: "2-digit", // Minute as 2 digits (MM)
            hour12: true, // 12-hour format with AM/PM
        }).format(new Date(date));
    };

    const statusColor = clickedTask.status === taskStatus.Ongoing
        ? "orange"
        : clickedTask.status === taskStatus.Completed
            ? Colors.lightBlue
            : clickedTask.status === taskStatus.Overdue
                ? "red"
                : "grey";

    return (
        <Modal transparent={true} visible={isVisible} animationType="fade">
            <Pressable style={styles.modalContainer} onPress={onClose}>
                <Pressable onPress={(e) => e.stopPropagation()}>
                    <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
                        <View>
                            {/* Header */}
                            <SafeAreaView style={[styles.flex_row_top, { paddingBottom: 8, marginBottom: 10 }]}>
                                <Text
                                    style={[
                                        styles.status,
                                        { backgroundColor: statusColor },
                                    ]}
                                >
                                    {clickedTask.status}
                                </Text>

                                <TouchableOpacity onPress={() => onClose(false)}>
                                    <Text style={{ color: textColor }}>
                                        <FontAwesome6Icon name="xmark" size={22} />
                                    </Text>
                                </TouchableOpacity>
                            </SafeAreaView>
                        </View>

                        <DataCard header={"Task Name"} data={clickedTask.name || 'No name provided'} />
                        <DataCard header={"Deadline"} data={formatDate(clickedTask.deadline) || 'No deadline provided'} />
                        <DataCard header={"Assignee"} data={clickedTask.assignee || 'No assignee'} />
                        <DataCard header={"Assigner"} data={clickedTask.assigner || 'No assigner'} />
                        <DataCard header={"Description"} data={clickedTask.description || 'No description'} />
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

export default TaskDetails;

const DataCard = ({ header, data }) => {
    const { darkTheme } = useAppTheme();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;

    return (
        <View style={{ padding: 5, marginBottom: 10 }}>
            <View style={[styles.cardContainer, { borderColor: textColor }]}>
                <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>{header}</Text>
                <ScrollView showsVerticalScrollIndicator style={{ maxHeight: 100 }}>
                    <Text selectable suppressHighlighting style={{ color: textColor, borderColor: textColor }}>
                        {data}
                    </Text>
                </ScrollView>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        width: "100%",
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    flex_row_top: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
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
    cardContainer: {
        padding: 13,
        borderWidth: 1,
        borderRadius: 10,
        position: 'relative',
    },
    headerText: {
        top: -10,
        left: 10,
        fontSize: 12,
        fontWeight: '500',
        position: 'absolute',
        paddingHorizontal: 5,
    },
})