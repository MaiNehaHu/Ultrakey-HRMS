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
    Easing,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";
import { TouchableOpacity } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useLeavesContext } from '../../contexts/Leaves'

import LeaveCard from '../../components/Cards/LeaveCard'
import LeaveDetails from '../../components/Modals/leaveDetails'
import SelectMonthAndYear from '../../components/myApp/selectMonth&Year';

import years from "../../constants/years";
import months from "../../constants/months";
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
    const { leaves } = useLeavesContext();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const slideModalAnim = useRef(new Animated.Value(200)).current; // Start position off-screen

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
                                onPress={() => navigation.navigate('applyLeave')}
                            >
                                <Text style={{ fontWeight: 500, color: "#fff" }}>Apply Leave</Text>
                            </Pressable>
                        </LinearGradient>
                        :
                        <Pressable
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={() => navigation.navigate('applyLeave')}
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

    const handleOpenModal = () => {
        setShowLeaveDetailsModal(true);
        Animated.timing(slideModalAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    };

    const handleCloseModal = () => {
        Animated.timing(slideModalAnim, {
            toValue: 700, // Slide back down
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }).start(() => {
            setShowLeaveDetailsModal(false);
        });
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
                    <Text style={{ fontSize: 16, fontWeight: 500, marginBottom: 0, color: textColor }}>Your Leaves for {months[pickerModalState.selectedMonth]} {pickerModalState.selectedYear}</Text>

                    <TouchableOpacity
                        onPress={() =>
                            setPickerModalState((prevState) => ({
                                ...prevState,
                                showPickerMonthModal: true,
                            }))
                        }
                    >
                        <Ionicons name="calendar" size={22} color={textColor} />
                    </TouchableOpacity>
                </View>

                {/* filtered Leaves List */}
                <ScrollView style={{ marginTop: 15 }} showsVerticalScrollIndicator={false}>
                    {filteredLeavesList.length > 0 ?
                        filteredLeavesList.map((leave) => (
                            <LeaveCard
                                leave={leave}
                                key={leave?.id}
                                setLeaveModalId={setLeaveModalId}
                                handleOpenModal={handleOpenModal}
                            />
                        ))
                        :
                        <Text
                            style={{ color: textColor, textAlign: "center", marginTop: 30 }}
                        >
                            No leaves applied for this month.
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

            {showLeaveDetailsModal && (
                <LeaveDetails
                    leaveModalId={leaveModalId}
                    isVisible={showLeaveDetailsModal}
                    slideModalAnim={slideModalAnim}
                    handleCloseModal={handleCloseModal}
                />
            )}
        </View >
    );
}

function CountCards({ name, granted, balance }) {
    const { darkTheme } = useAppTheme();
    const lightText = "#666666";
    const textColor = '#000';

    return (
        <SafeAreaView style={styles.cardContainer}>
            {
                !darkTheme ?
                    <LinearGradient
                        colors={['#1F366A', '#1A6FA8']}
                        style={styles.duplicateCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    />
                    :
                    <View
                        style={[
                            styles.duplicateCard,
                            { backgroundColor: darkTheme ? Colors.lightBlue : Colors.light.border },
                        ]}
                    />
            }

            <View style={styles.cardStyle}>
                <SafeAreaView>
                    <Text style={{ fontWeight: 500, fontSize: 14, color: textColor }}>{name}</Text>
                    <Text style={{ fontSize: 12, color: lightText }}>Granted: {granted <= 9 ? `0${granted}` : granted}</Text>
                </SafeAreaView>

                <SafeAreaView style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: 500, fontSize: 26, color: textColor, marginRight: 6, }}>{balance <= 9 ? `0${balance}` : balance}</Text>
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
