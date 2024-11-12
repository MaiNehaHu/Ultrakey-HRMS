import {
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

import holidays from '../constants/holidaysList';
import months from '../constants/months'; // Array of all month names
import { TouchableOpacity } from "react-native";
import HolidayCard from "../components/Cards/HolidayCard";

const backgroundImage = require("../assets/images/body_bg.png");

export default function HolidaysList() {
    const { darkTheme } = useAppTheme();
    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // Group holidays by month for the selected year
    const groupHolidaysByMonth = (holidays, year) => {
        // Initialize each month with an empty array
        const holidayMap = months.reduce((acc, month) => {
            acc[month] = [];
            return acc;
        }, {});

        // Populate holidays into their respective month, filtering by the selected year
        holidays.forEach(holiday => {
            const holidayDate = new Date(holiday.date);
            const holidayYear = holidayDate.getFullYear();

            if (holidayYear === year) {
                const monthIndex = holidayDate.getMonth();
                const monthName = months[monthIndex];

                holidayMap[monthName].push(holiday);
            }
        });

        return holidayMap;
    };

    const groupedHolidays = groupHolidaysByMonth(holidays, selectedYear);

    // Function to go to the next year
    const handleNextYear = () => {
        setSelectedYear(prevYear => prevYear + 1);
    };

    // Function to go to the previous year
    const handlePreviousYear = () => {
        setSelectedYear(prevYear => prevYear - 1);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
            <ImageBackground source={backgroundImage} style={styles.backImage} />

            <ScrollView style={{ padding: 15 }}>
                <View style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={handlePreviousYear} // Handle previous year
                        style={[styles.backButton, { borderColor: textColor, }]}>
                        <Text style={{ textAlign: 'center', color: textColor }}>Back</Text>
                    </TouchableOpacity>

                    {/* Year */}
                    <Text style={[styles.year, { borderColor: textColor, color: textColor }]}>
                        Year {selectedYear}
                    </Text>

                    <TouchableOpacity
                        onPress={handleNextYear} // Handle next year
                        style={[styles.nextButton, { borderColor: textColor, }]}>
                        <Text style={{ textAlign: 'center', color: textColor }}>Next</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardsContainer}>
                    {months.map((month) => (
                        <HolidayCard
                            key={month}
                            month={month}
                            holidays={groupedHolidays[month] || []}
                            textColor={textColor}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: "cover",
    },
    cardsContainer: {
        flexWrap: 'wrap',
        marginTop: 30,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 8, width: '20%', borderWidth: 2, borderTopLeftRadius: 20, borderBottomLeftRadius: 20
    },
    nextButton: {
        padding: 8, width: '20%', borderWidth: 2, borderTopRightRadius: 20, borderBottomRightRadius: 20
    },
    year: {
        paddingVertical: 8, textAlign: 'center', fontWeight: 600, width: '60%', borderTopWidth: 2, borderBottomWidth: 2,
    }
});
