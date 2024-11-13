import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native';
import leaveStatus from '../../constants/leaveStatus';
import Colors from '../../constants/Colors';
import { formatDateInGB } from '../../constants/formatDateInGB';
import { leaveStatusColor } from '../../constants/leaveStatusColor';

export default function RegularizationsCard({ regularizeData, setShowRegDetailsModal, setRegularizationModalId }) {
    const formatTime = (date) => {
        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            console.error("Invalid date:", date);
            return "Invalid date";
        }

        return new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).format(parsedDate);
    };

    function handleClick(id) {
        setRegularizationModalId(id);
        setShowRegDetailsModal(true)
    }

    return (
        <Pressable style={{ marginVertical: 7 }} onPress={() => handleClick(regularizeData?.reg_id)}>
            <View style={[styles.duplicateCard, { backgroundColor: leaveStatusColor(regularizeData?.status) }]} />
            <View style={styles.cardStyle}>
                <SafeAreaView style={styles.flex_row_top}>
                    <Text
                        style={{
                            width: "70%",
                            fontSize: 14,
                            fontWeight: "500",
                            color: Colors.darkBlue,
                        }}
                    >
                        Applied for {formatDateInGB(regularizeData?.date)}
                    </Text>

                    <Text style={[styles.status, { backgroundColor: leaveStatusColor(regularizeData?.status) }]} >
                        {regularizeData?.status}
                    </Text>
                </SafeAreaView>

                <Text style={{ color: "#000", fontSize: 12, }}>
                    Punch In: {formatTime(regularizeData?.originalRecords?.punchIn)}
                </Text>
                <SafeAreaView style={styles.flex_row_top}>
                    <Text style={{ color: "#000", fontSize: 12, }}>
                        Punch Out: {formatTime(regularizeData?.originalRecords?.punchOut)}
                    </Text>
                    <Text style={{ color: "#000", fontSize: 12, }}>
                        Applied on {formatDateInGB(regularizeData?.appliedOn)}
                    </Text>
                </SafeAreaView>
            </View>
        </Pressable>

    )
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