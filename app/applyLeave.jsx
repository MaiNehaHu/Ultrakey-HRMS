import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, TextInput, View, Pressable, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Colors from '@/constants/Colors';
import { useAppTheme } from '@/contexts/AppTheme';
import { Animated } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Only using DateTimePickerModal
import { useLeavesContext } from '@/contexts/Leaves';
import leaveStatus from '@/constants/leaveStatus';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';
import { formatDateInGB } from '../constants/formatDateInGB';

const backgroundImage = require('../assets/images/body_bg.png');

const ApplyLeave = () => {
    const navigation = useNavigation()
    const { darkTheme } = useAppTheme();
    const { leaves, setLeaves } = useLeavesContext();

    const bgColor = Colors[darkTheme ? 'dark' : 'light'].background;
    const oppBgColor = Colors[!darkTheme ? 'dark' : 'light'].background;
    const textColor = Colors[darkTheme ? 'dark' : 'light'].text;

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const [reason, setReason] = useState('');
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(fromDate);
    const [fromSession, setFromSession] = useState(1);
    const [toSession, setToSession] = useState(2);
    const [leaveType, setLeaveType] = useState('Unpaid Leave');
    const [loading, setLoading] = useState(false);

    const [isFromPickerVisible, setFromPickerVisible] = useState(false); // For "from" date picker
    const [isToPickerVisible, setToPickerVisible] = useState(false);     // For "to" date picker

    const showFromDatePicker = () => setFromPickerVisible(true);
    const hideFromDatePicker = () => setFromPickerVisible(false);

    const showToDatePicker = () => setToPickerVisible(true);
    const hideToDatePicker = () => setToPickerVisible(false);

    const handleFromConfirm = (date) => {
        setFromDate(date);
        hideFromDatePicker();
    };

    const handleToConfirm = (date) => {
        setToDate(date);
        hideToDatePicker();
    };

    const getDateOnly = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const handleSaveLeave = () => {
        setLoading(true);

        const existFlag = leaves.filter((leave) => {
            const leaveFromDate = getDateOnly(new Date(leave.from.date));
            const leaveToDate = getDateOnly(new Date(leave.to.date));
            const selectedFromDate = getDateOnly(new Date(fromDate));
            const selectedToDate = getDateOnly(new Date(toDate));

            const leaveFromSession = leave.from.session
            const leaveToSession = leave.to.session

            const isDateOverlap =
                // New leave starts within an existing leave
                (selectedFromDate >= leaveFromDate && selectedFromDate <= leaveToDate) ||
                // New leave ends within an existing leave
                (selectedToDate >= leaveFromDate && selectedToDate <= leaveToDate) ||
                // New leave completely wraps around an existing leave
                (selectedFromDate <= leaveFromDate && selectedToDate >= leaveToDate);

            const isSessionOverlap =
                (fromSession === leaveFromSession || toSession === leaveToSession)

            return isDateOverlap && isSessionOverlap && (leave.status === leaveStatus.Approved || leave.status === leaveStatus.Pending);
        });

        if (fromDate > toDate) {
            Alert.alert("Incorrect Date Order", "From Date can't be ahead of the To Date");
            setLoading(false);
            return;
        } else if (calculateNoOfDays(fromDate, fromSession, toDate, toSession) === 0) {
            Alert.alert("Incorrect Sessions Selected", "You selected sessions in reverse order for the day.");
            setLoading(false);
            return;
        } else if (existFlag.length > 0) {
            Alert.alert("Already applied", "You already have an overlapping leave for these dates and sessions.");
            setLoading(false);
            return;
        } else if (reason === "") {
            Alert.alert("Reason", "Please provide reason for your leave application");
            setLoading(false);
            return;
        }

        const newLeave = {
            id: Date.now(), // Unique ID
            applyedOn: Date.now(),
            reason: reason === "" ? "N/A" : reason,
            from: { date: fromDate, session: fromSession },
            to: { date: toDate, session: toSession },
            type: leaveType,
            status: leaveStatus.Pending,
            noOfDays: calculateNoOfDays(fromDate, fromSession, toDate, toSession)
        };

        setTimeout(() => {
            setLeaves((prevLeaves) => [newLeave, ...prevLeaves]);
            setLoading(false);
            navigation.goBack();
        }, 500);
    };

    function calculateNoOfDays(fromDate, fromSession, toDate, toSession) {
        const startDate = new Date(fromDate.setHours(0, 0, 0, 0));
        const endDate = new Date(toDate.setHours(0, 0, 0, 0));
        // Calculate full days between the two dates
        const daysDiff = (endDate - startDate) / (1000 * 60 * 60 * 24);

        let noOfDays = 0;

        if (daysDiff === 0) {
            // Case for the same day
            if (fromSession === 1 && toSession === 1) {
                noOfDays = 0.5; // Morning half
            } else if (fromSession === 1 && toSession === 2) {
                noOfDays = 1; // Full day
            } else if (fromSession === 2 && toSession === 2) {
                noOfDays = 0.5; // Afternoon half
            }
        } else {
            // Case for different days
            noOfDays = daysDiff - 1; // Number of full days between

            // Handle the first day based on the session
            if (fromSession === 1) {
                noOfDays += 1; // Full first day
            } else if (fromSession === 2) {
                noOfDays += 0.5; // Half first day
            }

            // Handle the last day based on the session
            if (toSession === 1) {
                noOfDays += 0.5; // Half last day
            } else if (toSession === 2) {
                noOfDays += 1; // Full last day
            }
        }

        return noOfDays;
    }


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
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <ImageBackground source={backgroundImage} style={styles.bgImage} />

            <View style={{ padding: 15, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <SafeAreaView style={{ display: 'flex', gap: 20 }}>
                    <View style={{ display: 'flex', gap: 10 }}>
                        <Text style={{ color: textColor }}>Duration:</Text>

                        <View style={styles.flex_row_center}>
                            {/* From Date Picker */}
                            <TouchableOpacity onPress={showFromDatePicker} style={styles.dateButton}>
                                <Text style={styles.dateButtonText}>From: {formatDateInGB(fromDate)}</Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isFromPickerVisible}
                                mode="date"
                                minimumDate={new Date()}
                                onConfirm={handleFromConfirm}
                                onCancel={hideFromDatePicker}
                            />

                            {/* Session Toggle */}
                            <Pressable
                                style={[
                                    styles.buttonContainer,
                                    {
                                        borderWidth: 1,
                                        backgroundColor: fromSession === 1 ? Colors.lightBlue : "transparent",
                                        borderColor: fromSession === 1 ? Colors.lightBlue : textColor,
                                    },
                                ]}
                                onPress={() => setFromSession(1)}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    {
                                        fontWeight: fromSession === 1 ? "600" : "400",
                                        color: fromSession === 1 ? '#fff' : textColor,
                                    }
                                ]}>
                                    Session 1
                                </Text>
                            </Pressable>

                            <Pressable
                                style={[
                                    styles.buttonContainer,
                                    {
                                        borderWidth: 1,
                                        backgroundColor: fromSession === 2 ? Colors.lightBlue : "transparent",
                                        borderColor: fromSession === 2 ? Colors.lightBlue : textColor,
                                    }
                                ]}
                                onPress={() => setFromSession(2)}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    {
                                        fontWeight: fromSession === 2 ? "600" : "400",
                                        color: fromSession === 2 ? '#fff' : textColor,
                                    }
                                ]}>
                                    Session 2
                                </Text>
                            </Pressable>
                        </View>

                        <View style={styles.flex_row_center}>
                            {/* To Date Picker */}
                            <Pressable onPress={showToDatePicker} style={styles.dateButton}>
                                <Text style={styles.dateButtonText}>To: {formatDateInGB(toDate)}</Text>
                            </Pressable>
                            <DateTimePickerModal
                                isVisible={isToPickerVisible}
                                mode="date"
                                minimumDate={fromDate}
                                onConfirm={handleToConfirm}
                                onCancel={hideToDatePicker}
                            />

                            {/* Session Toggle */}
                            <Pressable
                                style={[
                                    styles.buttonContainer,
                                    {
                                        borderWidth: 1,
                                        backgroundColor: toSession === 1 ? Colors.lightBlue : "transparent",
                                        borderColor: toSession === 1 ? Colors.lightBlue : textColor,
                                    },
                                ]}
                                onPress={() => setToSession(1)}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    {
                                        fontWeight: toSession === 1 ? "600" : "400",
                                        color: toSession === 1 ? '#fff' : textColor,
                                    }
                                ]}>
                                    Session 1
                                </Text>
                            </Pressable>

                            <Pressable
                                style={[
                                    styles.buttonContainer,
                                    {
                                        borderWidth: 1,
                                        backgroundColor: toSession === 2 ? Colors.lightBlue : "transparent",
                                        borderColor: toSession === 2 ? Colors.lightBlue : textColor,
                                    },
                                ]}
                                onPress={() => setToSession(2)}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    {
                                        fontWeight: toSession === 2 ? "600" : "400",
                                        color: toSession === 2 ? '#fff' : textColor,
                                    }
                                ]}>
                                    Session 2
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    <View style={{ display: 'flex', gap: 10 }}>
                        <Text style={{ color: textColor }}>Type:</Text>

                        <View style={styles.flex_row_center}>
                            <Pressable
                                style={[
                                    styles.buttonContainer,
                                    {
                                        borderWidth: 1,
                                        backgroundColor: leaveType === "Paid Leave" ? Colors.lightBlue : "transparent",
                                        borderColor: leaveType === "Paid Leave" ? Colors.lightBlue : textColor,
                                    },
                                ]}
                                onPress={() => setLeaveType("Paid Leave")}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    {
                                        fontWeight: leaveType === "Paid Leave" ? "600" : "400",
                                        color: leaveType === "Paid Leave" ? '#fff' : textColor,
                                    }
                                ]}>
                                    Paid Leave
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.buttonContainer,
                                    {
                                        borderWidth: 1,
                                        backgroundColor: leaveType === "Unpaid Leave" ? Colors.lightBlue : "transparent",
                                        borderColor: leaveType === "Unpaid Leave" ? Colors.lightBlue : textColor,
                                    },
                                ]}
                                onPress={() => setLeaveType("Unpaid Leave")}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    {
                                        fontWeight: leaveType === "Unpaid Leave" ? "600" : "400",
                                        color: leaveType === "Unpaid Leave" ? '#fff' : textColor,
                                    }
                                ]}>
                                    Unpaid Leave
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.buttonContainer,
                                    {
                                        borderWidth: 1,
                                        backgroundColor: leaveType === "Sick Leave" ? Colors.lightBlue : "transparent",
                                        borderColor: leaveType === "Sick Leave" ? Colors.lightBlue : textColor,
                                    },
                                ]}
                                onPress={() => setLeaveType("Sick Leave")}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    {
                                        fontWeight: leaveType === "Sick Leave" ? "600" : "400",
                                        color: leaveType === "Sick Leave" ? '#fff' : textColor,
                                    }
                                ]}>
                                    Sick Leave
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    <View style={[styles.cardContainer, { borderColor: textColor, marginTop: 10 }]}>
                        <Text style={[{ color: textColor, backgroundColor: bgColor }, styles.headerText]}>Reason</Text>
                        <TextInput
                            style={{ color: textColor, borderColor: textColor }}
                            placeholder="Reason for leave"
                            value={reason}
                            onChangeText={setReason}
                            placeholderTextColor={darkTheme ? "#e3e3e3" : "#666666"}
                        />
                    </View>
                </SafeAreaView>

                <SafeAreaView>
                    <View style={{ marginVertical: 5, }}>
                        <Text style={{ color: textColor }}>Remaining Paid Leaves: 2</Text>
                    </View>

                    {/* Apply Button or Loader */}
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        {!darkTheme ?
                            <LinearGradient
                                colors={['#1F366A', '#1A6FA8']}
                                style={styles.applyButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Pressable
                                    onPressIn={handlePressIn}
                                    onPressOut={handlePressOut}
                                    onPress={handleSaveLeave}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color={textColor} />
                                    ) : (
                                        <Text style={[styles.saveButtonText, { color: bgColor }]}>Apply Leave</Text>
                                    )}
                                </Pressable>
                            </LinearGradient>
                            :
                            <Pressable
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                onPress={handleSaveLeave}
                                style={[styles.applyButton, { backgroundColor: oppBgColor }]}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color={oppBgColor} />
                                ) : (
                                    <Text style={[styles.saveButtonText, { color: bgColor }]}>Apply Leave</Text>
                                )}
                            </Pressable>
                        }
                    </Animated.View>
                </SafeAreaView>
            </View >
        </View>
    );
};

export default ApplyLeave;

const styles = StyleSheet.create({
    bgImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover'
    },
    flex_row_center: {
        gap: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        // marginBottom: 10,
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
        fontWeight: 600,
        fontSize: 14
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
    cardContainer: {
        borderWidth: 1,
        borderRadius: 10,
        position: 'relative',
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
    bodyText: {
        fontSize: 14,
        fontWeight: '400',
    },
});
