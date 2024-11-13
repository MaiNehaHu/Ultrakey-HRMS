import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import taskStatus from '../../constants/taskStatus'
import Colors from '@/constants/Colors';

export default function TaskCard({ task, handleModalDisplay }) {
    const formatDate = (date) => {
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).format(new Date(date));
    };

    const statusColor =
        task?.status === taskStatus.Ongoing
            ? "orange"
            : task?.status === taskStatus.Completed
                ? Colors.lightBlue
                : task?.status === taskStatus.Overdue
                    ? "red"
                    : "grey";

    return (
        <Pressable
            key={task?.task_id}
            style={{ marginVertical: 7 }}
            onPress={() => handleModalDisplay(task?.task_id)}
        >
            <View
                style={[
                    styles.duplicateTaskCard,
                    { backgroundColor: statusColor },
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
                        {task?.name}
                    </Text>
                    <Text
                        style={[
                            styles.status,
                            { backgroundColor: statusColor },
                        ]}
                    >
                        {task?.status}
                    </Text>
                </View>

                <Text style={{ color: "#000", fontSize: 12 }}>
                    Created: {formatDate(task?.createdAt)}
                </Text>

                <Text style={{ color: "#000", fontSize: 12 }}>
                    Deadline: {formatDate(task?.deadline)}
                </Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    taskCard: {
        borderRadius: 15,
        padding: 12,
        shadowColor: "#000",
        display: "flex",
        borderWidth: 0.5,
        borderTopWidth: 0,
        borderColor: "#929394",
        backgroundColor: Colors.white,
    },
    duplicateTaskCard: {
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
})