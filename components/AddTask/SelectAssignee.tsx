import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
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
  setIsModalVisible: any;
  isKeyboardVisible: boolean;
  setAssigneeInput: any;
  setFilteredAssignees: any;
  assigneeInput: string;
  selectedAssignees: any[];
  handleRemoveAssignee: any;
  filteredAssignees: any[];
  handleAddAssignee: any;
}

export default function SelectAssignee({
  onAssigneesUpdate,
}: Props) {
  const { darkTheme } = useAppTheme();
  // const textColor = Colors[darkTheme ? "dark" : "light"].text;
  const logoColor = darkTheme ? Colors.white : Colors.lightBlue;

  const [assigneeInput, setAssigneeInput] = useState("");
  const [filteredAssignees, setFilteredAssignees] = useState(assigneeList);
  const [selectedAssignees, setSelectedAssignees] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

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
              <Ionicons name="close-circle" size={18} color="black" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Button to Open Modal */}
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Ionicons name="add-circle" color={logoColor} size={30} />
        </TouchableOpacity>
      </View>

      {/* Modal for Selecting Assignees */}
      <SelectAssigneeModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        isKeyboardVisible={isKeyboardVisible}
        setAssigneeInput={setAssigneeInput}
        setFilteredAssignees={setFilteredAssignees}
        assigneeInput={assigneeInput}
        selectedAssignees={selectedAssignees}
        handleRemoveAssignee={handleRemoveAssignee}
        filteredAssignees={filteredAssignees}
        handleAddAssignee={handleAddAssignee}
      />
    </SafeAreaView>
  );
}

function SelectAssigneeModal({
  isModalVisible,
  setIsModalVisible,
  isKeyboardVisible,
  setAssigneeInput,
  setFilteredAssignees,
  assigneeInput,
  selectedAssignees,
  handleRemoveAssignee,
  filteredAssignees,
  handleAddAssignee,
}: ModalProps) {
  const { darkTheme } = useAppTheme();
  const textColor = Colors[darkTheme ? "dark" : "light"].text;
  const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;
  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const opppBgColor = darkTheme ? Colors.white : Colors.darkBlue;

  const scaleAnim = useRef(new Animated.Value(1)).current;

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
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: bgColor,
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
                  <Ionicons name="close-circle" size={18} color="black" />
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
                  style={styles.assigneeOption}
                  onPress={() => handleAddAssignee(item)}
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
                  setIsModalVisible(false);
                }, 200);
              }}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={{ color: oppTextColor, fontWeight: 500 }}>Done</Text>
            </Pressable>
          </Animated.View>
        </View>
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
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  inputField: {
    flexGrow: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  assigneeTag: {
    gap: 5,
    padding: 5,
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  assigneeText: {
    marginRight: 5,
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
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
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
});
