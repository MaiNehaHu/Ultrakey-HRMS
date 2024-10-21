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
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;

    return (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <ImageBackground source={backgroundImage} style={styles.backImage} />

            {/* Top section */}
            <ScrollView style={{ padding: 20 }}>
                <SafeAreaView style={{ gap: 20 }}>
                    <View>
                        <Text style={[{ color: headerText }, styles.headerText]}>Name</Text>
                        <Text style={[{ color: textColor }, styles.bodyText]}>{profileDetails.name}</Text>
                    </View>
                    <View>
                        <Text style={[{ color: headerText }, styles.headerText]}>Blood Group</Text>
                        <Text style={[{ color: textColor }, styles.bodyText]}>{profileDetails.bloodGroup}</Text>
                    </View>
                    <View>
                        <Text style={[{ color: headerText }, styles.headerText]}>Employee ID</Text>
                        <Text style={[{ color: textColor }, styles.bodyText]}>{profileDetails.employeeID}</Text>
                    </View>
                    <View>
                        <Text style={[{ color: headerText }, styles.headerText]}>Designation</Text>
                        <Text style={[{ color: textColor }, styles.bodyText]}>{profileDetails.designation}</Text>
                    </View>
                    <View>
                        <Text style={[{ color: headerText }, styles.headerText]}>Date Of Birth</Text>
                        <Text style={[{ color: textColor }, styles.bodyText]}>{profileDetails.dob}</Text>
                    </View>
                    <View>
                        <Text style={[{ color: headerText }, styles.headerText]}>PAN Card</Text>
                        <Text style={[{ color: textColor }, styles.bodyText]}>{profileDetails.PANCard}</Text>
                    </View>
                    <View>
                        <Text style={[{ color: headerText }, styles.headerText]}>Phone Number</Text>
                        <Text style={[{ color: textColor }, styles.bodyText]}>{profileDetails.phoneNumber}</Text>
                    </View>
                    <View>
                        <Text style={[{ color: headerText }, styles.headerText]}>Emergency Contact(s)</Text>
                        <Text style={[{ color: textColor }, styles.bodyText]}>{profileDetails.emergencyPhoneNumber1}</Text>
                        <Text style={[{ color: textColor }, styles.bodyText]}>{profileDetails.emergencyPhoneNumber2}</Text>
                    </View>
                    <View>
                        <Text style={[{ color: headerText }, styles.headerText]}>Email ID</Text>
                        <Text style={[{ color: textColor }, styles.bodyText]}>{profileDetails.email}</Text>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    backImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: "cover",
    },
    headerText: {
        fontSize: 12,
        fontWeight: '500',
    },
    bodyText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
