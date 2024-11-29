import { Image, Pressable, StyleSheet, Text, TextInput, View, Animated, ImageBackground, SafeAreaView, ScrollView, Keyboard, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Colors from "../constants/Colors";
import { useAppTheme } from '../contexts/AppTheme';
import { useLogin } from '../contexts/Login';
import logo_light from '../assets/images/logo_light.png';
import logo_dark from '../assets/images/logo_dark.jpg';
import { router, useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
// Import the icon from vector-icons
import Icon from 'react-native-vector-icons/Ionicons';

const bgImage = require('../assets/images/login_bg.png');

const Login = () => {
    const { darkTheme } = useAppTheme();
    const navigation = useNavigation();
    const { isLogged, setIsLogged } = useLogin();
    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const welcomeText = darkTheme ? Colors.dark.text : "#1A6FA8";

    const [isFocused, setIsFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const scaleValue = useRef(new Animated.Value(1)).current;

    function handleLogin() {
        setIsLogged(true);

        setTimeout(() => {
            navigation.navigate('(tabs)')
        }, 100);
    }

    const onPressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.97,
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

    // Reset focus when clicking outside input fields
    const handlePressOutside = () => {
        setIsFocused(false);
        Keyboard.dismiss();
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();

            const currentRoute = navigation.getState().routes[navigation.getState().index].name;

            if (!isLogged) {
                if (currentRoute !== 'login') {
                    navigation.navigate('login');
                }
            } else {
                if (currentRoute !== 'index') {
                    navigation.navigate('index');
                }
            }
        });

        return unsubscribe;
    }, [navigation, isLogged]);

    // Listen to keyboard dismissal and reset focus when the keyboard is hidden
    useEffect(() => {
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setIsFocused(false);
            Keyboard.dismiss();
        });

        return () => {
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <Pressable style={styles.container} onPress={handlePressOutside}>
            {/* Conditionally render the background image based on input focus */}
            {!isFocused && (
                <ImageBackground source={bgImage} style={styles.backgroundImage} />
            )}
            {isFocused && (
                <View style={[styles.backgroundImage, { backgroundColor: bgColor }]} />
            )}

            <SafeAreaView style={[{ backgroundColor: bgColor }, styles.inputsBG]}>
                <ScrollView style={{ width: "100%" }} keyboardShouldPersistTaps="handled">
                    <Image source={darkTheme ? logo_dark : logo_light} style={{ width: '100%', height: 50, objectFit: "contain" }} />

                    <Text style={{ color: welcomeText, textAlign: 'center', fontWeight: 600, fontSize: 24, marginVertical: 30 }}>Welcome !</Text>

                    <SafeAreaView style={{ display: 'flex', gap: 20, }} pointerEvents="box-none">
                        <SafeAreaView>
                            <Text style={{ color: textColor, textAlign: 'left', fontWeight: 500, marginBottom: 5, fontSize: 16, marginLeft: 5 }}>Employee ID</Text>
                            <TextInput
                                type="text"
                                keyboardType='default'
                                placeholder='AKEY....'
                                name="userId"
                                id="userId"
                                style={[styles.inputfield, {
                                    borderWidth: 1,
                                    borderColor: Colors.darkBlue
                                }]}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                            />
                        </SafeAreaView>

                        <SafeAreaView>
                            <Text style={{ color: textColor, textAlign: 'left', fontWeight: 500, marginBottom: 5, fontSize: 16, marginLeft: 5 }}>Password</Text>
                            <View style={[styles.passwordContainer, {
                                borderWidth: 1,
                                borderColor: Colors.darkBlue
                            }]}>
                                <TextInput
                                    type="text"
                                    keyboardType='default'
                                    placeholder='Enter Your Password'
                                    name="password"
                                    id="password"
                                    style={[styles.inputfield, { flex: 1, }]}
                                    secureTextEntry={!passwordVisible} // Show/hide password
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                />
                                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                                    <Icon
                                        name={passwordVisible ? 'eye' : 'eye-off'}
                                        size={24}
                                        color={"#000"}
                                    />
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>

                        <Pressable onPress={() => navigation.navigate('forgotPassword')}>
                            <Text style={{ color: textColor, textAlign: 'right', textDecorationLine: 'underline', fontWeight: 500 }}>
                                Forgot Password?
                            </Text>
                        </Pressable>
                    </SafeAreaView>

                    <Animated.View style={{ transform: [{ scale: scaleValue }], width: '100%' }}>
                        {!darkTheme ? <LinearGradient
                            colors={['#1F366A', '#1A6FA8']}
                            style={styles.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Pressable
                                onPressIn={onPressIn}
                                onPressOut={onPressOut}
                                onPress={handleLogin}
                            >
                                <Text style={{ textAlign: 'center', fontWeight: '600', color: '#fff', fontSize: 18 }}>Login</Text>
                            </Pressable>
                        </LinearGradient>
                            :
                            <Pressable
                                onPressIn={onPressIn}
                                onPressOut={onPressOut}
                                onPress={handleLogin}
                                style={[styles.gradient, { backgroundColor: "#fff" }]}
                            >
                                <Text style={{ textAlign: 'center', fontWeight: '600', color: Colors.darkBlue, fontSize: 18 }}>Login</Text>
                            </Pressable>
                        }
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </Pressable>
    );
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end'
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    },
    inputfield: {
        borderRadius: 30,
        width: '100%',
        fontSize: 16,
        paddingHorizontal: 15,
        paddingVertical: 7,
        backgroundColor: '#fff'
    },
    passwordContainer: {
        display: 'flex',
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    eyeIcon: {
        paddingHorizontal: 10,
    },
    inputsBG: {
        width: "100%",
        padding: 40,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
    },
    gradient: {
        borderRadius: 30,
        width: '100%',
        padding: 10,
        marginTop: 30,
    }
});
