import { Modal, StyleSheet, Text, View, Pressable, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useAppTheme } from '../../contexts/AppTheme'
import Colors from '../../constants/Colors';
import { useRegularization } from '../../contexts/RegularizationRequest';
import leaveStatus from '../../constants/leaveStatus';
import { SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';

export default function RegDetails({ isVisible, regularizationModalId, setShowRegDetailsModal }) {
    const { darkTheme } = useAppTheme();
    const { regularizationRequest, setRegularizationRequest } = useRegularization();
    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const [regData, setRegData] = useState(null);  // Initialize as null

    const statusColor = regData?.status === leaveStatus.Pending
        ? "orange"
        : regData?.status === leaveStatus.Approved
            ? Colors.lightBlue
            : regData?.status === leaveStatus.Rejected
                ? "red"
                : "gray";

    function handleWithdraw() {
        setRegularizationRequest((prevReg) => {
            const regIndex = prevReg.findIndex((regular) => regular.reg_id === regularizationModalId);
            if (regIndex === -1) return prevReg;
            const updatedRegularizations = [...prevReg];
            updatedRegularizations[regIndex] = { ...updatedRegularizations[regIndex], status: leaveStatus.Withdrawn };
            return updatedRegularizations;
        });
        setShowRegDetailsModal(false);
    }

    const formatDate = (date) => {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            console.error("Invalid date:", date);
            return "Invalid date";
        }

        return new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            month: "short",
            year: 'numeric',
        }).format(parsedDate);
    };

    const formatTime = (date) => {
        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            console.error("Invalid date:", date);
            return "Invalid date";
        }

        return new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).format(parsedDate);
    };

    useEffect(() => {
        const currentRegularize = regularizationRequest?.find((regularize) => regularize.reg_id === regularizationModalId);
        setRegData(currentRegularize || {});  // Fallback to an empty object if not found
    }, [regularizationModalId, regularizationRequest]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    };

    return (
        <Modal visible={isVisible} transparent={true} animationType="fade">
            <Pressable style={styles.modalContainer} onPress={() => setShowRegDetailsModal(false)}>
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
                                    {regData?.status || 'No Status'}
                                </Text>
                                <TouchableOpacity onPress={() => setShowRegDetailsModal(false)}>
                                    <Text style={{ color: textColor }}>
                                        <FontAwesome6Icon name='xmark' size={22} />
                                    </Text>
                                </TouchableOpacity>
                            </SafeAreaView>

                            <DataCard header={"Applied for"} data={formatDate(regData?.date) || 'No reason provided'} />
                            <DataCard header={"Punch In"} data={`${formatTime(regData?.punchIn) || 'N/A'}`} />
                            <DataCard header={"Punch Out"} data={`${formatTime(regData?.punchOut) || 'N/A'}`} />
                            <DataCard header={"Applied on"} data={formatDate(regData?.appliedOn) || 'No type specified'} />
                        </View>

                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <Pressable
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                onPress={() => setTimeout(handleWithdraw, 100)}
                                disabled={regData?.status === leaveStatus.Withdrawn ||
                                    regData?.status === leaveStatus.Rejected ||
                                    regData?.status === leaveStatus.Approved}
                                style={[
                                    styles.withdrawButton,
                                    {
                                        backgroundColor: regData?.status === leaveStatus.Withdrawn ||
                                            regData?.status === leaveStatus.Rejected ||
                                            regData?.status === leaveStatus.Approved ? 'gray' : 'red'
                                    }
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.withdrawButtonText,
                                        {
                                            color: regData?.status === leaveStatus.Withdrawn ||
                                                regData?.status === leaveStatus.Rejected ||
                                                regData?.status === leaveStatus.Approved ? '#cccccc' : '#fff'
                                        }
                                    ]}
                                >
                                    Withdraw Leave
                                </Text>
                            </Pressable>
                        </Animated.View>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

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
})