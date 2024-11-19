import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  Keyboard,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";

const defaultImage = require("../../assets/images/default_person.webp");

const assigneeList = [
  { name: "Arun", id: 5 },
  { name: "Bheem", id: 7 },
  { name: "Bheemeshwar", id: 1 },
  { name: "Bheemeshwara", id: 6 },
  { name: "Bheemeshwaraa", id: 4 },
  { name: "Neha", id: 3 },
];

interface Props {
  onAssigneesUpdate: (updatedAssignees: any[]) => void;
}

interface ModalProps {
  isModalVisible: boolean;
  handleCloseModal: any;
  isKeyboardVisible: boolean;
  setAssigneeInput: any;
  setFilteredAssignees: any;
  assigneeInput: string;
  selectedAssignees: any[];
  handleRemoveAssignee: any;
  filteredAssignees: any[];
  handleAddAssignee: any;
  slideModalAnim: any;
}

export default function SelectAssignee({ onAssigneesUpdate }: Props) {
  const { darkTheme } = useAppTheme();
  // const textColor = Colors[darkTheme ? "dark" : "light"].text;
  const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;
  const logoColor = darkTheme ? Colors.white : Colors.lightBlue;

  const [assigneeInput, setAssigneeInput] = useState("");
  const [filteredAssignees, setFilteredAssignees] = useState(assigneeList);
  const [selectedAssignees, setSelectedAssignees] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const slideModalAnim = useRef(new Animated.Value(200)).current; // Start position off-screen

  const handleAddAssignee = (assignee: any) => {
    if (!selectedAssignees.some((selected) => selected.id === assignee.id)) {
      const updatedAssignees = [...selectedAssignees, assignee];
      setSelectedAssignees(updatedAssignees);
      onAssigneesUpdate && onAssigneesUpdate(updatedAssignees);
    }
    setAssigneeInput("");
  };

  const handleRemoveAssignee = (assigneeId: number) => {
    const updatedAssignees = selectedAssignees.filter(
      (a) => a.id !== assigneeId
    );
    setSelectedAssignees(updatedAssignees);
    onAssigneesUpdate && onAssigneesUpdate(updatedAssignees);
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
    Animated.timing(slideModalAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleCloseModal = () => {
    Animated.timing(slideModalAnim, {
      toValue: 700, // Slide back down
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setIsModalVisible(false);
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
    <SafeAreaView style={styles.inputWrapper}>
      {/* Selected Assignees Display */}
      <View style={styles.assigneeContainer}>
        {selectedAssignees.map((assignee: any) => (
          <View
            key={assignee.id}
            style={[
              styles.assigneeTag,
              { backgroundColor: darkTheme ? Colors.white : "#e0e0e0" },
            ]}
          >
            <Image
              source={defaultImage}
              style={{ width: 25, height: 25, borderRadius: 20 }}
            />
            <Text style={styles.assigneeText}>{assignee.name}</Text>
            <TouchableOpacity onPress={() => handleRemoveAssignee(assignee.id)}>
              <Ionicons name="close-circle" size={22} color="black" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Button to Open Modal */}
        <TouchableOpacity
          onPress={handleOpenModal}
          style={[styles.addButton, { backgroundColor: logoColor }]}
        >
          <Text style={{ color: oppTextColor }}>Add</Text>
          <Ionicons name="add-circle" color={oppTextColor} size={22} />
        </TouchableOpacity>
      </View>

      {/* Modal for Selecting Assignees */}
      <SelectAssigneeModal
        isModalVisible={isModalVisible}
        handleCloseModal={handleCloseModal}
        isKeyboardVisible={isKeyboardVisible}
        setAssigneeInput={setAssigneeInput}
        setFilteredAssignees={setFilteredAssignees}
        assigneeInput={assigneeInput}
        selectedAssignees={selectedAssignees}
        handleRemoveAssignee={handleRemoveAssignee}
        filteredAssignees={filteredAssignees}
        handleAddAssignee={handleAddAssignee}
        slideModalAnim={slideModalAnim}
      />
    </SafeAreaView>
  );
}

function SelectAssigneeModal({
  isModalVisible,
  handleCloseModal,
  isKeyboardVisible,
  setAssigneeInput,
  setFilteredAssignees,
  assigneeInput,
  selectedAssignees,
  handleRemoveAssignee,
  filteredAssignees,
  handleAddAssignee,
  slideModalAnim,
}: ModalProps) {
  const { darkTheme } = useAppTheme();
  const textColor = Colors[darkTheme ? "dark" : "light"].text;
  const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;
  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const opppBgColor = darkTheme ? Colors.white : Colors.lightBlue;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [touchedOption, setTouchedOption] = useState(null);

  const handleAssigneeSearch = (input: string) => {
    setAssigneeInput(input);
    setFilteredAssignees(
      assigneeList.filter((assignee) =>
        assignee.name.toLowerCase().includes(input.toLowerCase())
      )
    );
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              backgroundColor: bgColor,
              transform: [{ translateY: slideModalAnim }],
              height: isKeyboardVisible ? "90%" : "60%",
            },
          ]}
        >
          {/* Search Input */}
          <TextInput
            style={[styles.modalSearchInput, { color: textColor }]}
            value={assigneeInput}
            onChangeText={handleAssigneeSearch}
            placeholder="Search Assignees"
            placeholderTextColor={darkTheme ? "#e0e0e0" : "#666"}
          />

          {/* Selected Assignees */}
          <View style={styles.modalSelectedContainer}>
            {selectedAssignees.map((assignee: any) => (
              <View
                key={assignee.id}
                style={[
                  styles.assigneeTag,
                  { backgroundColor: darkTheme ? Colors.white : "#e0e0e0" },
                ]}
              >
                <Image
                  source={defaultImage}
                  style={{ width: 25, height: 25, borderRadius: 20 }}
                />
                <Text style={styles.assigneeText}>{assignee.name}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveAssignee(assignee.id)}
                >
                  <Ionicons name="close-circle" size={22} color="black" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Assignee List */}
          <ScrollView
            showsVerticalScrollIndicator
            style={[styles.assigneeFlatList, { backgroundColor: bgColor }]}
          >
            {filteredAssignees.length > 0 ? (
              filteredAssignees.map((item: any) => (
                <Pressable
                  key={item.id}
                  style={[
                    styles.assigneeOption,
                    {
                      backgroundColor:
                        touchedOption == item.id
                          ? !darkTheme
                            ? "#e0e0e0"
                            : "#1d2d52"
                          : bgColor,
                    },
                  ]}
                  onPress={() => handleAddAssignee(item)}
                  onPressIn={() => setTouchedOption(item.id)}
                  onPressOut={() => setTouchedOption(null)}
                >
                  <Image
                    source={defaultImage}
                    style={{ width: 25, height: 25, borderRadius: 20 }}
                  />
                  <Text numberOfLines={1} style={{ color: textColor }}>
                    {item.name}
                  </Text>
                </Pressable>
              ))
            ) : (
              <Text
                style={{ textAlign: "center", marginTop: 20, color: textColor }}
              >
                Result Not Found For {assigneeInput}
              </Text>
            )}
          </ScrollView>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            {/* Done Button */}
            <Pressable
              style={[styles.doneButton, { backgroundColor: opppBgColor }]}
              onPress={() => {
                setTimeout(() => {
                  handleCloseModal();
                }, 200);
              }}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={{ color: oppTextColor, fontWeight: 500 }}>Done</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

SelectAssignee.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  onAssigneesUpdate: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  assigneeContainer: {
    paddingTop: 3,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  inputField: {
    flexGrow: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  assigneeTag: {
    gap: 5,
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  assigneeText: {
    // marginRight: 5,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    display: "flex",
    borderRadius: 10,
    position: "relative",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  modalSearchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalSelectedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  assigneeOption: {
    gap: 10,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  doneButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
  },
  assigneeFlatList: {
    width: "100%",
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    borderRadius: 5,
    marginVertical: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
