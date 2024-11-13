import { SafeAreaView, ScrollView, StyleSheet, Text, ImageBackground, View, Pressable, FlatList, Touchable } from 'react-native'
import React, { useState } from 'react'
import Colors from '../constants/Colors';
import { useAppTheme } from '../contexts/AppTheme'
import { useRegularization } from '../contexts/RegularizationRequest';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import years from '../constants/years'
import months from '../constants/months';
import attendace from '../constants/attendace';

import RegDetails from '../components/Modals/RegDetails';
import SelectMonthAndYear from '../components/myApp/selectMonth&Year'
import RegularizationsCard from '../components/Cards/RegularizationsCard';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import leaveStatus from '../constants/leaveStatus';
import { formatDateInGB } from '../constants/formatDateInGB';

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

    const filteredRegularization = regularizationRequest.filter((request) => {
        const date = new Date(request.date);

        return (
            (date.getFullYear() === pickerModalState.selectedYear &&
                date.getMonth() === pickerModalState.selectedMonth)
        );
    });

    const regularizedDates = regularizationRequest
        .filter(request => request.status !== leaveStatus.Withdrawn)
        .map(request => new Date(request.date).toISOString().split('T')[0]);

    return (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <ImageBackground source={bgImage} style={styles.backImage} />

            <View style={{ padding: 15, paddingBottom: 0, flex: 1, }}>
                <SafeAreaView>
                    {/* <Text style={{ color: textColor, fontSize: 16, fontWeight: "500" }}>
                        You have less attendance on:
                    </Text> */}

                    <SafeAreaView style={{ marginBottom: 20, }}>
                        <FlatList
                            data={attendace.filter(
                                (item) =>
                                    item.percentage < 90
                                    && !regularizedDates.includes(new Date(item?.date).toISOString().split('T')[0]))
                            }
                            renderItem={({ item }) => (
                                <CountCards date={item.date} item={item} percentage={item.percentage} latePunchIn={item.latePunchIn} />
                            )}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 15 }}
                        />
                    </SafeAreaView>
                </SafeAreaView>

                <View style={{ flex: 1, /** Saves life for scrolling component */ }}>
                    <View style={styles.display_flex}>
                        {/* Header */}
                        <Text style={{ color: textColor, fontSize: 16, fontWeight: "500" }}>
                            Applied for {months[pickerModalState.selectedMonth]}{" "}
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
                            <Ionicons name="calendar" size={22} color={textColor} />
                        </TouchableOpacity>
                    </View>

                    {/* filtered Leaves List */}
                    <ScrollView style={{ marginTop: 15 }} showsVerticalScrollIndicator={false}>
                        {filteredRegularization.length > 0 ?
                            filteredRegularization.map((reg, index) => (
                                <RegularizationsCard
                                    key={index}
                                    regularizeData={reg}
                                    setShowRegDetailsModal={setShowRegDetailsModal}
                                    setRegularizationModalId={setRegularizationModalId}
                                />
                            )) :
                            <Text style={{ color: textColor, textAlign: "center", marginTop: 30 }}>
                                No regularization applied for this month.
                            </Text>
                        }
                    </ScrollView>
                </View>
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

function CountCards({ date, percentage, item }) {
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
                    <Text style={{ fontWeight: 500, fontSize: 16, color: textColor }}>{formatDateInGB(date)}</Text>
                    <Text style={{ fontSize: 12, color: lightText }}>Percentage: {percentage <= 9 ? `0${percentage}` : percentage}%</Text>
                </SafeAreaView>

                <SafeAreaView style={{ display: 'flex', alignItems: 'flex-end', marginTop: 5 }}>
                    <TouchableOpacity
                        onPress={() => {
                            router.push({
                                pathname: '/applyRegularization',
                                params: {
                                    firstPunchIn: new Date(item.punchRecords[0].punchIn).toISOString(),
                                    lastPunchOut: new Date(item.punchRecords[item.punchRecords?.length - 1].punchOut).toISOString(),
                                    date: new Date(item.date).toISOString()
                                }
                            })
                        }}
                        style={{ backgroundColor: Colors.lightBlue, paddingVertical: 5, paddingHorizontal: 15, borderRadius: 30 }}>
                        <Text style={{ fontSize: 12, color: Colors.white, fontWeight: 500 }}>APPLY</Text>
                    </TouchableOpacity>
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
    flex_row_top: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    cardsContainer: {
        gap: 20,
        // flex: 1,
        display: "flex",
        marginVertical: 25,
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
})