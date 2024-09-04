import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);

  // Retrieve the theme from session storage on component mount
  const getLogins = async () => {
    try {
      const storedLoginStatus = await AsyncStorage.getItem("login");
      if (storedLoginStatus !== null) {
        setIsLogged(JSON.parse(storedLoginStatus));
      }
    } catch (error) {
      console.error("Failed to retrieve login status from AsyncStorage", error);
    }
  };

  // Store the theme in session storage whenever it changes
  const storeLogins = async () => {
    try {
      await AsyncStorage.setItem("login", JSON.stringify(isLogged));
    } catch (error) {
      console.error("Failed to save login status to AsyncStorage", error);
    }
  };

  useEffect(() => {
    getLogins();
  }, []);

  useEffect(() => {
    storeLogins();
  }, [isLogged]);

  return (
    <LoginContext.Provider value={{ isLogged, setIsLogged }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
