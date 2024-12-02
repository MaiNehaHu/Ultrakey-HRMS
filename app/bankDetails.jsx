import {
    Animated,
    Easing,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Keyboard,
    Modal,
    TextInput,
    ScrollView,
    Pressable,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useAppTheme } from '../contexts/AppTheme';
import Colors from '../constants/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useProfileContext } from '../contexts/ProfileDetails';

const backgroundImage = require("../assets/images/body_bg.png");

export default function BankDetails() {
    const navigation = useNavigation();
    const { darkTheme } = useAppTheme();
    const { profileDetails, setProfileDetails } = useProfileContext();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedBankDetails, setSelectedBankDetails] = useState(null);

    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const slideModalAnim = useRef(new Animated.Value(200)).current;

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => setIsKeyboardVisible(true));
        const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => setIsKeyboardVisible(false));

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleOpenAddModal = () => {
        setIsAddModalVisible(true);

        Animated.timing(slideModalAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    };

    const handleCloseAddModal = () => {
        Animated.timing(slideModalAnim, {
            toValue: 700, // Slide back down
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }).start(() => {
            setIsAddModalVisible(false);
        });
    };

    const handleOpenEditModal = (bankDetails) => {
        setSelectedBankDetails(bankDetails); // Set the selected bank details
        setIsEditModalVisible(true);

        Animated.timing(slideModalAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    };


    const handleCloseEditModal = () => {
        Animated.timing(slideModalAnim, {
            toValue: 700, // Slide back down
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }).start(() => {
            setIsEditModalVisible(false);
        });
    };

    const handleAddBankDetails = (newAccount) => {
        setProfileDetails((prevDetails) => ({
            ...prevDetails,
            bankDetails: [...prevDetails.bankDetails, newAccount],
        }));
    };

    const handleEditBankDetails = (updatedAccount) => {
        setProfileDetails((prevDetails) => ({
            ...prevDetails,
            bankDetails: prevDetails.bankDetails.map((account) =>
                account.bank_details_id === updatedAccount.bank_details_id ? updatedAccount : account
            ),
        }));
    };

    const handleDeleteBankDetails = (bank_details_id) => {
        Alert.alert(
            "Are you sure?",
            `You are deleting the bank details?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        setProfileDetails((prevDetails) => ({
                            ...prevDetails,
                            bankDetails: prevDetails.bankDetails.filter(
                                (bank) => bank.bank_details_id !== bank_details_id // Exclude the matching bank detail
                            ),
                        }));
                    },
                },
            ],
            { cancelable: true } // Allow dismissal by tapping outside
        );
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Animated.View
                    style={{ transform: [{ scale: scaleAnim }] }}
                >
                    {!darkTheme ? (
                        <LinearGradient
                            colors={["#1F366A", "#1A6FA8"]}
                            style={styles.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Pressable
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                            >
                                <Text style={{ fontWeight: 500, color: "#fff" }}>Add New</Text>
                            </Pressable>
                        </LinearGradient>
                    ) : (
                        <Pressable
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            style={[{ backgroundColor: Colors.lightBlue }, styles.gradient]}
                        >
                            <Text style={{ fontWeight: 500, color: "#fff" }}>Add New</Text>
                        </Pressable>
                    )}
                </Animated.View>
            ),
        });
    }, [darkTheme]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        handleOpenAddModal();

        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={{ backgroundColor: bgColor, flex: 1, }}>
            <ImageBackground source={backgroundImage} style={styles.backImage} />

            <ScrollView style={{ flex: 1, padding: 10 }}>
                <SafeAreaView style={{ gap: 10, display: 'flex', paddingBottom: 20, paddingTop: 10 }}>
                    {profileDetails.bankDetails.map((account, index) => (
                        <InfoCard
                            key={index}
                            index={index}
                            bankName={account.bankName}
                            branchName={account.branchName}
                            IFSC={account.IFSC}
                            bank_details_id={account.bank_details_id}
                            accountNumber={account.accountNumber}
                            header={index < 1 ? "Primary Bank" : "Other Account"}
                            handleOpenEditModal={() => handleOpenEditModal(account)}
                            handleDeleteBankDetails={handleDeleteBankDetails}
                        />
                    ))}
                </SafeAreaView>
            </ScrollView>

            <AddModal
                isVisible={isAddModalVisible}
                handleCloseAddModal={handleCloseAddModal}
                isKeyboardVisible={isKeyboardVisible}
                onAddBankDetails={handleAddBankDetails}
                slideModalAnim={slideModalAnim}
            />

            <EditModal
                isVisible={isEditModalVisible}
                handleCloseEditModal={handleCloseEditModal}
                isKeyboardVisible={isKeyboardVisible}
                onEditBankDetails={handleEditBankDetails}
                slideModalAnim={slideModalAnim}
                selectedBankDetails={selectedBankDetails} // Pass selected details
            />
        </View>
    );
}

function InfoCard({ index, header, bankName, IFSC, bank_details_id, branchName, accountNumber, handleDeleteBankDetails, handleOpenEditModal }) {
    const { darkTheme } = useAppTheme();
    const [showSensitiveData, setShowSensitiveData] = useState(false);

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;

    return (
        <View>
            <View style={[styles.cardContainer, { borderColor: textColor, padding: 15, margin: 5 }]}>
                <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>{header}</Text>

                <View style={[{ display: 'flex', flexDirection: 'row', gap: 15 }, styles.actionButtons,]}>
                    <Pressable
                        onPress={() => handleOpenEditModal(bank_details_id)}
                        style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}
                    >
                        <FontAwesome6 name='edit' size={16} color={darkTheme ? Colors.white : Colors.lightBlue} />
                    </Pressable>

                    {index !== 0 &&
                        <Pressable
                            onPress={() => handleDeleteBankDetails(bank_details_id)}
                            style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}
                        >
                            <FontAwesome6 name='trash' size={16} color={Colors.red} />
                        </Pressable>
                    }
                    {index === 0 &&
                        <View style={{ backgroundColor: bgColor, paddingHorizontal: 2, }}>
                            <FontAwesome6 name='check-circle' size={16} color={darkTheme ? Colors.white : Colors.lightBlue} />
                        </View>
                    }
                </View>

                <Text style={[{ color: textColor }, styles.bodyText]}>
                    Name: {bankName}
                </Text>
                <Text style={[{ color: textColor }, styles.bodyText]}>
                    Branch: {branchName}
                </Text>
                <Text style={[{ color: textColor }, styles.bodyText]}>
                    IFSC: {IFSC}
                </Text>
                <View style={styles.flex_row}>
                    <Text style={[{ color: textColor }, styles.bodyText]}>
                        Account No.: {!showSensitiveData ? `XXXX XXXX ${accountNumber.slice(-5, accountNumber.length - 1)}` : accountNumber}
                    </Text>

                    {
                        <TouchableOpacity
                            onPress={() => setShowSensitiveData(!showSensitiveData)}
                            style={styles.eyeIcon}
                        >
                            <FontAwesome
                                name={showSensitiveData ? "eye" : "eye-slash"}
                                size={20}
                                color={textColor}
                            />
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </View>
    );
}

function AddModal({ isVisible, handleCloseAddModal, isKeyboardVisible, onAddBankDetails, slideModalAnim }) {
    const { darkTheme } = useAppTheme();

    const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;
    const btnColor = darkTheme ? Colors.white : Colors.darkBlue

    const [formData, setFormData] = useState({
        bankName: "",
        branchName: "",
        IFSC: "",
        accountNumber: "",
        bank_details_id: Math.round(Math.random() * 100)
    });

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAdd = () => {
        if (formData.bankName && formData.branchName && formData.IFSC && formData.accountNumber) {
            onAddBankDetails(formData);            
            setFormData({
                bankName: "",
                branchName: "",
                IFSC: "",
                accountNumber: "",
            });
            handleCloseAddModal();
        } else {
            Alert.alert("All fields are required");
        }
    };

    function handleCancel() {
        handleCloseAddModal()
        setFormData({
            bankName: "",
            branchName: "",
            IFSC: "",
            accountNumber: "",
        });
    }

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
                            accountNumberKey
                            value={formData.accountNumber}
                            onChangeText={(value) => handleInputChange("accountNumber", value)}
                        />
                    </SafeAreaView>

                    <View style={styles.flex_row}>
                        <Pressable style={[styles.addButton, { backgroundColor: Colors.grey }]} onPress={handleCancel}>
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

function EditModal({ selectedBankDetails, isVisible, handleCloseEditModal, isKeyboardVisible, onEditBankDetails, slideModalAnim }) {
    const { darkTheme } = useAppTheme();

    const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;
    const btnColor = darkTheme ? Colors.white : Colors.darkBlue;

    const [formData, setFormData] = useState({
        bankName: "",
        branchName: "",
        IFSC: "",
        accountNumber: "",
    });

    useEffect(() => {
        if (selectedBankDetails) {
            setFormData(selectedBankDetails);
        }
    }, [selectedBankDetails]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleEdit = () => {
        if (formData.bankName && formData.branchName && formData.IFSC && formData.accountNumber) {
            handleCloseEditModal();
            onEditBankDetails(formData);

            setFormData({
                bankName: "",
                branchName: "",
                IFSC: "",
                accountNumber: "",
            });
        } else {
            Alert.alert("All fields are required");
        }
    };

    const handleCancel = () => {
        handleCloseEditModal();
        setFormData({
            bankName: "",
            branchName: "",
            IFSC: "",
            accountNumber: "",
        });
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
                            accountNumberKey
                            value={formData.accountNumber}
                            onChangeText={(value) => handleInputChange("accountNumber", value)}
                        />
                    </SafeAreaView>

                    <View style={styles.flex_row}>
                        <Pressable style={[styles.addButton, { backgroundColor: Colors.grey }]} onPress={handleCancel}>
                            <Text style={{ color: darkTheme ? Colors.black : Colors.white }}>CANCEL</Text>
                        </Pressable>
                        <Pressable style={[styles.addButton, { backgroundColor: btnColor }]} onPress={handleEdit}>
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
    accountNumberKey
}) {
    const { darkTheme } = useAppTheme();

    const bgColor = Colors[darkTheme ? "dark" : "light"].background;
    const textColor = Colors[darkTheme ? "dark" : "light"].text;
    const headerText = darkTheme ? "#e3e3e3" : Colors.lightBlue;

    return (
        <TouchableWithoutFeedback>
            <View style={{ marginBottom: 10, paddingVertical: 5 }}>
                <View style={[styles.cardContainer, { borderColor: textColor }]}>
                    <Text style={[{ color: headerText, backgroundColor: bgColor }, styles.headerText]}>{header}</Text>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[styles.inputField, { color: textColor, borderColor: textColor, paddingVertical: 10, }]}
                            placeholder={placeholder}
                            value={value}
                            keyboardType={accountNumberKey ? 'number-pad' : 'default'}
                            onChangeText={onChangeText}
                            placeholderTextColor={darkTheme ? "#e3e3e3" : "#666666"}
                        />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}


const styles = StyleSheet.create({
    backImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: "cover",
    },
    flex_row: {
        gap: 10,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    scrollContainer: {
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    safeArea: {
        gap: 5,
        borderBottomWidth: 1,
        borderBottomColor: Colors.darkBlue,
        paddingBottom: 10,
    },
    cardContainer: {
        borderWidth: 1,
        borderRadius: 10,
    },
    headerText: {
        top: -10,
        left: 10,
        fontSize: 12,
        fontWeight: "500",
        position: "absolute",
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
        fontWeight: "400",
        marginVertical: 2,
    },
    eyeIcon: {
        right: 10,
        position: "absolute",
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
    addButton: {
        width: "48%",
        marginTop: 20,
        borderRadius: 5,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    gradient: {
        borderRadius: 30,
        paddingHorizontal: 15,
        paddingVertical: 7,
    },
    inputWrapper: {
        paddingHorizontal: 10,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    inputField: {
        flex: 1,
    },
});
