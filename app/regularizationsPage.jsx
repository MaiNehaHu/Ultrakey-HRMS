import { SafeAreaView, ScrollView, StyleSheet, Text, ImageBackground, View, Pressable } from 'react-native'
import React, { useState } from 'react'
import Colors from '../constants/Colors';
import { useAppTheme } from '../contexts/AppTheme'
import { useRegularization } from '../contexts/RegularizationRequest';
import SelectMonthAndYear from '../components/myApp/selectMonth&Year'
import { TouchableOpacity } from 'react-native';
import years from '../constants/years'
import months from '../constants/months';
import { FontAwesome6 } from '@expo/vector-icons';
import leaveStatus from '../constants/leaveStatus';
import RegDetails from '../components/myApp/RegDetails';

const bgImage = require('../assets/images/body_bg.png')

export default function RegularizationsPage() {
    const { darkTheme } = useAppTheme();
    const { regularizationRequest } = useRegularization();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;

    const [showRegDetailsModal, setShowRegDetailsModal] = useState(false);
    const [regularizationModalId, setRegularizationModalId] = useState(false);
    const [pickerModalState, setPickerModalState] = useState({
        tempYear: new Date().getFullYear(),
        selectedYear: new Date().getFullYear(),
        tempMonth: new Date().getMonth(),
        selectedMonth: new Date().getMonth(),
        showPickerMonthModal: false,
        showPickerYearModal: false,
    });

    return (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <ImageBackground source={bgImage} style={styles.backImage} />

            <ScrollView style={{ padding: 15 }}>
                <SafeAreaView style={styles.flex_row_top}>
                    <Text style={{ color: textColor, fontSize: 16, fontWeight: "500" }}>
                        Applied in {months[pickerModalState.selectedMonth]}{" "}
                        {pickerModalState.selectedYear}
                    </Text>

                    <TouchableOpacity
                        onPress={() =>
                            setPickerModalState((prevState) => ({
                                ...prevState,
                                showPickerMonthModal: true,
                            }))
                        }
                    >
                        <FontAwesome6 name="calendar-alt" size={22} color={textColor} />
                    </TouchableOpacity>
                </SafeAreaView>

                <SafeAreaView style={styles.cardsContainer}>
                    {regularizationRequest.map((reg, index) => (
                        <RegularizationsCard
                            regularize={reg}
                            key={index}
                            setShowRegDetailsModal={setShowRegDetailsModal}
                            setRegularizationModalId={setRegularizationModalId}
                        />
                    ))}
                </SafeAreaView>
            </ScrollView>

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
                )}

            {showRegDetailsModal &&
                <RegDetails
                    isVisible={showRegDetailsModal}
                    regularizationModalId={regularizationModalId}
                    setShowRegDetailsModal={setShowRegDetailsModal}
                />
            }
        </View>
    )
}

function RegularizationsCard({ regularize, setShowRegDetailsModal, setRegularizationModalId }) {
    const formatDate = (date) => {
        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            console.error("Invalid date:", date);
            return "Invalid date";
        }

        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            // year: '2-digit',
        }).format(parsedDate);
    };

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

    const statusColor =
        regularize.status === leaveStatus.Pending
            ? "orange"
            : regularize.status === leaveStatus.Approved
                ? Colors.lightBlue
                : regularize.status === leaveStatus.Rejected
                    ? "red"
                    : "gray";

    return (
        <Pressable onPress={() => handleClick(regularize.reg_id)}>
            <View style={[styles.duplicateCard, { backgroundColor: statusColor }]} />
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
                        Applied for {formatDate(regularize?.date)}
                    </Text>

                    <Text style={[styles.status, { backgroundColor: statusColor }]} >
                        {regularize.status}
                    </Text>
                </SafeAreaView>

                <Text style={{ color: "#000", fontSize: 12, }}>
                    Punch In: {formatTime(regularize?.originalRecords?.punchIn)}
                </Text>
                <SafeAreaView style={styles.flex_row_top}>
                    <Text style={{ color: "#000", fontSize: 12, }}>
                        Punch Out: {formatTime(regularize?.originalRecords?.punchOut)}
                    </Text>
                    <Text style={{ color: "#000", fontSize: 12, }}>
                        Applied on {formatDate(regularize.appliedOn)}
                    </Text>
                </SafeAreaView>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    backImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: "cover",
    },
    flex_row_top: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    cardsContainer: {
        gap: 20,
        display: "flex",
        marginVertical: 30,
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
        justifyContent: 'space-around'
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
})