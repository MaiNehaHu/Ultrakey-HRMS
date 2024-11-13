import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AwesomeIcon from "react-native-vector-icons/FontAwesome6";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLogin } from "@/contexts/Login";

const backgroundImage = require("../assets/images/body_bg.png");
const defaultLogo = require("../assets/images/default_person.webp");

type RootStackParamList = {
  // leaves: undefined;
  index: undefined;
  login: undefined;
  paySlips: undefined;
  bankDetails: undefined;
  holidaysList: undefined;
  profileDetails: undefined;
  regularizationsPage: undefined;
};

export default function MorePage() {
  const { darkTheme } = useAppTheme();
  const { setIsLogged } = useLogin();
  const navigate =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [image, setImage] = useState<{ uri: string } | number>(defaultLogo);
  const [touchedButton, setTouchedButton] = useState<number>();

  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const textColor = Colors[darkTheme ? "dark" : "light"].text;
  const oppBgColor = Colors[!darkTheme ? "dark" : "light"].background;

  // Function to handle image selection and upload
  const handleImagePick = async () => {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio
      quality: 1, // Highest quality
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const selectedImageUri = result.assets[0].uri;

      // Save the image URI to AsyncStorage
      try {
        await AsyncStorage.setItem("profileImage", selectedImageUri);
        setImage({ uri: selectedImageUri });
      } catch (error) {
        console.error("Failed to save image to storage", error);
      }

      // Now upload the image if required
      // uploadImage(selectedImageUri);
    }
  };

  // Load the image from AsyncStorage on component mount
  useEffect(() => {
    const loadImage = async () => {
      try {
        const storedImage = await AsyncStorage.getItem("profileImage");
        if (storedImage !== null) {
          setImage({ uri: storedImage });
        }
      } catch (error) {
        console.error("Failed to load image from storage", error);
      }
    };

    loadImage();
  }, []);

  function handleProfileDetails() {
    navigate.navigate("profileDetails");
  }
  // function handleLeaves() {
  //   navigate.navigate("leaves");
  // }
  function handleBankDetails() {
    navigate.navigate("bankDetails");
  }
  function handlePaySlips() {
    navigate.navigate("paySlips");
  }
  function handleRegularizations() {
    navigate.navigate("regularizationsPage");
  }
  function handleHolidaysList() {
    navigate.navigate("holidaysList");
  }
  function handleLogout() {
    Alert.alert("Are you sure?", "You want to LOGOUT?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, I'm Sure",
        style: "destructive",
        onPress: () => {
          navigate.navigate("login");
          setIsLogged(false);
        },
      },
    ]);
  }

  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        backgroundColor: bgColor,
        justifyContent: "space-between",
      }}
    >
      <ImageBackground source={backgroundImage} style={styles.backImage} />

      {/* Top section */}
      <SafeAreaView>
        <SafeAreaView style={styles.basic_details_container}>
          <View style={{ display: "flex", gap: 5, width: "60%" }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: 500,
                color: textColor,
              }}
            >
              {"Neha Kumari"}
            </Text>
            <Text style={{ color: textColor, fontWeight: 500 }}>
              {"Android Developer"}
            </Text>
            <Text style={{ color: textColor }}>{"AKEY24015"}</Text>
          </View>

          <View style={styles.image_name_container}>
            <View style={{ position: "relative" }}>
              <Image
                // source={image}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                  borderWidth: 3,
                  borderColor: Colors[!darkTheme ? "dark" : "light"].background,
                }}
                source={{
                  uri: "https://i.pinimg.com/736x/e7/1e/ed/e71eed228bdb81e9b08fdf6b55c81191.jpg",
                }}
              />

              {/* Edit profile photo button */}
              <Pressable
                style={[styles.edit_button, { backgroundColor: oppBgColor }]}
                onPress={handleImagePick}
              >
                <Text style={{ color: bgColor }}>
                  <AwesomeIcon name="pen" size={14} />
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>

        {/* Buttons */}
        <SafeAreaView style={{ width: "100%" }}>
          <Pressable
            onPress={handleProfileDetails}
            onPressIn={() => setTouchedButton(1)}
            onPressOut={() => setTouchedButton(0)}
            style={[
              styles.button,
              {
                backgroundColor:
                  touchedButton === 1
                    ? Colors[darkTheme ? "dark" : "light"].buttonBackground
                    : "transparent",
              },
            ]}
          >
            <Text style={{ padding: 25, color: textColor }}>
              <FontAwesome6 name="user-large" size={20} />
            </Text>

            <View>
              <Text style={[styles.button_text_head, { color: textColor }]}>
                Profile Details
              </Text>
              <Text style={[styles.button_text_body, { color: textColor }]}>
                Blood group, contact details
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleBankDetails}
            onPressIn={() => setTouchedButton(2)}
            onPressOut={() => setTouchedButton(0)}
            style={[
              styles.button,
              {
                backgroundColor:
                  touchedButton === 2
                    ? Colors[darkTheme ? "dark" : "light"].buttonBackground
                    : "transparent",
              },
            ]}
          >
            <Text style={{ padding: 25, color: textColor }}>
              <FontAwesome6 name="money-check" size={20} />
            </Text>

            <View>
              <Text style={[styles.button_text_head, { color: textColor }]}>
                Bank Details
              </Text>
              <Text style={[styles.button_text_body, { color: textColor }]}>
                Account details, branch
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handlePaySlips}
            onPressIn={() => setTouchedButton(3)}
            onPressOut={() => setTouchedButton(0)}
            style={[
              styles.button,
              {
                backgroundColor:
                  touchedButton === 3
                    ? Colors[darkTheme ? "dark" : "light"].buttonBackground
                    : "transparent",
              },
            ]}
          >
            <Text style={{ padding: 25, color: textColor }}>
              <FontAwesome6 name="money-check-dollar" size={20} />
            </Text>

            <View>
              <Text style={[styles.button_text_head, { color: textColor }]}>
                Pay Slips
              </Text>
              <Text style={[styles.button_text_body, { color: textColor }]}>
                Salary slips, LOPs
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleRegularizations}
            onPressIn={() => setTouchedButton(6)}
            onPressOut={() => setTouchedButton(0)}
            style={[
              styles.button,
              {
                backgroundColor:
                  touchedButton === 6
                    ? Colors[darkTheme ? "dark" : "light"].buttonBackground
                    : "transparent",
              },
            ]}
          >
            <Text style={{ padding: 25, color: textColor }}>
              <Ionicons name="calendar" size={20} />
            </Text>

            <View>
              <Text style={[styles.button_text_head, { color: textColor }]}>
                Regularizations
              </Text>
              <Text style={[styles.button_text_body, { color: textColor }]}>
                Applied attendace regularizations
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleHolidaysList}
            onPressIn={() => setTouchedButton(4)}
            onPressOut={() => setTouchedButton(0)}
            style={[
              styles.button,
              {
                backgroundColor:
                  touchedButton === 4
                    ? Colors[darkTheme ? "dark" : "light"].buttonBackground
                    : "transparent",
              },
            ]}
          >
            <Text style={{ padding: 25, color: textColor }}>
              <FontAwesome6 name="hand-peace" size={20} />
            </Text>

            <View>
              <Text style={[styles.button_text_head, { color: textColor }]}>
                Holidays List
              </Text>
              <Text style={[styles.button_text_body, { color: textColor }]}>
                List of all holidays in a year
              </Text>
            </View>
          </Pressable>

          {/* <Pressable
            onPress={handleLeaves}
            onPressIn={() => setTouchedButton(4)}
            onPressOut={() => setTouchedButton(0)}
            style={[
              styles.button,
              {
                backgroundColor:
                  touchedButton === 4
                    ? Colors[darkTheme ? "dark" : "light"].buttonBackground
                    : "transparent",
              },
            ]}
          >
            <Text style={{ padding: 25, color: textColor }}>
              <FontAwesome6 name="mug-hot" size={20} />
            </Text>

            <View>
              <Text style={[styles.button_text_head, { color: textColor }]}>
                Leaves
              </Text>
              <Text style={[styles.button_text_body, { color: textColor }]}>
                Apply, balance, calendar
              </Text>
            </View>
          </Pressable> */}
          {/* <Pressable onPress={()=> setTouchedButton(1)} style={[styles.button,{backgroundColor:touchedButton?"transparent":#1a2c54"transparent"}]}>
          <Text style={{ padding: 25, color: textColor }}>
            <FontAwesome6 name="gear" size={20} />
          </Text>

          <View>
            <Text style={[styles.button_text_head, { color: textColor }]}>
              Settings
            </Text>
            <Text style={[styles.button_text_body, { color: textColor }]}>
              
            </Text>
          </View>
        </Pressable> */}
          <Pressable
            onPress={handleLogout}
            onPressIn={() => setTouchedButton(5)}
            onPressOut={() => setTouchedButton(0)}
            style={[
              styles.button,
              {
                backgroundColor:
                  touchedButton === 5
                    ? Colors[darkTheme ? "dark" : "light"].buttonBackground
                    : "transparent",
              },
            ]}
          >
            <Text style={{ padding: 25, color: textColor }}>
              <FontAwesome6 name="right-from-bracket" size={20} />
            </Text>

            <View>
              <Text style={[styles.button_text_head, { color: textColor }]}>
                Logout
              </Text>
              {/* <Text style={[styles.button_text_body, { color: textColor }]}> </Text> */}
            </View>
          </Pressable>
        </SafeAreaView>
      </SafeAreaView>

      {/* Footer */}
      <SafeAreaView style={{ padding: 30 }}>
        <Text style={{ color: textColor, textAlign: "center" }}>
          Designed and Developed by Ultrakey IT Solutions Private Limited.
        </Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  backImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  basic_details_container: {
    padding: 15,
    width: "100%",
    display: "flex",
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e3e3e3",
    justifyContent: "space-between",
  },
  image_name_container: {
    gap: 10,
    width: "40%",
    display: "flex",
    position: "relative",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "transparent",
  },
  edit_button: {
    top: 0,
    right: 0,
    padding: 10,
    borderRadius: 50,
    position: "absolute",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  button_text_head: {
    fontSize: 16,
    fontWeight: 500,
  },
  button_text_body: {
    fontSize: 12,
    fontWeight: 400,
  },
});
