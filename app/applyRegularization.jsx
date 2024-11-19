import { ActivityIndicator, Animated, Pressable, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Colors from '../constants/Colors';
import { useAppTheme } from '../contexts/AppTheme';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useRegularization } from '../contexts/RegularizationRequest';
import DateTimePicker from 'react-native-modal-datetime-picker';
import leaveStatus from '../constants/leaveStatus';
import { formatDateInGB } from '../constants/formatDateInGB';

const backgroundImage = require('../assets/images/body_bg.png');

export default function ApplyRegularization() {
    const route = useLocalSearchParams();
    const navigation = useNavigation()
    const { setRegularizationRequest } = useRegularization();
    const { date, firstPunchIn, lastPunchOut } = route;

    const [loading, setLoading] = useState(false);
    const [punchRecords, setPunchRecords] = useState({
        reason: "",
        firstPunchIn: null,
        lastPunchOut: null,
    });
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [pickerType, setPickerType] = useState(null);

    const { darkTheme } = useAppTheme();
    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const oppBgColor = Colors[!darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const parsedDate = new Date(date);

    function handleRegularizationSubmit() {
        setLoading(true);

        // Append new regularization request to the existing array
        setRegularizationRequest((prev) => [
            ...prev,
            {
                date,
                reg_id: Math.random() * 100,
                status: leaveStatus.Pending,
                appliedOn: new Date().toISOString(),
                originalRecords: { punchIn: firstPunchIn, punchOut: lastPunchOut },
                regularizedRecords: { punchIn: punchRecords.firstPunchIn, punchOut: punchRecords.lastPunchOut },
            }
        ]);

        setLoading(false);
        navigation.goBack();
    }

    const showPicker = (type) => {
        setPickerType(type);
        setPickerVisible(true);
    };

    const handleConfirm = (time) => {
        setPunchRecords((prevRecords) => {
            const updatedDate = new Date(parsedDate);
            updatedDate.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0);

            return {
                ...prevRecords,
                [pickerType]: updatedDate,
            };
        });
        setPickerVisible(false);
    };

    function handleReasonEnter(text) {
        setPunchRecords((prev) => ({
            ...prev,
            reason: text
        }));
    }

    const formatTime = (date) => {
        return new Intl.DateTimeFormat("en-GB", {
            minute: '2-digit',
            hour: '2-digit',
            second: '2-digit',
            hour12: true,
        }).format(new Date(date));
    };

    useEffect(() => {
        if (!isNaN(parsedDate)) {
            const firstPunchIn = new Date(parsedDate);
            firstPunchIn.setHours(9, 30, 0, 0); // 9:30 AM

            const lastPunchOut = new Date(parsedDate);
            lastPunchOut.setHours(19, 0, 0, 0); // 7:00 PM

            setPunchRecords({ firstPunchIn, lastPunchOut });
        } else {
            console.error("Invalid date format");
        }
    }, []);

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
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <ImageBackground source={backgroundImage} style={styles.bgImage} />

            <View style={{ padding: 15, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <SafeAreaView style={{ display: 'flex', gap: 20 }}>
                    <View>
                        <Text style={[styles.boldText, { color: textColor, marginBottom: 10 }]}>Original Records</Text>

                        <View style={styles.flex_row}>
                            <Text style={{ color: textColor }}>Punch In:</Text>
                            <Text style={{ color: textColor }}>Punch Out:</Text>
                        </View>
                        <View style={styles.flex_row}>
                            <Text style={{ color: textColor, fontWeight: '500', fontSize: 15 }}>{formatTime(firstPunchIn)}</Text>
                            <Text style={{ color: textColor, fontWeight: '500', fontSize: 15 }}>{formatTime(lastPunchOut)}</Text>
                        </View>
                    </View>

                    <View>
                        <Text style={[styles.boldText, { color: textColor, marginBottom: 10 }]}>Regularize To</Text>

                        <View style={styles.flex_row}>
                            <Text style={{ color: textColor }}>Punch In:</Text>
                            <Text style={{ color: textColor }}>Punch Out:</Text>
                        </View>
                        <View style={styles.flex_row}>
                            <TouchableOpacity onPress={() => showPicker('firstPunchIn')}>
                                <Text style={{ color: textColor, fontWeight: '500', fontSize: 15 }}>{formatTime(punchRecords.firstPunchIn)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => showPicker('lastPunchOut')}>
                                <Text style={{ color: textColor, fontWeight: '500', fontSize: 15 }}>{formatTime(punchRecords.lastPunchOut)}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.flex_row}>
                            <Text style={{ color: textColor, fontSize: 12 }}>(Editable)</Text>
                            <Text style={{ color: textColor, fontSize: 12 }}>(Editable)</Text>
                        </View>
                    </View>

                    <View style={{ padding: 5 }}>
                        <View style={[styles.cardContainer, { borderColor: textColor }]}>
                            <Text style={[{ color: textColor, backgroundColor: bgColor }, styles.headerText]}>Reason</Text>
                            <TextInput
                                style={{ color: textColor, borderColor: textColor }}
                                placeholder="Reason for regularization"
                                value={punchRecords.reason}
                                onChangeText={handleReasonEnter}
                                placeholderTextColor={darkTheme ? "#e3e3e3" : "#666666"}
                            />
                        </View>
                    </View>

                    {/* Time picker */}
                    <DateTimePicker
                        mode="time"
                        isVisible={isPickerVisible}
                        onConfirm={handleConfirm}
                        onCancel={() => setPickerVisible(false)}
                    />

                </SafeAreaView>

                <SafeAreaView>
                    <Text style={{ color: textColor, marginBottom: 10, textAlign: 'center' }}>Applying regularization for {formatDateInGB(new Date(date))}</Text>
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <Pressable
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={handleRegularizationSubmit}
                            style={[styles.submitButton, { backgroundColor: oppBgColor }]}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={oppTextColor} />
                            ) : (
                                <Text style={[styles.boldText, { color: oppTextColor }]}>Apply</Text>
                            )}
                        </Pressable>
                    </Animated.View>
                </SafeAreaView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bgImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover'
    },
    submitButton: {
        padding: 10,
        borderRadius: 30
    },
    boldText: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
    },
    flex_row: {
        display: 'flex',
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    cardContainer: {
        borderWidth: 1,
        borderRadius: 10,
        position: 'relative',
        paddingVertical: 5,
        paddingHorizontal: 10,
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