import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import { useAppTheme } from '../contexts/AppTheme';

const backgroundImage = require("../assets/images/body_bg.png");

const profileDetails = {
    name: "Neha Kumari",
    designation: "Android Developer",
    employeeID: "AKEY24015",
    phoneNumber: "+91 93931 191932",
    email: "nehakumari@ultrakeyit.com",
    dob: "02/12/2003",
    bloodGroup: "A+",
    PANCard: "EPIO98989Y",
    emergencyPhoneNumber1: "+91 98982 24242",
    emergencyPhoneNumber2: "+91 67435 24242",
};

export default function ProfileDetails() {
    const { darkTheme } = useAppTheme();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;

    return (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <ImageBackground source={backgroundImage} style={styles.backImage} />

            <ScrollView style={{ paddingHorizontal: 10, paddingVertical: 20, }}>
                <SafeAreaView style={{ gap: 20 }}>
                    <InfoCard text={profileDetails.name} header={"Name"} />
                    <InfoCard text={profileDetails.bloodGroup} header={"Blood Group"} />
                    <InfoCard text={profileDetails.employeeID} header={"Employee ID"} />
                    <InfoCard text={profileDetails.designation} header={"Designation"} />
                    <InfoCard text={profileDetails.dob} header={"Date of Birth"} />
                    <InfoCard text={profileDetails.PANCard} header={"PAN Card"} />
                    <InfoCard text={profileDetails.phoneNumber} header={"Phone Number"} />
                    <InfoCard text={profileDetails.email} header={"Email ID"} />
                    <InfoCard text={profileDetails.emergencyPhoneNumber1} header={"Emergency Contact"} />
                </SafeAreaView>
            </ScrollView>
        </View>
    );
}

function InfoCard({ header, text }) {
    const { darkTheme } = useAppTheme();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;

    return (
        <View style={{ padding: 5, }}>
            <View style={[styles.cardContainer, { borderColor: textColor }]}>
                <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>{header}</Text>
                <Text style={[{ color: textColor }, styles.bodyText]}>{text}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    backImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: "cover",
    },
    cardContainer: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        position: 'relative',
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
});

