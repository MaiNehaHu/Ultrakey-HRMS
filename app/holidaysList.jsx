import {
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import React from "react";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";
import { ScrollView } from "react-native";

const backgroundImage = require("../assets/images/body_bg.png");

export default function HolidaysList() {
    const { darkTheme } = useAppTheme();
    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
            <ImageBackground source={backgroundImage} style={styles.backImage} />

            <ScrollView style={{ padding: 15 }}></ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: "cover",
    },
});