import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "@/components/useColorScheme.web";

export const AppThemeContext = createContext();

export const AppThemeProvider = ({ children }) => {
    const colorScheme = useColorScheme();
    const [darkTheme, setDarkTheme] = useState(colorScheme === "dark");

    // Retrieve the theme from session storage on component mount
    useEffect(() => {
        const getTheme = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem("darkTheme");
                if (storedTheme !== null) {
                    setDarkTheme(JSON.parse(storedTheme));
                }
            } catch (error) {
                console.error("Failed to retrieve theme from AsyncStorage", error);
            }
        };

        getTheme();
    }, []);

    // Store the theme in session storage whenever it changes
    useEffect(() => {
        const storeTheme = async () => {
            try {
                await AsyncStorage.setItem("darkTheme", JSON.stringify(darkTheme));
            } catch (error) {
                console.error("Failed to save theme to AsyncStorage", error);
            }
        };

        storeTheme();
    }, [darkTheme]);

    return (
        <AppThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
            {children}
        </AppThemeContext.Provider>
    );
};

export const useAppTheme = () => useContext(AppThemeContext);