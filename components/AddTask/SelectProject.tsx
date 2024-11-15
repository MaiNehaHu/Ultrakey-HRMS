import {
  Modal,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";

interface Props {
  placeholder: string;
  onProjectsUpdate: any;
}

const projectList = [
  { projectName: "HRMS", project_id: 1 },
  { projectName: "Trending News Guru", project_id: 2 },
];

export default function SelectProject({
  placeholder,
  onProjectsUpdate,
}: Props) {
  const { darkTheme } = useAppTheme();
  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const textColor = Colors[darkTheme ? "dark" : "light"].text;
  const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;

  const [projectInput, setProjectInput] = useState("");
  const [showProjectList, setShowProjectList] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState(projectList);

  const handleProjectSearch = (input: string) => {
    setProjectInput(input);
    setFilteredProjects(
      projectList.filter((project: any) =>
        project.projectName.toLowerCase().includes(input.toLowerCase())
      )
    );
  };

  const handleSelectProject = (project: any) => {
    onProjectsUpdate(project); // Update parent component with the selected project
    setProjectInput(project.projectName);
    setShowProjectList(false); // Hide the modal after selection
  };

  return (
    <View style={styles.inputWrapper}>
      {projectInput ? (
        <TouchableOpacity onFocus={() => setShowProjectList(true)}>
          <Text style={{ color: textColor }}>{placeholder}</Text>
        </TouchableOpacity>
      ) : (
        <TextInput
          value={projectInput}
          placeholder={placeholder}
          style={{ color: textColor }}
          onFocus={() => setShowProjectList(true)}
          onChangeText={(text) => handleProjectSearch(text)}
          placeholderTextColor={darkTheme ? "#e3e3e3" : "#666666"}
        />
      )}

      {/* Modal for displaying the filtered project list */}
      <Modal
        visible={showProjectList}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowProjectList(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search projects..."
              value={projectInput}
              onChangeText={(text) => handleProjectSearch(text)}
            />
            <FlatList
              data={filteredProjects}
              keyExtractor={(item) => item.project_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.assigneeOption}
                  onPress={() => handleSelectProject(item)}
                >
                  <Text numberOfLines={1}>{item.projectName}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
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
  assigneeOption: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
