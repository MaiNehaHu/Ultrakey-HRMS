import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/contexts/AppTheme";
import AwesomeIcon from "react-native-vector-icons/FontAwesome6";
import * as ImagePicker from "expo-image-picker";

const defaultLogo = require("@/assets/images/default_person.webp");

const Profile: React.FC = () => {
  const { darkTheme } = useAppTheme();
  const [image, setImage] = useState<{ uri: string } | number>(defaultLogo); // State for selected image
  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const oppBgColor = Colors[!darkTheme ? "dark" : "light"].background;
  const textColor = Colors[darkTheme ? "dark" : "light"].text;

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

  // Function to upload the image to the server
  // const uploadImage = async (imageUri: string) => {
  //   const formData = new FormData();

  //   formData.append("file", {
  //     uri: imageUri, // The URI from the ImagePicker
  //     name: "profile.jpg", // The name of the file
  //     type: "image/jpeg", // The type of the file
  //   } as any); // `as any` to bypass TypeScript error

  //   try {
  //     const response = await fetch("YOUR_UPLOAD_URL", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //       body: formData,
  //     });

  //     const result = await response.json();
  //     console.log("Image uploaded successfully:", result);
  //   } catch (error) {
  //     console.error("Image upload failed:", error);
  //   }
  // };

  return (
    <View style={{ padding: 15, backgroundColor: bgColor, flex: 1 }}>
      <View style={styles.image_name_container}>
        <View style={{ position: "relative" }}>
          <Image
            source={image}
            style={[styles.personImage, { borderColor: oppBgColor }]}
          />
          <Pressable
            style={[styles.edit_button, { backgroundColor: oppBgColor }]}
            onPress={handleImagePick}
          >
            <Text style={{ color: bgColor }}>
              <AwesomeIcon name="pen" size={16} />
            </Text>
          </Pressable>
        </View>

        <Text style={{ color: oppBgColor, fontWeight: "500", fontSize: 18 }}>
          Neha Kumari
        </Text>
      </View>

      <View style={styles.dataContainer}>
        <View style={styles.flex_row}>
          <Text style={[styles.dataText, { color: textColor }]}>
            Designation:
          </Text>
          <Text style={[styles.dataText, { color: textColor }]}>
            Android Developer
          </Text>
        </View>
        <View style={styles.flex_row}>
          <Text style={[styles.dataText, { color: textColor }]}>DOB:</Text>
          <Text style={[styles.dataText, { color: textColor }]}>
            02/12/2003
          </Text>
        </View>
        <View style={styles.flex_row}>
          <Text style={[styles.dataText, { color: textColor }]}>
            Phone number:
          </Text>
          <Text style={[styles.dataText, { color: textColor }]}>
            +91 93939 39393
          </Text>
        </View>
        <View style={styles.flex_row}>
          <Text style={[styles.dataText, { color: textColor }]}>
            Contact mail:
          </Text>
          <Text style={[styles.dataText, { color: textColor }]}>
            nehakumari@ultrakeyit.com
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  personImage: {
    width: 150,
    height: 150,
    borderRadius: 200,
    borderWidth: 5,
  },
  image_name_container: {
    gap: 10,
    display: "flex",
    marginBottom: 10,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  edit_button: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 10,
    borderRadius: 50,
  },
  dataContainer: {
    gap: 10,
    marginTop: 20,
    width: "100%",
    display: "flex",
    paddingHorizontal: 30,
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  dataText: {
    width: "50%",
    fontWeight: "400",
  },
  flex_row: {
    display: "flex",
    flexDirection: "row",
  },
});

