import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import Colors from '../constants/Colors'
import { useAppTheme } from '../contexts/AppTheme'
import { ImageBackground } from 'react-native';

const backgroundImage = require('../assets/images/body_bg.png')

export default function ApplyRegularization() {
    const { darkTheme } = useAppTheme();
    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text

    return (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <ImageBackground source={backgroundImage} style={styles.bgImage} />
            
            <SafeAreaView style={{ padding: 15 }}>
                <Text style={{ color: textColor }}>ApplyRegularization</Text>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    bgImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover'
    }
})