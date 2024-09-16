import { Animated, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Colors from '@/constants/Colors';
import { useAppTheme } from '@/contexts/AppTheme';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome6';
import { useLeavesContext } from '@/contexts/Leaves';

const LeaveDetails = ({ leaveModalId, isVisible, setShowLeaveDetailsModal }) => {
    const { darkTheme } = useAppTheme();
    const { leaves, setLeaves } = useLeavesContext();
    const [leaveData, setLeaveData] = useState(null);  // Initialize as null
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;

    function handleWithdraw() {
        setLeaves((prevLeaves) => {
            // Find the index of the leave to be withdrawn
            const leaveIndex = prevLeaves.findIndex((leave) => leave.id === leaveModalId);

            if (leaveIndex === -1) {
                return prevLeaves;
            }

            // Create a copy of the leaves array
            const updatedLeaves = [...prevLeaves];

            // Update the status of the selected leave
            updatedLeaves[leaveIndex] = {
                ...updatedLeaves[leaveIndex],
                status: "Withdrawn",
            };

            return updatedLeaves;
        });

        setShowLeaveDetailsModal(false);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const currentLeave = leaves.find((leave) => leave.id === leaveModalId);
        setLeaveData(currentLeave || {});  // Fallback to empty object if not found
    }, [leaveModalId, leaves]);

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

    return (
        <Modal visible={isVisible} transparent={true} animationType='fade'>
            <View style={styles.ModalContainer}>
                <View style={[styles.ModalCard, { backgroundColor: bgColor }]}>
                    <View>
                        <View style={
                            [styles.flex_row_top,
                            { borderBottomWidth: 1, borderColor: '#e0e0e0', paddingBottom: 8, marginBottom: 10 }]
                        }>
                            {leaveData && (
                                <>
                                    <Text
                                        style={[
                                            styles.status,
                                            {
                                                backgroundColor:
                                                    leaveData.status === "Pending"
                                                        ? "orange"
                                                        : leaveData.status === "Approved"
                                                            ? "green"
                                                            : "red",
                                            },
                                        ]}
                                    >
                                        {leaveData.status}
                                    </Text>

                                    <TouchableOpacity onPress={() => setShowLeaveDetailsModal(false)}>
                                        <Text style={{ color: textColor }}>
                                            <AwesomeIcon name='xmark' size={22} />
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>

                        {leaveData && (
                            <View style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <Text style={{ fontSize: 32, color: textColor, padding: 5, textAlign: 'center' }}>{leaveData.noOfDays || 'N/A'}
                                    <Text style={{ fontSize: 12 }}> day(s)</Text>
                                </Text>

                                <Text style={{ color: textColor }}>Type: {leaveData.type || 'No type provided'}</Text>
                                <Text style={{ color: textColor }}>Reason for leave: {leaveData.reason || 'No reason provided'}</Text>
                                <Text style={{ color: textColor }}>From Session {leaveData.from?.session || 'N/A'} of {leaveData.from?.date ? formatDate(leaveData.from.date) : 'N/A'}</Text>
                                <Text style={{ color: textColor }}>To Session {leaveData.to?.session || 'N/A'} of {leaveData.to?.date ? formatDate(leaveData.to.date) : 'N/A'}</Text>
                            </View>
                        )}
                    </View>

                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <Pressable
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={() => {
                                setTimeout(() => {
                                    handleWithdraw()
                                }, 100);
                            }}
                            disabled={leaveData && leaveData.status == "Withdrawn" ? true : false}
                            style={[styles.withdrawButton, {
                                backgroundColor: leaveData && leaveData.status == "Withdrawn" ? '#e83c3c' : 'red'
                            }]}
                        >
                            <Text style={[styles.buttonText, {
                                color: leaveData && leaveData.status == "Withdrawn" ? '#cccccc' : '#fff',
                            }]}>
                                Withdraw Leave
                            </Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </View>
        </Modal>
    );
};

export default LeaveDetails;

const styles = StyleSheet.create({
    ModalContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    ModalCard: {
        width: '85%',
        height: 300,
        padding: 15,
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    flex_row_top: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    status: {
        color: "#fff",
        paddingVertical: 2,
        paddingHorizontal: 8,
        fontSize: 14,
        borderRadius: 20,
        fontWeight: 500
    },
    withdrawButton: {
        borderRadius: 30,
        padding: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        fontSize: 14,
        textAlign: "center",
        fontWeight: "500",
    },
});
