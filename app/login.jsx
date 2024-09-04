import { Image, Pressable, StyleSheet, Text, TextInput, View, Animated } from 'react-native';
import React, { useRef } from 'react';
import Colors from "../constants/Colors";
import { useAppTheme } from '../contexts/AppTheme';
import { useLogin } from '../contexts/Login';
import logo_light from '../assets/images/logo_light.jpg';
import logo_dark from '../assets/images/logo_dark.jpg';
import { router } from 'expo-router';

const Login = () => {
    const { darkTheme } = useAppTheme();
    const { setIsLogged } = useLogin()
    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const oppBgColor = Colors[!darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;

    const scaleValue = useRef(new Animated.Value(1)).current;

    function handleLogin() {
        setIsLogged(true);

        setTimeout(() => {
            router.push({
                pathname: '(tabs)',
            });
        }, 100);
    }

    const onPressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={{ backgroundColor: bgColor, flex: 1, paddingHorizontal: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={darkTheme ? logo_dark : logo_light} style={{ width: 100, height: 100 }} />

            <Text style={{ color: textColor }}>Ultrakey IT Solutions Pvt. Ltd. Welcomes you!</Text>

            <View style={[{ backgroundColor: oppBgColor }, styles.card]}>
                <TextInput type="text" keyboardType='default' placeholder='Enter Your ID' name="userId" id="userId" style={[styles.inputfield, { borderColor: bgColor }]} />
                <TextInput type="text" keyboardType='default' placeholder='Enter Your Password' name="password" id="password" style={[styles.inputfield, { borderColor: bgColor }]} />

                <Animated.View style={{ transform: [{ scale: scaleValue }], width: '100%' }}>
                    <Pressable
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        onPress={handleLogin}
                        style={[{ backgroundColor: bgColor }, styles.button]}
                    >
                        <Text style={{ textAlign: 'center', fontWeight: '600', color: oppBgColor, fontSize: 18 }}>Login</Text>
                    </Pressable>
                </Animated.View>
            </View>
        </View>
    );
}

export default Login;

const styles = StyleSheet.create({
    card: {
        rowGap: 10,
        padding: 20,
        marginTop: 40,
        width: '100%',
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    inputfield: {
        borderWidth: 1,
        borderRadius: 10,
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#fff'
    },
    button: {
        width: '100%',
        padding: 10,
        textAlign: 'center',
        borderRadius: 10,
        marginTop: 20,
    }
});
