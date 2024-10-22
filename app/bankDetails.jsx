import { ImageBackground, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useAppTheme } from '../contexts/AppTheme';
import Colors from '../constants/Colors';
import { ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Importing FontAwesome for the eye icon

const backgroundImage = require("../assets/images/body_bg.png");

const bankDetails = {
    bankName: "UNION BANK OF INDIA",
    branchName: "Kukatpally Hyderabad",
    IFSC: "AKEY24015",
    accountNumber: "1122222234567"
};

export default function BankDetails() {
    const { darkTheme } = useAppTheme();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;

    return (
        <View style={{ backgroundColor: bgColor, flex: 1, }}>
            <ImageBackground source={backgroundImage} style={styles.backImage} />

            {/* Top section */}
            <ScrollView style={{ paddingHorizontal: 10, paddingVertical: 20, gap: 10, display: 'flex' }}>
                <SafeAreaView style={{ gap: 20 }}>
                    <InfoCard text={bankDetails.bankName} header={"Name"} />
                    <InfoCard text={bankDetails.branchName} header={"Branch"} />
                    <InfoCard text={bankDetails.IFSC} header={"IFSC Code"} />

                    <InfoCard text={bankDetails.accountNumber} header={"Account Number"} isSensitiveData={true} />
                </SafeAreaView>
            </ScrollView>
        </View>
    );
}

function InfoCard({ header, text, isSensitiveData = false }) {
    const { darkTheme } = useAppTheme();
    const [showSensitiveData, setShowSensitiveData] = useState(!isSensitiveData);

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;

    return (
        <View style={{ padding: 5, }}>
            <View style={[styles.cardContainer, { borderColor: textColor }]}>
                <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>{header}</Text>
                <Text style={[{ color: textColor }, styles.bodyText]}>
                    {isSensitiveData && !showSensitiveData ? "●●●●●●●●●●●●●●●" : text}
                </Text>

                {isSensitiveData && (
                    <TouchableOpacity
                        onPress={() => setShowSensitiveData(!showSensitiveData)}
                        style={styles.eyeIcon}
                    >
                        <FontAwesome
                            name={showSensitiveData ? "eye" : "eye-slash"}
                            size={20}
                            color={textColor}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    backImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: "cover"
    },
    cardContainer: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center'
    },
    headerText: {
        top: -10,
        left: 10,
        fontSize: 12,
        fontWeight: '500',
        position: 'absolute',
        paddingHorizontal: 5,
    },
    bodyText: {
        fontSize: 14,
        fontWeight: '400',
    },
    eyeIcon: {
        right: 10,
        position: 'absolute',
    },
});
