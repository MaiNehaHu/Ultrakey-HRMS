import { Alert, Animated, ImageBackground, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
import Colors from '../constants/Colors';
import { useAppTheme } from '../contexts/AppTheme';
import { FontAwesome6 } from '@expo/vector-icons';
import { useProfileContext } from '../contexts/ProfileDetails';

const backgroundImage = require("../assets/images/body_bg.png");

export default function ProfileDetails() {
    const { darkTheme } = useAppTheme();
    const { profileDetails, setProfileDetails } = useProfileContext();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const slideModalAnim = useRef(new Animated.Value(200)).current;

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;
    const buttonColor = darkTheme ? Colors.white : Colors.darkBlue

    const handleOpenExpModal = () => {
        setIsModalVisible(true);
        console.log(isModalVisible);

        Animated.timing(slideModalAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    };

    const handleCloseExpModal = () => {
        Animated.timing(slideModalAnim, {
            toValue: 700, // Slide back down
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }).start(() => {
            setIsModalVisible(false);
        });
    };

    const handleAddExperienceDetails = (newAccount) => {
        setProfileDetails((prevDetails) => ({
            ...prevDetails,
            experienceList: [...prevDetails.experienceList, newAccount], // Add the new account to the array
        }));
    };

    return (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <ImageBackground source={backgroundImage} style={styles.backImage} />

            <ScrollView style={{ paddingHorizontal: 10 }}>
                <SafeAreaView style={{ gap: 10, marginVertical: 5, marginTop: 15 }}>
                    <Text style={[styles.header, { color: textColor, marginBottom: 5 }]}>Basic Information</Text>

                    <InfoCard text={profileDetails.name} header={"Name"} />
                    <InfoCard text={profileDetails.employeeID} header={"Employee ID"} />
                    <InfoCard text={profileDetails.designation} header={"Designation"} />
                    <InfoCard text={profileDetails.bloodGroup} header={"Blood Group"} />
                    <InfoCard text={profileDetails.dob} header={"Date of Birth"} />
                    <InfoCard text={profileDetails.PANCard} header={"PAN Card"} />
                </SafeAreaView>

                {/* Contact information */}
                <SafeAreaView style={[styles.sectionContainer, { marginVertical: 5 }]}>
                    <Text style={[styles.header, { color: textColor, marginBottom: 5 }]}>Contact Info.</Text>

                    <InfoCard text={profileDetails.phoneNumber} header={"Primary"} />
                    <InfoCard text={profileDetails.emergencyPhoneNumber1} header={"Emergency"} />
                    <InfoCard text={profileDetails.email} header={"Email ID"} />
                </SafeAreaView>

                {/* Experience Info */}
                <SafeAreaView style={[styles.sectionContainer, { marginVertical: 5 }]}>
                    <View style={[styles.flex_row_btw, { marginBottom: 10 }]}>
                        <Text style={[styles.header, { color: textColor }]}>Experience</Text>

                        <TouchableOpacity style={[styles.addButton, { backgroundColor: buttonColor }]}>
                            <Text style={{ color: oppTextColor, fontWeight: 500, fontSize: 13 }}>ADD</Text>
                        </TouchableOpacity>
                    </View>

                    {profileDetails.experienceList.map((exp, index) => (
                        <ExperienceCard exp={exp} key={index} index={index} />
                    ))}
                </SafeAreaView>

                {/* Education Info */}
                <SafeAreaView style={[styles.sectionContainer, { marginVertical: 5 }]}>
                    <View style={[styles.flex_row_btw, { marginBottom: 10 }]}>
                        <Text style={[styles.header, { color: textColor }]}>Education</Text>

                        <TouchableOpacity style={[styles.addButton, { backgroundColor: buttonColor }]}>
                            <Text style={{ color: oppTextColor, fontWeight: 500, fontSize: 13 }}>ADD</Text>
                        </TouchableOpacity>
                    </View>

                    {profileDetails.educationList.map((edu, index) => (
                        <EducationCard edu={edu} key={index} index={index} />
                    ))}
                </SafeAreaView>

                {/* Family Info */}
                <SafeAreaView style={[styles.sectionContainer, { marginVertical: 5 }]}>
                    <View style={[styles.flex_row_btw, { marginBottom: 10 }]}>
                        <Text style={[styles.header, { color: textColor }]}>Family</Text>

                        <TouchableOpacity style={[styles.addButton, { backgroundColor: buttonColor }]}>
                            <Text style={{ color: oppTextColor, fontWeight: 500, fontSize: 13 }}>ADD</Text>
                        </TouchableOpacity>
                    </View>

                    {profileDetails.educationList.map((edu, index) => (
                        <EducationCard edu={edu} key={index} index={index} />
                    ))}
                </SafeAreaView>
            </ScrollView>
        </View>
    );
}

function InfoCard({ header, text }) {
    const { darkTheme } = useAppTheme();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;

    return (
        <View style={{ padding: 5, }}>
            <View style={[styles.cardContainer, { borderColor: textColor }]}>
                <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>{header}</Text>
                <Text style={[styles.bodyText, { color: textColor, marginVertical: 0 }]}>{text}</Text>
            </View>
        </View>
    )
}

const EducationCard = ({ edu, index }) => {
    const { darkTheme } = useAppTheme();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;

    return (
        <View
            style={[styles.cardContainer,
            { borderColor: textColor, paddingHorizontal: 15, margin: 5 }]}
        >
            <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>{edu.title}</Text>

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
                Degree: {edu.degree}
            </Text>
            <Text style={[{ color: textColor }, styles.bodyText]}>
                College: {edu.college}
            </Text>
            <Text style={[{ color: textColor }, styles.bodyText]}>
                Batch: {edu.batchFrom} - {edu.batchTo}
            </Text>
            <Text style={[{ color: textColor }, styles.bodyText]}>
                Grade: {edu.grade} CGPA
            </Text>
        </View>
    )
}

const ExperienceCard = ({ exp, index }) => {
    const { darkTheme } = useAppTheme();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;

    return (
        <View
            style={[styles.cardContainer,
            { borderColor: textColor, paddingHorizontal: 15, margin: 5 }]}
        >
            <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>{exp.type}</Text>

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
        </View >
    )
}

function AddExperienceModal({ isVisible, handleCloseModal, isKeyboardVisible, onAddExperienceDetails, slideModalAnim }) {
    const { darkTheme } = useAppTheme();

    const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;
    const btnColor = darkTheme ? Colors.white : Colors.darkBlue

    const [formData, setFormData] = useState({
        bankName: "",
        branchName: "",
        IFSC: "",
        accountNumber: "",
    });

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAdd = () => {
        if (formData.bankName && formData.branchName && formData.IFSC && formData.accountNumber) {
            onAddExperienceDetails(formData);
            setFormData({
                bankName: "",
                branchName: "",
                IFSC: "",
                accountNumber: "",
            });
            handleCloseModal();
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
                    <SafeAreaView>
                        <Inputs
                            header="Bank Name"
                            placeholder="Bank Name"
                            value={formData.bankName}
                            onChangeText={(value) => handleInputChange("bankName", value)}
                        />
                        <Inputs
                            header="Branch Name"
                            placeholder="Branch Name"
                            value={formData.branchName}
                            onChangeText={(value) => handleInputChange("branchName", value)}
                        />
                        <Inputs
                            header="IFSC Code"
                            placeholder="IFSC Code"
                            value={formData.IFSC}
                            onChangeText={(value) => handleInputChange("IFSC", value)}
                        />
                        <Inputs
                            header="Account Number"
                            placeholder="Account Number"
                            value={formData.accountNumber}
                            onChangeText={(value) => handleInputChange("accountNumber", value)}
                        />
                    </SafeAreaView>

                    <View style={styles.flex_row}>
                        <Pressable style={[styles.addButton, { backgroundColor: Colors.grey }]} onPress={handleCloseModal}>
                            <Text style={{ color: darkTheme ? Colors.black : Colors.white }}>CANCEL</Text>
                        </Pressable>
                        <Pressable style={[styles.addButton, { backgroundColor: btnColor }]} onPress={handleAdd}>
                            <Text style={{ color: oppTextColor, fontWeight: 500 }}>ADD</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal >
    );
}

const styles = StyleSheet.create({
    backImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: "cover",
    },
    cardContainer: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        position: 'relative',
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
        fontSize: 17,
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
    addButton: {
        borderRadius: 30,
        paddingVertical: 4,
        paddingHorizontal: 15,
    }
});

