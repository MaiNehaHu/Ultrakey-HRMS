import { Animated, ImageBackground, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { useAppTheme } from '../contexts/AppTheme'
import Colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { shareAsync } from "expo-sharing";
import { printToFileAsync } from 'expo-print';
import * as FileSystem from "expo-file-system";
import salaryPdfHtml from "@/app/salaryPdfHtml";

import months from '../constants/months';
import years from '../constants/years';
import SelectMonthAndYear from '../components/myApp/selectMonth&Year';
const backgroundImage = require("../assets/images/body_bg.png");

export default function paySlips() {
    const html = salaryPdfHtml();
    const { darkTheme } = useAppTheme();

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;

    const [pickerModalState, setPickerModalState] = useState({
        tempYear: new Date().getFullYear(),
        selectedYear: new Date().getFullYear(),
        tempMonth: new Date().getMonth(),
        selectedMonth: new Date().getMonth(),
        showPickerMonthModal: false,
        showPickerYearModal: false,
    });

    const handleShare = async () => {
        try {
            const file = await printToFileAsync({
                html: html,
                base64: false,
            });

            const newFilePath = `${FileSystem.documentDirectory
                }PaySlip_${pickerModalState.selectedMonth}_${pickerModalState.selectedYear}.pdf`;

            await FileSystem.moveAsync({
                from: file.uri,
                to: newFilePath,
            });

            await shareAsync(newFilePath);
        } catch (error) {
            console.error("Error sharing screenshot:", error);
        }
    };

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
        <View style={{ backgroundColor: bgColor, flex: 1, }}>
            <ImageBackground source={backgroundImage} style={styles.bgImage} />

            <SafeAreaView style={{ padding: 15, flex: 1, }}>
                <SafeAreaView style={styles.flex_row_top}>
                    <Text style={{ color: textColor, fontSize: 16, fontWeight: "500" }}>
                        Month and Year: {months[pickerModalState.selectedMonth]}{" "}
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

                <ScrollView style={{ flex: 1, }}>
                    <View
                        style={[
                            styles.table,
                            {
                                borderColor: textColor,
                                backgroundColor: bgColor,
                            },
                        ]}
                    >
                        {/* Employer  */}
                        <TableRow left={"Basic"} right={"₹6200"} />
                        <TableRow left={"HRA"} right={"₹2600"} />
                        <TableRow left={"Convyeance"} right={"₹900"} />
                        <TableRow left={"Medical Allowance"} right={"₹900"} />
                        <TableRow left={"Special Allowance"} right={"₹4400"} />
                        <TableRow left={"Total"} right={"₹15000"} />
                    </View>

                    <Text style={{ color: textColor, fontSize: 16, fontWeight: 500, marginVertical: 20 }}>Net Pay For {months[pickerModalState.selectedMonth]}: {"₹15000"}</Text>

                    <SafeAreaView style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            {!darkTheme ?
                                <LinearGradient
                                    colors={['#1F366A', '#1A6FA8']}
                                    style={styles.gradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Pressable
                                        onPress={handleShare}
                                        onPressIn={handlePressIn}
                                        onPressOut={handlePressOut}
                                    >
                                        <Text style={{ color: oppTextColor, fontWeight: 500, fontSize: 14 }}>Download PaySlip</Text>
                                    </Pressable>
                                </LinearGradient>
                                :
                                <Pressable
                                    onPress={handleShare}
                                    onPressIn={handlePressIn}
                                    onPressOut={handlePressOut}
                                    style={[{ backgroundColor: Colors.white }, styles.gradient]}>
                                    <Text style={{ color: Colors.darkBlue, fontWeight: 500, fontSize: 14 }}>Download PaySlip</Text>
                                </Pressable>
                            }
                        </Animated.View>
                    </SafeAreaView>
                </ScrollView>
            </SafeAreaView>

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
        </View>
    )
}

function TableRow({ left, right }) {
    const { darkTheme } = useAppTheme()
    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;

    return (
        <View
            style={[
                styles.tableRow,
                { backgroundColor: bgColor, borderColor: textColor },
            ]}
        >
            <Text style={[styles.tableCell, { color: textColor }]}>
                {left}
            </Text>
            <Text style={[styles.tableCellValue, { color: textColor }]}>
                {right}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    bgImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover'
    },
    flex_row_top: {
        display: "flex",
        paddingBottom: 20,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    table: {
        width: "100%",
        marginTop: 5,
        borderWidth: 1,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 8,
        borderBottomWidth: 1,
        paddingHorizontal: 15,
        justifyContent: "space-between",
    },
    tableCell: {
        fontSize: 14,
        fontWeight: "400",
    },
    tableCellValue: {
        fontSize: 14,
        fontWeight: "bold",
    },
    gradient: {
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 20,
    }
})