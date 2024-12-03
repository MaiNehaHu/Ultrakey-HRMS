import { Alert, Animated, Easing, ImageBackground, Keyboard, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Colors from '../constants/Colors';
import { useAppTheme } from '../contexts/AppTheme';
import { FontAwesome6 } from '@expo/vector-icons';
import { useProfileContext } from '../contexts/ProfileDetails';

const backgroundImage = require("../assets/images/body_bg.png");

export default function ProfileDetails() {
    const { darkTheme } = useAppTheme();
    const { profileDetails, setProfileDetails } = useProfileContext();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [visibleModal, setVisibleModal] = useState(null);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const slideModalAnim = useRef(new Animated.Value(200)).current;

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;
    const buttonColor = darkTheme ? Colors.white : Colors.darkBlue;

    const handleOpenAddingModal = (modalName) => {
        setVisibleModal(modalName);
        setIsModalVisible(true);

        Animated.timing(slideModalAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    };

    const handleCloseAddingModal = () => {
        Animated.timing(slideModalAnim, {
            toValue: 700,
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }).start(() => {
            setIsModalVisible(false);
            setVisibleModal(null);
        });
    };

    const handleAddExperienceDetails = (newAccount) => {
        setProfileDetails((prevDetails) => ({
            ...prevDetails,
            experienceList: [...prevDetails.experienceList, newAccount],
        }));
    };

    const handleAddEducationDetails = (newAccount) => {
        setProfileDetails((prevDetails) => ({
            ...prevDetails,
            educationList: [...prevDetails.educationList, newAccount],
        }));
    };

    const handleAddFamilyDetails = (newAccount) => {
        setProfileDetails((prevDetails) => ({
            ...prevDetails,
            familyInformation: [...prevDetails.familyInformation, newAccount],
        }));
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

                    <OneLineCard text={profileDetails.name} header="Name" />
                    <OneLineCard text={profileDetails.employeeID} header="Employee ID" />
                    <OneLineCard text={profileDetails.designation} header="Designation" />
                    <OneLineCard text={profileDetails.bloodGroup} header="Blood Group" />
                    <OneLineCard text={profileDetails.dob} header="Date of Birth" />
                    <OneLineCard text={profileDetails.PANCard} header="PAN Card" />
                </SafeAreaView>

                {/* Contact Information */}
                <SafeAreaView style={[styles.sectionContainer, { marginVertical: 5 }]}>
                    <Text style={[styles.header, { color: textColor, marginBottom: 5 }]}>
                        Contact Info.
                    </Text>

                    <OneLineCard text={profileDetails.phoneNumber} header="Primary" />
                    <OneLineCard text={profileDetails.emergencyPhoneNumber1} header="Emergency" />
                    <OneLineCard text={profileDetails.email} header="Email ID" />
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
                        />
                    ))}
                </SafeAreaView>

                <AddingModal
                    isVisible={visibleModal === "Experience" ? isModalVisible : false}
                    handleCloseAddingModal={handleCloseAddingModal}
                    isKeyboardVisible={isKeyboardVisible}
                    onAddDetails={handleAddExperienceDetails}
                    slideModalAnim={slideModalAnim}
                    fields={[
                        { name: "company", label: "Company Name", placeholder: "Enter company name" },
                        { name: "designation", label: "Designation", placeholder: "Enter designation" },
                        { name: "workFrom", label: "Start Date", placeholder: "Enter start date" },
                        { name: "workTo", label: "End Date", placeholder: "Enter end date" },
                    ]}
                />

                <AddingModal
                    isVisible={visibleModal === "Education" ? isModalVisible : false}
                    handleCloseAddingModal={handleCloseAddingModal}
                    isKeyboardVisible={isKeyboardVisible}
                    onAddDetails={handleAddEducationDetails}
                    slideModalAnim={slideModalAnim}
                    fields={[
                        { name: "institute", label: "Institute Name", placeholder: "Enter institute name" },
                        { name: "degree", label: "Degree", placeholder: "Enter degree" },
                        { name: "grade", label: "Grades", placeholder: "Enter your grades" },
                        { name: "batchFrom", label: "Start Year", placeholder: "Graduation start year" },
                        { name: "batchTo", label: "End Year", placeholder: "Graduation end year" },
                    ]}
                />

                <AddingModal
                    isVisible={visibleModal === "Family" ? isModalVisible : false}
                    handleCloseAddingModal={handleCloseAddingModal}
                    isKeyboardVisible={isKeyboardVisible}
                    onAddDetails={handleAddFamilyDetails}
                    slideModalAnim={slideModalAnim}
                    fields={[
                        { name: "name", label: "Person Name", placeholder: "Enter name" },
                        { name: "relation", label: "Relation", placeholder: "Enter Relation" },
                        { name: "contact", label: "Contact", placeholder: "Enter contact" },
                    ]}
                />
            </ScrollView>
        </View>
    );
}

function OneLineCard({ header, text }) {
    const { darkTheme } = useAppTheme();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;

    return (
        <View style={{ padding: 5 }}>
            <View style={[styles.cardContainer, { borderColor: textColor }]}>
                <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>
                    {header}
                </Text>

                {
                    header !== "Name" && header !== "Employee ID" && header !== "Designation" && header !== "Email ID" &&
                    <View style={[{ display: 'flex', flexDirection: 'row', gap: 15 }, styles.actionButtons,]}>
                        <Pressable style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}>
                            <FontAwesome6 name='edit' size={16} color={textColor} />
                        </Pressable>
                    </View>
                }

                <Text style={[styles.bodyText, { color: textColor, marginVertical: 0 }]}>{text}</Text>
            </View>
        </View>
    );
}

function MultiLineCard({ index, edu, exp, fam, educationCard, experienceCard, familyCard }) {
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
                        {edu.title}
                    </Text>

                    <View style={[{ display: 'flex', flexDirection: 'row', gap: 15 }, styles.actionButtons,]}>
                        <Pressable style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}>
                            <FontAwesome6 name='edit' size={16} color={textColor} />
                        </Pressable>

                        {index !== 0 &&
                            <Pressable style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}>
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
            )}

            {experienceCard && (
                <>
                    <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>
                        {exp.type}
                    </Text>

                    <View style={[{ display: 'flex', flexDirection: 'row', gap: 15 }, styles.actionButtons,]}>
                        <Pressable style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}>
                            <FontAwesome6 name='edit' size={16} color={textColor} />
                        </Pressable>

                        {index !== 0 &&
                            <Pressable style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}>
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
            )}

            {familyCard && (
                <>
                    <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>
                        {fam.relation}
                    </Text>

                    <View style={[{ display: 'flex', flexDirection: 'row', gap: 15 }, styles.actionButtons,]}>
                        <Pressable style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}>
                            <FontAwesome6 name='edit' size={16} color={textColor} />
                        </Pressable>

                        {index !== 0 &&
                            <Pressable style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}>
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
            )}
        </View>
    );
}

function AddingModal({
    isVisible,
    handleCloseAddingModal,
    isKeyboardVisible,
    onAddDetails,
    slideModalAnim,
    fields,
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

    const handleAdd = () => {
        const isValid = fields.every((field) => formData[field.name].trim() !== "");
        if (isValid) {
            onAddDetails(formData);
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
                            onPress={handleAdd}
                        >
                            <Text style={{ color: oppTextColor, fontWeight: "500" }}>ADD</Text>
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

