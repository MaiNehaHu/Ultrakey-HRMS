import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAppTheme } from '../contexts/AppTheme'
import Colors from '../constants/Colors';
import { ResizeMode } from 'expo-av';
import { ScrollView } from 'react-native';

const backgroundImage = require("../assets/images/body_bg.png");

export default function BankDetails() {
    const { darkTheme } = useAppTheme();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;

    return (
        <View style={{ backgroundColor: bgColor, flex: 1, }}>
            <ImageBackground source={backgroundImage} style={styles.backImage} />

            {/* Top section */}
            <ScrollView style={{ padding: 20 }}>

                <Text style={{color: textColor}}>bankDetails</Text>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    backImage: {
        ...StyleSheet.absoluteFillObject,
        ResizeMode: "cover"
    }
})