import { SafeAreaView, ScrollView, StyleSheet, Text, ImageBackground, View } from 'react-native'
import React, { useState } from 'react'
import Colors from '../constants/Colors';
import { useAppTheme } from '../contexts/AppTheme'
import { useRegularization } from '../contexts/RegularizationRequest';
import SelectMonthAndYear from '../components/myApp/selectMonth&Year'
import { TouchableOpacity } from 'react-native';
import years from '../constants/years'
import months from '../constants/months';
import { FontAwesome6 } from '@expo/vector-icons';

const bgImage = require('../assets/images/body_bg.png')

export default function RegularizationsPage() {
    const { darkTheme } = useAppTheme();
    const { regularizationRequest } = useRegularization()
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
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <ImageBackground source={bgImage} style={styles.backImage} />

            <ScrollView style={{ padding: 15 }}>
                <SafeAreaView style={styles.flex_row_top}>
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
                        <FontAwesome6 name="calendar-alt" size={22} color={textColor} />
                    </TouchableOpacity>
                </SafeAreaView>

                <SafeAreaView style={styles.cardsContainer}>

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
        </View>
    )
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
})