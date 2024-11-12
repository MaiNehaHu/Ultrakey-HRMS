import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAppTheme } from '../../contexts/AppTheme';
import { SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';

export default function HolidayCard({ month, holidays }) {
    const { darkTheme } = useAppTheme();

    return (
        <View style={styles.card}>
            {
                !darkTheme ?
                    <LinearGradient
                        colors={['#1F366A', '#1A6FA8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.duplicateTaskCard}
                    />
                    :
                    <View
                        style={[styles.duplicateTaskCard, { backgroundColor: '#1A6FA8' }]}
                    />
            }

            <SafeAreaView style={styles.taskCard}>
                <Text style={[styles.monthText, { color: '#000' }]}>{month}</Text>

                {holidays.length > 0 ? (
                    holidays.map((holiday, index) => {
                        const date = new Date(holiday.date).getDate().toString().padStart(2, '0');
                        return (
                            <Text key={index} style={[styles.holidayText, { color: '#000' }]}>
                                {`${date} ${holiday.name}`}
                            </Text>
                        );
                    })
                ) : (
                    <Text style={{ color: '#000' }}>No Holidays</Text>
                )}
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '48%',
        marginBottom: 16,
    },
    taskCard: {
        flex: 1,
        borderRadius: 15,
        padding: 12,
        borderWidth: 0.5,
        borderTopWidth: 0,
        shadowColor: "#000",
        borderColor: "#929394",
        backgroundColor: Colors.white,
    },
    duplicateTaskCard: {
        top: -6,
        left: 0,
        right: 0,
        zIndex: -1,
        position: "absolute",
        height: "100%",
        borderRadius: 20,
        elevation: 5,
        shadowRadius: 15,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
    },
    monthText: {
        fontSize: 16,
        fontWeight: 500,
        marginBottom: 5,
    },
    holidayText: {
        fontSize: 14,
    },
})