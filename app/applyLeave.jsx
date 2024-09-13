import { Modal, StyleSheet, Text, TouchableOpacity, TextInput, View, Pressable, ActivityIndicator } from 'react-native';
import React, { useRef, useState } from 'react';
import Colors from '@/constants/Colors';
import { useAppTheme } from '@/contexts/AppTheme';
import AwesomeIcon from "react-native-vector-icons/FontAwesome6";
import { Animated } from 'react-native';
import DatePicker from 'react-native-modern-datepicker'

const ApplyLeave = ({ isVisible, toggleModal, setLeaves }) => {
    const { darkTheme } = useAppTheme();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const oppBgColor = Colors[!darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const [reason, setReason] = useState("Reason");
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [fromSession, setFromSession] = useState(1);
    const [toSession, setToSession] = useState(2);
    const [leaveType, setLeaveType] = useState("Unpaid Leave");
    const [isFromPickerOpen, setIsFromPickerOpen] = useState(false);
    const [isToPickerOpen, setIsToPickerOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Loader state

    // Save the new leave
    const handleSaveLeave = () => {
        setLoading(true); // Start loader

        const newLeave = {
            id: Date.now(), // Unique ID
            reason,
            from: { date: fromDate, session: fromSession },
            to: { date: toDate, session: toSession }, // Example: same session as fromSession
            type: leaveType, // Example
            status: "Pending",
        };

        setLeaves((prevLeaves) => [...prevLeaves, newLeave]);
        setTimeout(() => {
            setLoading(false);
            toggleModal();
        }, 1500);
    };

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
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
                    <View style={styles.flex_row_top}>
                        <Text style={[styles.modalTitle, { color: textColor }]}>Apply for Leave</Text>

                        <TouchableOpacity onPress={toggleModal}>
                            <Text style={{ color: textColor }}>
                                <AwesomeIcon name='xmark' size={22} />
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={[styles.input, { color: textColor, borderColor: textColor }]}
                        placeholder="Reason"
                        value={reason}
                        onChangeText={setReason}
                    />

                    <Text style={{ color: textColor, marginBottom: 8 }}>Duration:</Text>

                    <View style={styles.flex_row_center}>
                        {/* From Date Picker */}
                        <TouchableOpacity onPress={() => setIsFromPickerOpen(true)} style={styles.dateButton}>
                            <Text style={styles.dateButtonText}>From Date: {fromDate.toISOString().split('T')[0]}</Text>
                        </TouchableOpacity>
                        <DatePicker
                            modal
                            open={isFromPickerOpen}
                            date={fromDate}
                            mode="date"
                            onConfirm={(date) => {
                                setIsFromPickerOpen(false);
                                setFromDate(date);
                            }}
                            onCancel={() => setIsFromPickerOpen(false)}
                        />

                        {/* Session Toggle */}
                        <Pressable
                            style={[
                                styles.buttonContainer,
                                {
                                    borderWidth: 1,
                                    backgroundColor: fromSession === 1 ? Colors.tintColorLight : "transparent",
                                    borderColor: fromSession === 1 ? Colors.tintColorLight : textColor,
                                },
                            ]}
                            onPress={() => setFromSession(1)}
                        >
                            <Text style={[
                                styles.buttonText,
                                {
                                    fontWeight: fromSession === 1 ? "600" : "300",
                                    color: fromSession === 1 ? '#fff' : textColor,
                                }
                            ]}>Session 1</Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.buttonContainer,
                                {
                                    borderWidth: 1,
                                    backgroundColor: fromSession === 2 ? Colors.tintColorLight : "transparent",
                                    borderColor: fromSession === 2 ? Colors.tintColorLight : textColor,
                                }
                            ]}
                            onPress={() => setFromSession(2)}
                        >
                            <Text style={[
                                styles.buttonText,
                                {
                                    fontWeight: fromSession === 2 ? "600" : "300",
                                    color: fromSession === 2 ? '#fff' : textColor,
                                }
                            ]}>Session 2</Text>
                        </Pressable>
                    </View>

                    <View style={styles.flex_row_center}>
                        {/* To Date Picker */}
                        <Pressable onPress={() => setIsToPickerOpen(true)} style={styles.dateButton}>
                            <Text style={styles.dateButtonText}>To Date: {toDate.toISOString().split('T')[0]}</Text>
                        </Pressable>
                        <DatePicker
                            modal
                            open={isToPickerOpen}
                            date={toDate}
                            mode="date"
                            onConfirm={(date) => {
                                setIsToPickerOpen(false);
                                setToDate(date);
                            }}
                            onCancel={() => setIsToPickerOpen(false)}
                        />

                        {/* Session Toggle */}
                        <Pressable
                            style={[
                                styles.buttonContainer,
                                {
                                    borderWidth: 1,
                                    backgroundColor: toSession === 1 ? Colors.tintColorLight : "transparent",
                                    borderColor: toSession === 1 ? Colors.tintColorLight : textColor,
                                },
                            ]}
                            onPress={() => setToSession(1)}
                        >
                            <Text style={[
                                styles.buttonText,
                                {
                                    fontWeight: toSession === 1 ? "600" : "300",
                                    color: toSession === 1 ? '#fff' : textColor,
                                }
                            ]}>Session 1</Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.buttonContainer,
                                {
                                    borderWidth: 1,
                                    backgroundColor: toSession === 2 ? Colors.tintColorLight : "transparent",
                                    borderColor: toSession === 2 ? Colors.tintColorLight : textColor,
                                },
                            ]}
                            onPress={() => setToSession(2)}
                        >
                            <Text style={[
                                styles.buttonText,
                                {
                                    fontWeight: toSession === 2 ? "600" : "300",
                                    color: toSession === 2 ? '#fff' : textColor,
                                }
                            ]}>Session 2</Text>
                        </Pressable>
                    </View>

                    <Text style={{ color: textColor, marginBottom: 8 }}>Type:</Text>

                    <View style={styles.flex_row_center}>
                        <Pressable
                            style={[
                                styles.buttonContainer,
                                {
                                    borderWidth: 1,
                                    backgroundColor: leaveType === "Paid Leave" ? Colors.tintColorLight : "transparent",
                                    borderColor: leaveType === "Paid Leave" ? Colors.tintColorLight : textColor,
                                },
                            ]}
                            onPress={() => setLeaveType("Paid Leave")}
                        >
                            <Text style={[
                                styles.buttonText,
                                {
                                    fontWeight: leaveType === "Paid Leave" ? "600" : "300",
                                    color: leaveType === "Paid Leave" ? '#fff' : textColor,
                                }
                            ]}>Paid Leave</Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.buttonContainer,
                                {
                                    borderWidth: 1,
                                    backgroundColor: leaveType === "Unpaid Leave" ? Colors.tintColorLight : "transparent",
                                    borderColor: leaveType === "Unpaid Leave" ? Colors.tintColorLight : textColor,
                                },
                            ]}
                            onPress={() => setLeaveType("Unpaid Leave")}
                        >
                            <Text style={[
                                styles.buttonText,
                                {
                                    fontWeight: leaveType === "Unpaid Leave" ? "600" : "300",
                                    color: leaveType === "Unpaid Leave" ? '#fff' : textColor,
                                }
                            ]}>Unpaid Leave</Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.buttonContainer,
                                {
                                    borderWidth: 1,
                                    backgroundColor: leaveType === "Sick Leave" ? Colors.tintColorLight : "transparent",
                                    borderColor: leaveType === "Sick Leave" ? Colors.tintColorLight : textColor,
                                },
                            ]}
                            onPress={() => setLeaveType("Sick Leave")}
                        >
                            <Text style={[
                                styles.buttonText,
                                {
                                    fontWeight: leaveType === "Sick Leave" ? "600" : "300",
                                    color: leaveType === "Sick Leave" ? '#fff' : textColor,
                                }
                            ]}>Sick Leave</Text>
                        </Pressable>
                    </View>

                    <View style={{ marginVertical: 10, }}>
                        <Text style={{ color: textColor }}>Remaining Paid Leaves: 2</Text>
                    </View>

                    {/* Apply Button or Loader */}
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <Pressable
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={handleSaveLeave}
                            style={[styles.applyButton, { backgroundColor: oppBgColor }]}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={Colors.tintColorLight} />
                            ) : (
                                <Text style={[styles.saveButtonText, { color: bgColor }]}>Apply</Text>
                            )}
                        </Pressable>
                    </Animated.View>
                </View>
            </View>
        </Modal>
    );
};

export default ApplyLeave;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        width: "100%",
        padding: 20,
        paddingBottom: 30,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 15,
        paddingVertical: 5,
        paddingHorizontal: 2,
    },
    flex_row_top: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    flex_row_center: {
        gap: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        justifyContent: "space-between",
    },
    buttonContainer: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 30,
    },
    buttonText: {
        textAlign: "center",
        fontSize: 12,
    },
    applyButton: {
        padding: 10,
        borderRadius: 30,
        marginTop: 10,
    },
    saveButtonText: {
        textAlign: "center",
        fontWeight: 500,
        fontSize: 16
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
    },
    dateButton: {
        padding: 8,
        width: '52%',
        borderRadius: 20,
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    dateButtonText: {
        color: "#000",
    },
});
