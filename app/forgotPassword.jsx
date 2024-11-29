import { Animated, Image, ImageBackground, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useAppTheme } from '../contexts/AppTheme'
import { Keyboard } from 'react-native';

import logo_light from '../assets/images/logo_light.png';
import logo_dark from '../assets/images/logo_dark.jpg';
import Colors from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
const bgImage = require('../assets/images/login_bg.png');

export default function forgotPassword() {
  const { darkTheme } = useAppTheme();
  const navigation = useNavigation();

  const [next, setNext] = useState(false)
  const [inputEmpId, setInputEmpId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConf, setNewPasswordConf] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfVisible, setPasswordConfVisible] = useState(false);

  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const textColor = Colors[darkTheme ? "dark" : "light"].text;
  const welcomeText = darkTheme ? Colors.dark.text : "#1A6FA8";

  const [isFocused, setIsFocused] = useState(false);

  const scaleValue = useRef(new Animated.Value(1)).current;

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
  // Toggle password visibility
  const togglePasswordConfVisibility = () => {
    setPasswordConfVisible(!passwordConfVisible);
  };

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

          <Text style={{ color: welcomeText, textAlign: 'center', fontWeight: 600, fontSize: 14, marginVertical: 30 }}>It's Okay to Forget Password Sometimes. Let's Reset It!</Text>

          <SafeAreaView style={{ display: 'flex', gap: 20, }} pointerEvents="box-none">
            {!next ?
              <>
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

                <Animated.View style={{ transform: [{ scale: scaleValue }], width: '100%' }}>
                  {!darkTheme ?
                    <LinearGradient
                      colors={['#1F366A', '#1A6FA8']}
                      style={styles.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Pressable
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        onPress={() => setNext(true)}
                      >
                        <Text style={{ textAlign: 'center', fontWeight: '600', color: '#fff', fontSize: 18 }}>Next</Text>
                      </Pressable>
                    </LinearGradient>
                    :
                    <Pressable
                      onPressIn={onPressIn}
                      onPressOut={onPressOut}
                      onPress={() => setNext(true)}
                      style={[styles.gradient, { backgroundColor: "#fff" }]}
                    >
                      <Text style={{ textAlign: 'center', fontWeight: '600', color: Colors.darkBlue, fontSize: 18 }}>Next</Text>
                    </Pressable>
                  }
                </Animated.View>
              </>
              :
              <>
                <SafeAreaView>
                  <Text style={{ color: textColor, textAlign: 'left', fontWeight: 500, marginBottom: 5, fontSize: 16, marginLeft: 5 }}>Password</Text>
                  <View style={[styles.passwordContainer, {
                    borderWidth: 1,
                    borderColor: Colors.darkBlue
                  }]}>
                    <TextInput
                      type="text"
                      keyboardType='default'
                      placeholder='e$24@2....'
                      name="password"
                      id="password"
                      style={[styles.inputfield, { flex: 1, }]}
                      secureTextEntry={!passwordVisible} // Show/hide password
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                      <Ionicons
                        name={passwordVisible ? 'eye' : 'eye-off'}
                        size={24}
                        color={"#000"}
                      />
                    </TouchableOpacity>
                  </View>
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
                      placeholder='e$24@2....'
                      name="passwordConf"
                      id="passwordConf"
                      style={[styles.inputfield, { flex: 1, }]}
                      secureTextEntry={!passwordConfVisible} // Show/hide password
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    />
                    <TouchableOpacity onPress={togglePasswordConfVisibility} style={styles.eyeIcon}>
                      <Ionicons
                        name={passwordConfVisible ? 'eye' : 'eye-off'}
                        size={24}
                        color={"#000"}
                      />
                    </TouchableOpacity>
                  </View>
                </SafeAreaView>

                <Animated.View style={{ transform: [{ scale: scaleValue }], width: '100%' }}>
                  {!darkTheme ?
                    <LinearGradient
                      colors={['#1F366A', '#1A6FA8']}
                      style={styles.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Pressable
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        onPress={() => navigation.navigate('(tabs)')}
                      >
                        <Text style={{ textAlign: 'center', fontWeight: '600', color: '#fff', fontSize: 18 }}>Done</Text>
                      </Pressable>
                    </LinearGradient>
                    :
                    <Pressable
                      onPressIn={onPressIn}
                      onPressOut={onPressOut}
                      onPress={() => navigation.navigate('(tabs)')}
                      style={[styles.gradient, { backgroundColor: "#fff" }]}
                    >
                      <Text style={{ textAlign: 'center', fontWeight: '600', color: Colors.darkBlue, fontSize: 18 }}>Done</Text>
                    </Pressable>
                  }
                </Animated.View>
              </>
            }
          </SafeAreaView>
        </ScrollView>
      </SafeAreaView>
    </Pressable>
  )
}

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
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
});
