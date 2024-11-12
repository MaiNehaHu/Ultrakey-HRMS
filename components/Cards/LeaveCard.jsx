import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors';
import leaveStatus from '@/constants/leaveStatus';

export default function LeaveCard({ leave, setLeaveModalId, setShowLeaveDetailsModal }) {
    const formatDate = (date) => {
        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            console.error("Invalid date:", date);
            return "Invalid date";
        }

        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            // hour: "2-digit",
            // minute: "2-digit",
            // hour12: true,
        }).format(parsedDate);
    };

    function handleClick(id) {
        setLeaveModalId(id);
        setShowLeaveDetailsModal(true)
    }

    const statusColor =
        leave.status === leaveStatus.Pending
            ? "orange"
            : leave.status === leaveStatus.Approved
                ? Colors.lightBlue
                : leave.status === leaveStatus.Rejected
                    ? "red"
                    : "gray";

    return (
        <Pressable style={{ marginVertical: 10 }} onPress={() => handleClick(leave.id)}>
            <View style={[styles.duplicateCard, { backgroundColor: statusColor }]} />
            <View style={styles.cardStyle}>
                <SafeAreaView style={styles.flex_row_top}>
                    <Text
                        style={{
                            width: "70%",
                            fontSize: 16,
                            fontWeight: "500",
                            color: Colors.darkBlue,
                        }}
                    >
                        {leave.type} for {leave.noOfDays <= 1 ? `${leave.noOfDays} day` : `${leave.noOfDays} days`} {/* Corrected conditional */}
                    </Text>

                    <Text style={[styles.status, { backgroundColor: statusColor }]} >
                        {leave.status}
                    </Text>
                </SafeAreaView>

                <Text style={{ color: "#000", fontSize: 12 }}>
                    From: Session {leave.from.session} of {formatDate(leave.from?.date || leave.from)}
                </Text>
                <Text style={{ color: "#000", fontSize: 12 }}>
                    To: Session {leave.to.session} of {formatDate(leave.to?.date || leave.to)}
                </Text>
                <Text style={{ color: "#000", fontSize: 12 }}>
                    Reason: {leave.reason}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    duplicateCard: {
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
    cardStyle: {
        display: "flex",
        padding: 12,
        borderRadius: 15,
        borderWidth: 0.5,
        borderTopWidth: 0,
        borderColor: "#929394",
        backgroundColor: Colors.white,
    },
    display_flex: {
        gap: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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