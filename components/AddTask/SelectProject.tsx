import {
  Modal,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";
import { Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

interface Props {
  placeholder: string;
  onProjectsUpdate: (project: any) => void;
}

const projectList = [
  { projectName: "HRMS", project_id: 1 },
  { projectName: "Trending News Guru", project_id: 2 },
  { projectName: "CRMS", project_id: 3 },
];

export default function SelectProject({
  placeholder,
  onProjectsUpdate,
}: Props) {
  const { darkTheme } = useAppTheme();
  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const textColor = Colors[darkTheme ? "dark" : "light"].text;
  const logoColor = darkTheme ? Colors.white : Colors.lightBlue;

  const [projectInput, setProjectInput] = useState<string>("");
  const [showProjectList, setShowProjectList] = useState<boolean>(false);
  const [filteredProjects, setFilteredProjects] = useState(projectList);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [touchedOption, setTouchedOption] = useState<number | null>(null);

  const slideAnim = useRef(new Animated.Value(200)).current; // Start position off-screen

  const handleProjectSearch = (input: string) => {
    setFilteredProjects(
      projectList.filter((project) =>
        project.projectName.toLowerCase().includes(input.toLowerCase())
      )
    );
  };

  const handleSelectProject = (project: any) => {
    setProjectInput(project.projectName);
    handleCloseModal();
    onProjectsUpdate(project);
  };

  const handleOpenModal = () => {
    setShowProjectList(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleCloseModal = () => {
    Animated.timing(slideAnim, {
      toValue: 700, // Slide back down
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setShowProjectList(false); 
    });
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    // Clean up the listeners on component unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Placeholder-like Button */}
      <Text style={{ color: textColor }}>
        {projectInput ? projectInput : placeholder}
      </Text>

      <TouchableOpacity onPress={handleOpenModal}>
        {projectList.length < 0 ? (
          <Ionicons
            name="add-circle"
            size={30}
            color={logoColor}
            style={{ paddingRight: 4 }}
          />
        ) : (
          <FontAwesome6Icon
            name="edit"
            size={20}
            color={logoColor}
            style={{ paddingVertical: 4, paddingRight: 4 }}
          />
        )}
      </TouchableOpacity>

      {/* Modal for project selection */}
      <Modal
        visible={showProjectList}
        transparent={true}
        onRequestClose={handleCloseModal}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                backgroundColor: bgColor,
                transform: [{ translateY: slideAnim }],
                height: isKeyboardVisible ? "90%" : "60%",
              },
            ]}
          >
            <TextInput
              style={[
                styles.modalSearchInput,
                { color: textColor, borderColor: textColor },
              ]}
              placeholder="Search projects..."
              onChangeText={(text) => handleProjectSearch(text)}
              placeholderTextColor={darkTheme ? "#e0e0e0" : "#666"}
            />

            <FlatList
              data={filteredProjects}
              keyExtractor={(item) => item.project_id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.projectOption,
                    {
                      backgroundColor:
                        touchedOption == item.project_id ? "#e0e0e0" : bgColor,
                    },
                  ]}
                  onPress={() => {
                    setTimeout(() => {
                      handleSelectProject(item);
                    }, 100);
                  }}
                  onPressIn={() => setTouchedOption(item.project_id)}
                  onPressOut={() => setTouchedOption(null)}
                >
                  <Text style={{ color: textColor }}>{item.projectName}</Text>
                </Pressable>
              )}
            />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    borderRadius: 10,
    padding: 15,
  },
  modalSearchInput: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  projectOption: {
    padding: 10,
    paddingVertical: 12,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
  },
});
