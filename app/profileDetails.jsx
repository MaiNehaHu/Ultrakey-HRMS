import { Alert, Animated, Easing, ImageBackground, Keyboard, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Colors from '../constants/Colors';
import { useAppTheme } from '../contexts/AppTheme';
import { FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useProfileContext } from '../contexts/ProfileDetails';
import { faL } from '@fortawesome/free-solid-svg-icons';

const backgroundImage = require("../assets/images/body_bg.png");

export default function ProfileDetails() {
    const { darkTheme } = useAppTheme();
    const { profileDetails, setProfileDetails } = useProfileContext();

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [visibleModal, setVisibleModal] = useState(null);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [selectedEditData, setSelectedEditData] = useState({});

    const slideModalAnim = useRef(new Animated.Value(200)).current;

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;
    const buttonColor = darkTheme ? Colors.white : Colors.darkBlue;

    // Open Modal
    const handleOpenAddingModal = (modalName) => {
        setVisibleModal(modalName);
        setIsAddModalVisible(true);

        Animated.timing(slideModalAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    };

    // Close Modal
    const handleCloseAddingModal = () => {
        Animated.timing(slideModalAnim, {
            toValue: 700,
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }).start(() => {
            setIsAddModalVisible(false);
            setVisibleModal(null);
        });
    };

    // Open Edit Modal
    const handleOpenEditModal = (modalName, dataId) => {
        setVisibleModal(modalName);

        let selectedEditData = null;

        // Filter data based on modalName and dataId
        switch (modalName) {
            case "Education":
                selectedEditData = profileDetails.educationList.find(item => item.id === dataId);
                break;
            case "Experience":
                selectedEditData = profileDetails.experienceList.find(item => item.id === dataId);
                break;
            case "Family":
                selectedEditData = profileDetails.familyInformation.find(item => item.id === dataId);
                break;
            default:
                break;
        }

        setSelectedEditData(selectedEditData);
        setIsEditModalVisible(true);

        Animated.timing(slideModalAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    };


    // Close Edit Modal
    const handleCloseEditModal = () => {
        Animated.timing(slideModalAnim, {
            toValue: 700,
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }).start(() => {
            setIsEditModalVisible(false);
            setVisibleModal(null);
        });
    };

    // Handle Add Details
    const handleAddDetails = (section, newEntry) => {
        setProfileDetails((prevDetails) => ({
            ...prevDetails,
            [section]: [...prevDetails[section], newEntry],
        }));
    };

    // Handle Edit Details (update existing data)
    const handleEditProfileDetails = (section, updatedData) => {
        // Check if the section exists in profileDetails
        if (profileDetails[section]) {
            setProfileDetails((prevDetails) => ({
                ...prevDetails,
                [section]: prevDetails[section].map((item) =>
                    item.id === updatedData.id ? updatedData : item
                ),
            }));
        } else {
            console.error("Invalid section name:", section);
        }
    };

    // Handle Delete Details
    const handleDeleteDetails = (section, idKey, idToDelete) => {
        Alert.alert(
            "Are you sure?",
            "You want to delete the details?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        setProfileDetails((prevDetails) => ({
                            ...prevDetails,
                            [section]: prevDetails[section].filter(
                                (item) => item[idKey] !== idToDelete
                            ),
                        }));
                    },
                },
            ],
            { cancelable: true }
        );
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => setIsKeyboardVisible(true));
        const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => setIsKeyboardVisible(false));

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <ImageBackground source={backgroundImage} style={styles.backImage} />

            <ScrollView style={{ paddingHorizontal: 10 }}>
                <SafeAreaView style={{ gap: 10, marginVertical: 5, marginTop: 15 }}>
                    <Text style={[styles.header, { color: textColor, marginBottom: 5 }]}>
                        Basic Information
                    </Text>

                    <OneLineCard fieldName={"name"} setProfileDetails={setProfileDetails} text={profileDetails.name} header="Name" />
                    <OneLineCard fieldName={"employeeID"} setProfileDetails={setProfileDetails} text={profileDetails.employeeID} header="Employee ID" />
                    <OneLineCard fieldName={"designation"} setProfileDetails={setProfileDetails} text={profileDetails.designation} header="Designation" />
                    <OneLineCard fieldName={"bloodGroup"} setProfileDetails={setProfileDetails} text={profileDetails.bloodGroup} header="Blood Group" />
                    <OneLineCard fieldName={"dob"} setProfileDetails={setProfileDetails} text={profileDetails.dob} header="Date of Birth" />
                    <OneLineCard fieldName={"PANCard"} setProfileDetails={setProfileDetails} text={profileDetails.PANCard} header="PAN Card" />
                </SafeAreaView>

                {/* Contact Information */}
                <SafeAreaView style={[styles.sectionContainer, { marginVertical: 5 }]}>
                    <Text style={[styles.header, { color: textColor, marginBottom: 5 }]}>
                        Contact Info.
                    </Text>

                    <OneLineCard fieldName={"phoneNumber"} setProfileDetails={setProfileDetails} text={profileDetails.phoneNumber} header="Primary" />
                    <OneLineCard fieldName={"emergencyPhoneNumber1"} setProfileDetails={setProfileDetails} text={profileDetails.emergencyPhoneNumber1} header="Emergency" />
                    <OneLineCard fieldName={"email"} setProfileDetails={setProfileDetails} text={profileDetails.email} header="Email ID" />
                </SafeAreaView>

                {/* Experience Info */}
                <SafeAreaView style={[styles.sectionContainer, { marginVertical: 5 }]}>
                    <View style={[styles.flex_row_btw, { marginBottom: 10 }]}>
                        <Text style={[styles.header, { color: textColor }]}>Experience</Text>
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: buttonColor }]}
                            onPress={() => handleOpenAddingModal("Experience")}
                        >
                            <Text style={{ color: oppTextColor, fontWeight: "500", fontSize: 13 }}>
                                ADD
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {profileDetails.experienceList.map((exp, index) => (
                        <MultiLineCard
                            key={`experience-${index}`}
                            index={index}
                            exp={exp}
                            experienceCard
                            handleOpenEditModal={handleOpenEditModal}
                            handleDeleteDetails={handleDeleteDetails}
                        />
                    ))}
                </SafeAreaView>

                {/* Education Info */}
                <SafeAreaView style={[styles.sectionContainer, { marginVertical: 5 }]}>
                    <View style={[styles.flex_row_btw, { marginBottom: 10 }]}>
                        <Text style={[styles.header, { color: textColor }]}>Education</Text>
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: buttonColor }]}
                            onPress={() => handleOpenAddingModal("Education")}
                        >
                            <Text style={{ color: oppTextColor, fontWeight: "500", fontSize: 13 }}>
                                ADD
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {profileDetails.educationList.map((edu, index) => (
                        <MultiLineCard
                            key={`education-${index}`}
                            index={index}
                            edu={edu}
                            educationCard
                            handleOpenEditModal={handleOpenEditModal}
                            handleDeleteDetails={handleDeleteDetails}
                        />
                    ))}
                </SafeAreaView>

                {/* Family Info */}
                <SafeAreaView style={[styles.sectionContainer, { marginVertical: 5 }]}>
                    <View style={[styles.flex_row_btw, { marginBottom: 10 }]}>
                        <Text style={[styles.header, { color: textColor }]}>Family</Text>
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: buttonColor }]}
                            onPress={() => handleOpenAddingModal("Family")}
                        >
                            <Text style={{ color: oppTextColor, fontWeight: "500", fontSize: 13 }}>
                                ADD
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {profileDetails.familyInformation.map((fam, index) => (
                        <MultiLineCard
                            key={`family-${index}`}
                            index={index}
                            fam={fam}
                            familyCard
                            handleOpenEditModal={handleOpenEditModal}
                            handleDeleteDetails={handleDeleteDetails}
                        />
                    ))}
                </SafeAreaView>

                <AddingModal
                    isVisible={visibleModal === "Experience" ? isAddModalVisible : false}
                    handleCloseAddingModal={handleCloseAddingModal}
                    isKeyboardVisible={isKeyboardVisible}
                    onAddDetails={handleAddDetails}
                    slideModalAnim={slideModalAnim}
                    fields={[
                        { name: "company", label: "Company Name", placeholder: "Enter company name" },
                        { name: "designation", label: "Designation", placeholder: "Enter designation" },
                        { name: "workFrom", label: "Start Date", placeholder: "Enter start date" },
                        { name: "workTo", label: "End Date", placeholder: "Enter end date" },
                    ]}
                    detailsFor="experienceList"
                />

                <AddingModal
                    isVisible={visibleModal === "Education" ? isAddModalVisible : false}
                    handleCloseAddingModal={handleCloseAddingModal}
                    isKeyboardVisible={isKeyboardVisible}
                    onAddDetails={handleAddDetails}
                    slideModalAnim={slideModalAnim}
                    fields={[
                        { name: "institute", label: "Institute Name", placeholder: "Enter institute name" },
                        { name: "degree", label: "Degree", placeholder: "Enter degree" },
                        { name: "grade", label: "Grades", placeholder: "Enter your grades" },
                        { name: "batchFrom", label: "Start Year", placeholder: "Graduation start year" },
                        { name: "batchTo", label: "End Year", placeholder: "Graduation end year" },
                    ]}
                    detailsFor="educationList"
                />

                <AddingModal
                    isVisible={visibleModal === "Family" ? isAddModalVisible : false}
                    handleCloseAddingModal={handleCloseAddingModal}
                    isKeyboardVisible={isKeyboardVisible}
                    onAddDetails={handleAddDetails}
                    slideModalAnim={slideModalAnim}
                    fields={[
                        { name: "name", label: "Person Name", placeholder: "Enter Name" },
                        { name: "relation", label: "Relation", placeholder: "Enter Relation" },
                        { name: "contact", label: "Contact", placeholder: "Enter Contact" },
                    ]}
                    detailsFor="familyInformation"
                />

                <EditModal
                    selectedDetails={selectedEditData}
                    isVisible={visibleModal === "Experience" ? isEditModalVisible : false}
                    handleCloseEditModal={handleCloseEditModal}
                    isKeyboardVisible={isKeyboardVisible}
                    onEditDetails={handleEditProfileDetails}
                    slideModalAnim={slideModalAnim}
                    fields={[
                        { name: "company", label: "Company Name", placeholder: "Enter company name" },
                        { name: "designation", label: "Designation", placeholder: "Enter designation" },
                        { name: "workFrom", label: "Start Date", placeholder: "Enter start date" },
                        { name: "workTo", label: "End Date", placeholder: "Enter end date" },
                    ]}
                    detailsFor="experienceList"
                />

                <EditModal
                    selectedDetails={selectedEditData}
                    isVisible={visibleModal === "Education" ? isEditModalVisible : false}
                    handleCloseEditModal={handleCloseEditModal}
                    isKeyboardVisible={isKeyboardVisible}
                    onEditDetails={handleEditProfileDetails}
                    slideModalAnim={slideModalAnim}
                    fields={[
                        { name: "institute", label: "Institute Name", placeholder: "Enter institute name" },
                        { name: "degree", label: "Degree", placeholder: "Enter degree" },
                        { name: "grade", label: "Grades", placeholder: "Enter your grades" },
                        { name: "batchFrom", label: "Start Year", placeholder: "Graduation start year" },
                        { name: "batchTo", label: "End Year", placeholder: "Graduation end year" },
                    ]}
                    detailsFor="educationList"
                />

                <EditModal
                    selectedDetails={selectedEditData}
                    isVisible={visibleModal === "Family" ? isEditModalVisible : false}
                    handleCloseEditModal={handleCloseEditModal}
                    isKeyboardVisible={isKeyboardVisible}
                    onEditDetails={handleEditProfileDetails}
                    slideModalAnim={slideModalAnim}
                    fields={[
                        { name: "name", label: "Name", placeholder: "Enter Name" },
                        { name: "relation", label: "Relation", placeholder: "Enter Relation" },
                        { name: "contact", label: "Contact", placeholder: "Enter Contact" },
                    ]}
                    detailsFor="familyInformation"
                />
            </ScrollView>
        </View>
    );
}

function OneLineCard({ header, text, fieldName, setProfileDetails }) {
    const { darkTheme } = useAppTheme();
    const [edit, setEdit] = useState({ name: "", bool: false });
    const [textInput, setTextInput] = useState(text);

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;

    const handleInputChange = (value) => {
        setTextInput(value);
    };

    function handleSave(field) {
        setProfileDetails((prev) => ({
            ...prev,
            [field]: textInput,
        }));
        setEdit({ name: fieldName, bool: false });
    }

    return (
        edit.bool && edit.name === fieldName ? (
            <View style={{ position: 'relative', paddingHorizontal: 5 }}>
                <View style={{ paddingVertical: 5 }}>
                    <View style={[styles.multiLineCardContainer, { borderColor: textColor }]}>
                        <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>{header}</Text>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={{
                                    color: textColor,
                                    borderColor: textColor,
                                    paddingVertical: 15,
                                    flex: 1
                                }}
                                placeholder={fieldName}
                                value={textInput}
                                onChangeText={handleInputChange}
                                placeholderTextColor={darkTheme ? "#e3e3e3" : "#666666"}
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={{ position: "absolute", right: 0, top: 0, paddingRight: 20, paddingTop: 20 }}
                    onPress={() => handleSave(fieldName)}
                >
                    <FontAwesome name='check' size={20} color={textColor} />
                </TouchableOpacity>
            </View>
        ) : (
            <View style={{ padding: 5 }}>
                <View style={[styles.cardContainer, { borderColor: textColor }]}>
                    <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>
                        {header}
                    </Text>

                    {/* Show edit button for specific headers */}
                    {header !== "Name" && header !== "Employee ID" && header !== "Designation" && header !== "Email ID" && (
                        <View style={[{ display: 'flex', flexDirection: 'row', gap: 15 }, styles.actionButtons]}>
                            <Pressable
                                onPress={() => setEdit({ name: fieldName, bool: true })}
                                style={{ backgroundColor: bgColor, paddingHorizontal: 2 }}
                            >
                                <FontAwesome6 name='edit' size={16} color={textColor} />
                            </Pressable>
                        </View>
                    )}

                    <Text style={[styles.bodyText, { color: textColor, marginVertical: 0 }]}>{text}</Text>
                </View>
            </View>
        )
    );
}

function MultiLineCard({
    index,
    edu,
    exp,
    fam,
    educationCard,
    experienceCard,
    familyCard,
    handleOpenEditModal,
    handleDeleteDetails
}) {
    const { darkTheme } = useAppTheme();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;

    return (
        <View
            style={[
                styles.cardContainer,
                { borderColor: textColor, paddingHorizontal: 15, margin: 5 },
            ]}
        >
            {educationCard && (
                <>
                    <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>
                        {edu.degree}
                    </Text>

                    <View style={[{ display: 'flex', flexDirection: 'row', gap: 15 }, styles.actionButtons,]}>
                        <Pressable
                            onPress={() => handleOpenEditModal("Education", edu.id)}
                            style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}>
                            <FontAwesome6 name='edit' size={16} color={textColor} />
                        </Pressable>

                        {index !== 0 &&
                            <Pressable
                                onPress={() => handleDeleteDetails("educationList", "id", edu.id)}
                                style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}
                            >
                                <FontAwesome6 name='trash' size={16} color={Colors.red} />
                            </Pressable>
                        }
                        {index == 0 &&
                            <Pressable style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}>
                                <FontAwesome6 name='check-circle' size={16} color={darkTheme ? Colors.white : Colors.lightBlue} />
                            </Pressable>
                        }
                    </View>

                    <Text style={[{ color: textColor }, styles.bodyText]}>Degree: {edu.degree}</Text>
                    <Text style={[{ color: textColor }, styles.bodyText]}>College: {edu.institute}</Text>
                    <Text style={[{ color: textColor }, styles.bodyText]}>
                        Batch: {edu.batchFrom} - {edu.batchTo}
                    </Text>
                    <Text style={[{ color: textColor }, styles.bodyText]}>
                        Grade: {edu.grade} CGPA
                    </Text>
                </>
            )
            }

            {
                experienceCard && (
                    <>
                        <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>
                            {exp.type}
                        </Text>

                        <View style={[{ display: 'flex', flexDirection: 'row', gap: 15 }, styles.actionButtons,]}>
                            <Pressable
                                onPress={() => handleOpenEditModal("Experience", exp.id)}
                                style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}>
                                <FontAwesome6 name='edit' size={16} color={textColor} />
                            </Pressable>

                            {index !== 0 &&
                                <Pressable
                                    onPress={() => handleDeleteDetails("experienceList", "id", exp.id)}
                                    style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}
                                >
                                    <FontAwesome6 name='trash' size={16} color={Colors.red} />
                                </Pressable>
                            }
                            {index == 0 &&
                                <Pressable style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}>
                                    <FontAwesome6 name='check-circle' size={16} color={darkTheme ? Colors.white : Colors.lightBlue} />
                                </Pressable>
                            }
                        </View>

                        <Text style={[{ color: textColor }, styles.bodyText]}>
                            Organization: {exp.company}
                        </Text>
                        <Text style={[{ color: textColor }, styles.bodyText]}>
                            Designation: {exp.designation}
                        </Text>
                        <Text style={[{ color: textColor }, styles.bodyText]}>
                            Batch: {exp.workFrom} - {exp.workTo}
                        </Text>
                    </>
                )
            }

            {
                familyCard && (
                    <>
                        <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>
                            {fam.relation}
                        </Text>

                        <View style={[{ display: 'flex', flexDirection: 'row', gap: 15 }, styles.actionButtons,]}>
                            <Pressable
                                onPress={() => handleOpenEditModal("Family", fam.id)}
                                style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}>
                                <FontAwesome6 name='edit' size={16} color={textColor} />
                            </Pressable>

                            {index !== 0 &&
                                <Pressable
                                    onPress={() => handleDeleteDetails("familyInformation", "id", fam.id)}
                                    style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}
                                >
                                    <FontAwesome6 name='trash' size={16} color={Colors.red} />
                                </Pressable>
                            }
                            {index == 0 &&
                                <Pressable style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}>
                                    <FontAwesome6 name='check-circle' size={16} color={darkTheme ? Colors.white : Colors.lightBlue} />
                                </Pressable>
                            }
                        </View>

                        <Text style={[{ color: textColor }, styles.bodyText]}>Relation: {fam.relation}</Text>
                        <Text style={[{ color: textColor }, styles.bodyText]}>Name: {fam.name}</Text>
                        <Text style={[{ color: textColor }, styles.bodyText]}>Contact: {fam.contact}</Text>
                    </>
                )
            }
        </View >
    );
}

function AddingModal({
    isVisible,
    handleCloseAddingModal,
    isKeyboardVisible,
    slideModalAnim,
    fields,
    onAddDetails,
    detailsFor
}) {
    const { darkTheme } = useAppTheme();

    const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;
    const btnColor = darkTheme ? Colors.white : Colors.darkBlue;

    const initialFormData = fields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const [formData, setFormData] = useState(initialFormData);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAdd = (name) => {
        const isValid = fields.every((field) => formData[field.name].trim() !== "");
        if (isValid) {
            onAddDetails(name, formData);
            setFormData(initialFormData);
            handleCloseAddingModal();
        } else {
            Alert.alert("All fields are required");
        }
    };

    return (
        <Modal animationType="fade" transparent visible={isVisible}>
            <View style={styles.modalContainer}>
                <Animated.View
                    style={[
                        styles.modalContent,
                        {
                            transform: [{ translateY: slideModalAnim }],
                            backgroundColor: Colors[darkTheme ? "dark" : "light"].background,
                            height: isKeyboardVisible ? "85%" : "auto",
                        },
                    ]}
                >
                    <ScrollView>
                        {fields.map((field) => (
                            <Inputs
                                key={field.name}
                                header={field.label}
                                placeholder={field.placeholder}
                                value={formData[field.name]}
                                onChangeText={(value) => handleInputChange(field.name, value)}
                            />
                        ))}
                    </ScrollView>

                    <View style={styles.flex_row}>
                        <Pressable
                            style={[styles.doneButton, { backgroundColor: Colors.grey }]}
                            onPress={handleCloseAddingModal}
                        >
                            <Text style={{ color: darkTheme ? Colors.black : Colors.white }}>CANCEL</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.doneButton, { backgroundColor: btnColor }]}
                            onPress={() => handleAdd(detailsFor)}
                        >
                            <Text style={{ color: oppTextColor, fontWeight: "500" }}>ADD</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

function EditModal({
    selectedDetails,
    isVisible,
    handleCloseEditModal,
    isKeyboardVisible,
    onEditDetails,
    slideModalAnim,
    fields,
    detailsFor
}) {
    const { darkTheme } = useAppTheme();

    const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;
    const btnColor = darkTheme ? Colors.white : Colors.darkBlue;

    // Initialize the formData based on the selectedDetails
    const [formData, setFormData] = useState(() => {
        return fields.reduce((acc, field) => {
            acc[field.name] = selectedDetails[field.name] || '';
            return acc;
        }, {});
    });

    useEffect(() => {
        if (selectedDetails) {
            // If selected details are provided, update formData
            setFormData(prev => ({
                ...prev,
                ...selectedDetails,
            }));
        }
    }, [selectedDetails]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // Check if all fields have been filled
        const allFieldsFilled = fields.every(field => formData[field.name]?.trim());
        if (allFieldsFilled) {
            handleCloseEditModal();
            onEditDetails(detailsFor, formData);

            // Reset formData after saving
            setFormData(fields.reduce((acc, field) => {
                acc[field.name] = '';
                return acc;
            }, {}));
        } else {
            Alert.alert("All fields are required");
        }
    };

    const handleCancel = () => {
        handleCloseEditModal();
    };

    return (
        <Modal animationType="fade" transparent visible={isVisible}>
            <View style={styles.modalContainer}>
                <Animated.View
                    style={[
                        styles.modalContent,
                        {
                            transform: [{ translateY: slideModalAnim }],
                            backgroundColor: Colors[darkTheme ? "dark" : "light"].background,
                            height: isKeyboardVisible ? "85%" : "auto",
                        },
                    ]}
                >
                    <ScrollView>
                        {fields.length > 0 && fields.map((field) => (
                            <Inputs
                                key={field.name}
                                header={field.label}
                                placeholder={field.placeholder || field.label}
                                value={formData[field.name]}
                                onChangeText={(value) => handleInputChange(field.name, value)}
                            />
                        ))}
                    </ScrollView>

                    <View style={styles.flex_row}>
                        <Pressable
                            style={[styles.doneButton, { backgroundColor: Colors.grey }]}
                            onPress={handleCancel}
                        >
                            <Text style={{ color: darkTheme ? Colors.black : Colors.white }}>CANCEL</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.doneButton, { backgroundColor: btnColor }]}
                            onPress={handleSave}
                        >
                            <Text style={{ color: oppTextColor, fontWeight: "500" }}>SAVE</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

function Inputs({
    header,
    value,
    onChangeText,
    placeholder,
}) {
    const { darkTheme } = useAppTheme();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;

    return (
        <View style={{ marginBottom: 10, paddingVertical: 5 }}>
            <View style={[styles.multiLineCardContainer, { borderColor: textColor }]}>
                <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>{header}</Text>

                <View style={styles.inputWrapper}>
                    <TextInput
                        style={{ color: textColor, borderColor: textColor, paddingVertical: 15, flex: 1 }}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={onChangeText}
                        placeholderTextColor={darkTheme ? "#e3e3e3" : "#666666"}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    backImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: "cover",
    },
    cardContainer: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        position: 'relative',
    },
    multiLineCardContainer: {
        borderWidth: 1,
        borderRadius: 10,
    },
    headerText: {
        top: -10,
        left: 10,
        fontSize: 12,
        fontWeight: '500',
        position: 'absolute',
        paddingHorizontal: 5,
    },
    actionButtons: {
        top: -10,
        right: 10,
        position: "absolute",
        paddingHorizontal: 5,
    },
    bodyText: {
        fontSize: 14,
        fontWeight: '400',
        marginVertical: 2,
    },
    header: {
        width: "60%",
        fontSize: 18,
        fontWeight: 500,
        paddingLeft: 5,
    },
    sectionContainer: {
        gap: 10,
        width: '100%',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
    },
    flex_row_btw: {
        marginVertical: 2,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    flex_row: {
        gap: 10,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    addButton: {
        borderRadius: 30,
        paddingVertical: 4,
        paddingHorizontal: 15,
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
        borderRadius: 10,
        display: "flex",
        position: "relative",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    input: {
        width: "100%",
        borderBottomWidth: 1,
        marginBottom: 15,
        fontSize: 16,
    },
    doneButton: {
        width: "48%",
        marginTop: 20,
        borderRadius: 5,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    inputWrapper: {
        paddingHorizontal: 10,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
});

