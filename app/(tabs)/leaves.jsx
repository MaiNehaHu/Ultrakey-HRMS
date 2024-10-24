import {
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    Pressable,
    ScrollView,
    Animated,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";
import { TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useLeavesContext } from '../../contexts/Leaves'

import LeaveDetails from '../../components/myApp/leaveDetails'
import ApplyLeave from '../../components/myApp/applyLeave'
import SelectMonthAndYear from '../../components/myApp/selectMonth&Year';
import months from "../../constants/months";
import years from "../../constants/years";
import leaveStatus from "../../constants/leaveStatus";
import { LinearGradient } from "expo-linear-gradient";

const backgroundImage = require("../../assets/images/body_bg.png");

const leavesData = [
    { name: "Work From Home", granted: 5, balance: 5 },
    { name: "Causal Leaves", granted: 5, balance: 5 },
    { name: "Sick Leaves", granted: 5, balance: 5 },
];

export default function Leaves() {
    const navigation = useNavigation()
    const { darkTheme } = useAppTheme();
    const { leaves, setLeaves } = useLeavesContext();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);
    const [showLeaveDetailsModal, setShowLeaveDetailsModal] = useState(false);
    const [leaveModalId, setLeaveModalId] = useState(null);

    const [pickerModalState, setPickerModalState] = useState({
        tempYear: new Date().getFullYear(),
        selectedYear: new Date().getFullYear(),
        tempMonth: new Date().getMonth(),
        selectedMonth: new Date().getMonth(),
        showPickerMonthModal: false,
        showPickerYearModal: false,
    });

    const filteredLeavesList = leaves.filter((leave) => {
        const fromDate = new Date(leave.from.date);

        return (
            fromDate.getFullYear() === pickerModalState.selectedYear &&
            fromDate.getMonth() === pickerModalState.selectedMonth
        );
    });

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Animated.View style={{ transform: [{ scale: scaleAnim }], marginRight: 10 }}>
                    {!darkTheme ?
                        <LinearGradient
                            colors={['#1F366A', '#1A6FA8']}
                            style={styles.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Pressable
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                onPress={() => setIsLeaveModalVisible(true)}
                            >
                                <Text style={{ fontWeight: 500, color: "#fff" }}>Apply Leave</Text>
                            </Pressable>
                        </LinearGradient>
                        :
                        <Pressable
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={() => setIsLeaveModalVisible(true)}
                            style={[{ backgroundColor: Colors.lightBlue }, styles.gradient]}>
                            <Text style={{ fontWeight: 500, color: "#fff" }}>Apply Leave</Text>
                        </Pressable>
                    }
                </Animated.View>
            )
        })
    }, [darkTheme]);

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

    // Toggle the modal visibility
    const toggleModal = () => {
        setTimeout(() => {
            setIsLeaveModalVisible(!isLeaveModalVisible);
        }, 100);
    };

    return (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <ImageBackground source={backgroundImage} style={styles.backImage} />

            {/* Top section */}
            <SafeAreaView style={{ marginVertical: 20, }}>
                <FlatList
                    data={leavesData}
                    renderItem={({ item }) => (
                        <CountCards name={item.name} granted={item.granted} balance={item.balance} />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 15, gap: 15 }}
                />
            </SafeAreaView>

            <View style={{ paddingHorizontal: 15, flex: 1, /** Saves life for scrolling component */ }}>
                {/* Header */}
                <View style={styles.display_flex}>
                    <Text style={{ fontSize: 16, fontWeight: 500, color: textColor }}>Your Leaves for {months[pickerModalState.selectedMonth]} {pickerModalState.selectedYear}</Text>

                    <TouchableOpacity onPress={() =>
                        setPickerModalState((prevState) => ({
                            ...prevState,
                            showPickerMonthModal: true,
                        }))
                    }
                        style={styles.display_flex}
                    >
                        <FontAwesome6 name="calendar-alt" size={22} color={textColor} />
                    </TouchableOpacity>
                </View>

                {/* filtered Leaves List */}
                <ScrollView style={{ marginTop: 20 }} showsVerticalScrollIndicator={false}>
                    {filteredLeavesList.length !== 0 ? filteredLeavesList.map((leave) => (
                        <LeaveCard leave={leave}
                            key={leave?.id}
                            setLeaveModalId={setLeaveModalId}
                            setShowLeaveDetailsModal={setShowLeaveDetailsModal}
                        />
                    ))
                        :
                        <Text
                            style={{ color: textColor, textAlign: "center", marginTop: 30 }}
                        >
                            No tasks for this month.
                        </Text>
                    }
                </ScrollView>
            </View>

            {(pickerModalState.showPickerMonthModal ||
                pickerModalState.showPickerYearModal) && (
                    <SelectMonthAndYear
                        months={months}
                        years={years}
                        setPickerModalState={setPickerModalState}
                        clickedMonth={pickerModalState.tempMonth}
                        clickedYear={pickerModalState.tempYear}
                        isMonthVisible={pickerModalState.showPickerMonthModal}
                        isYearVisible={pickerModalState.showPickerYearModal}
                    />
                )
            }

            {/* Add Leave Modal */}
            {isLeaveModalVisible && (
                <ApplyLeave
                    isVisible={isLeaveModalVisible}
                    toggleModal={toggleModal}
                    setLeaves={setLeaves}
                />
            )}

            {showLeaveDetailsModal && (
                <LeaveDetails
                    leaveModalId={leaveModalId}
                    isVisible={showLeaveDetailsModal}
                    setShowLeaveDetailsModal={setShowLeaveDetailsModal}
                />
            )}
        </View >
    );
}

function LeaveCard({ leave, setLeaveModalId, setShowLeaveDetailsModal }) {
    const formatDate = (date) => {
        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            console.error("Invalid date:", date);
            return "Invalid date";
        }

        return new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
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

function CountCards({ name, granted, balance }) {
    const { darkTheme } = useAppTheme();
    const lightText = "#666666";
    const textColor = '#000';

    return (
        <SafeAreaView style={styles.cardContainer}>
            <View
                style={[
                    styles.duplicateCard,
                    { backgroundColor: darkTheme ? Colors.lightBlue : Colors.light.border },
                ]}
            />
            <View style={styles.cardStyle}>
                <SafeAreaView>
                    <Text style={{ fontWeight: 500, fontSize: 14, color: textColor }}>{name}</Text>
                    <Text style={{ fontSize: 12, color: lightText }}>Granted: {granted > 0 ? `0${granted}` : granted}</Text>
                </SafeAreaView>

                <SafeAreaView style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: 500, fontSize: 26, color: textColor, marginRight: 6, }}>{balance > 0 ? `0${balance}` : balance}</Text>
                    <Text style={{ fontSize: 12, color: lightText }}>Balance</Text>
                </SafeAreaView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: "cover",
    },
    cardContainer: {
        position: "relative",
        marginTop: 10,
        width: 200,
    },
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
    gradient: {
        borderRadius: 30,
        paddingHorizontal: 15,
        paddingVertical: 7,
    }
});
