import { ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useAppTheme } from '../contexts/AppTheme'
import Colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

import months from '../constants/months';
import years from '../constants/years';
import SelectMonthAndYear from '../components/myApp/selectMonth&Year';

const backgroundImage = require("../assets/images/body_bg.png");

export default function paySlips() {
    const { darkTheme } = useAppTheme();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;

    const [pickerModalState, setPickerModalState] = useState({
        tempYear: new Date().getFullYear(),
        selectedYear: new Date().getFullYear(),
        tempMonth: new Date().getMonth(),
        selectedMonth: new Date().getMonth(),
        showPickerMonthModal: false,
        showPickerYearModal: false,
    });

    return (
        <View style={{ backgroundColor: bgColor, flex: 1, }}>
            <ImageBackground source={backgroundImage} style={styles.bgImage} />

            <SafeAreaView style={{ padding: 15, }}>
                <SafeAreaView style={styles.flex_row_top}>
                    <Text style={{ color: textColor, fontSize: 16, fontWeight: "500" }}>
                        Pay Slips for {months[pickerModalState.selectedMonth]}{" "}
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

const styles = StyleSheet.create({
    bgImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover'
    },
    flex_row_top: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
})