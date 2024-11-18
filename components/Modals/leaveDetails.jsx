import { Animated, Modal, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Colors from '@/constants/Colors';
import { useAppTheme } from '@/contexts/AppTheme';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome6';
import { useLeavesContext } from '@/contexts/Leaves';

import LeaveStatus from '@/constants/leaveStatus'
import { formatDateInGB } from '@/constants/formatDateInGB';
import { leaveStatusColor } from '@/constants/leaveStatusColor'

const LeaveDetails = ({ leaveModalId, isVisible, handleCloseModal, slideModalAnim }) => {
    const { darkTheme } = useAppTheme();
    const { leaves, setLeaves } = useLeavesContext();
    const [leaveData, setLeaveData] = useState(null);  // Initialize as null
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;

    function handleWithdraw() {
        setLeaves((prevLeaves) => {
            const leaveIndex = prevLeaves.findIndex((leave) => leave.id === leaveModalId);
            if (leaveIndex === -1) return prevLeaves;
            const updatedLeaves = [...prevLeaves];
            updatedLeaves[leaveIndex] = { ...updatedLeaves[leaveIndex], status: "Withdrawn" };
            return updatedLeaves;
        });
        handleCloseModal();
    }

    useEffect(() => {
        const currentLeave = leaves.find((leave) => leave.id === leaveModalId);
        setLeaveData(currentLeave || {});  // Fallback to an empty object if not found
    }, [leaveModalId, leaves]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    };

    return leaveData && (
        <Modal visible={isVisible} transparent={true} animationType="fade">
            <Pressable style={styles.modalContainer} onPress={handleCloseModal}>
                <Pressable onPress={(e) => e.stopPropagation()}>
                    <Animated.View
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor: bgColor,
                                transform: [{ translateY: slideModalAnim }],
                            },
                        ]}
                    >
                        <View>
                            {/* Header */}
                            <SafeAreaView style={[styles.flex_row_top, { paddingBottom: 8, marginBottom: 10 }]}>
                                <Text
                                    style={[
                                        styles.status,
                                        { backgroundColor: leaveStatusColor(leaveData?.status) },
                                    ]}
                                >
                                    {leaveData?.status || 'No Status'}
                                </Text>
                                <TouchableOpacity onPress={handleCloseModal}>
                                    <Text style={{ color: textColor }}>
                                        <AwesomeIcon name='xmark' size={22} />
                                    </Text>
                                </TouchableOpacity>
                            </SafeAreaView>

                            <DataCard header={"Type"} data={leaveData?.type || 'No type specified'} />
                            <DataCard header={"From"} data={`Session ${leaveData?.from?.session || 'N/A'} of ${formatDateInGB(leaveData?.from?.date)}`} />
                            <DataCard header={"To"} data={`Session ${leaveData?.to?.session || 'N/A'} of ${formatDateInGB(leaveData?.to?.date)}`} />
                            <DataCard header={"Reason"} data={leaveData?.reason || 'No reason provided'} />
                        </View>

                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <Pressable
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                onPress={() => setTimeout(handleWithdraw, 100)}
                                disabled={leaveData?.status === LeaveStatus.Withdrawn ||
                                    leaveData?.status === LeaveStatus.Rejected ||
                                    leaveData?.status === LeaveStatus.Approved}
                                style={[
                                    styles.withdrawButton,
                                    {
                                        backgroundColor: leaveData?.status === LeaveStatus.Withdrawn ||
                                            leaveData?.status === LeaveStatus.Rejected ||
                                            leaveData?.status === LeaveStatus.Approved ? 'gray' : 'red'
                                    }
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.withdrawButtonText,
                                        {
                                            color: leaveData?.status === LeaveStatus.Withdrawn ||
                                                leaveData?.status === LeaveStatus.Rejected ||
                                                leaveData?.status === LeaveStatus.Approved ? '#cccccc' : '#fff'
                                        }
                                    ]}
                                >
                                    Withdraw Leave
                                </Text>
                            </Pressable>
                        </Animated.View>
                    </Animated.View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default LeaveDetails;

const DataCard = ({ header, data }) => {
    const { darkTheme } = useAppTheme();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;

    return (
        <View style={{ padding: 5, marginBottom: 10 }}>
            <View style={[styles.cardContainer, { borderColor: textColor }]}>
                <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>{header}</Text>
                <Text style={{ color: textColor, borderColor: textColor }}>
                    {data}
                </Text>
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
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 14,
        borderRadius: 20,
        fontWeight: '500',
    },
    withdrawButton: {
        borderRadius: 30,
        padding: 10,
        paddingHorizontal: 20,
        marginTop: 5,
    },
    withdrawButtonText: {
        fontSize: 14,
        textAlign: "center",
        fontWeight: '500',
    },
    flex_row_top: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    buttonText: {
        textAlign: "center",
        fontSize: 12,
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
});
