import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LoginContext = createContext();

// AsyncStorage.clear()

const getLogins = async () => {
  try {
    const storedLoginStatus = await AsyncStorage.getItem("login");
    if (storedLoginStatus !== null) {
      console.log("Getting Login Status: ", JSON.parse(storedLoginStatus));
      return JSON.parse(storedLoginStatus);
    }
    return false; // Default to 'false' if no login status is found
  } catch (error) {
    console.error("Failed to retrieve login status from AsyncStorage", error);
    return false;
  }
};

export const LoginProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(null); // Use null initially to show loading state

  const fetchLoginStatus = async () => {
    const status = await getLogins();
    setIsLogged(status); // Once resolved, set the status
  };

  const storeLogins = async (loginStatus) => {
    try {
      await AsyncStorage.setItem("login", JSON.stringify(loginStatus));
      console.log("Setting Login Status: ", JSON.stringify(loginStatus));
    } catch (error) {
      console.error("Failed to save login status to AsyncStorage", error);
    }
  };

  useEffect(() => {
    fetchLoginStatus();
  }, []);

  useEffect(() => {
    if (isLogged !== null) {
      storeLogins(isLogged);
    }
  }, [isLogged]);

  return (
    <LoginContext.Provider value={{ isLogged, setIsLogged }}>
      {children}
    </LoginContext.Provider>
  );
};

// Custom hook to use the login context
export const useLogin = () => useContext(LoginContext);
