import React from "react";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/contexts/AppTheme";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  Pressable,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

const backgroundImage = require("../../assets/images/body_bg.png");

interface Props {
  months: string[];
  years: number[];
  clickedMonth: number;
  clickedYear: number;
  isMonthVisible: boolean;
  isYearVisible: boolean;
  setPickerModalState: any;
}

export default function SelectMonthAndYear({
  isMonthVisible,
  isYearVisible,
  clickedMonth,
  clickedYear,
  months,
  years,
  setPickerModalState,
}: Props) {
  const { darkTheme } = useAppTheme();
  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const textColor = Colors[darkTheme ? "dark" : "light"].text;
  const oppTextColor = Colors[!darkTheme ? "dark" : "light"].text;

  const handleMonthClick = (month: number) => {
    setClickedMonth(month);
  };

  const handleYearClick = (year: number) => {
    setClickedYear(year);
  };

  function setClickedMonth(month: number) {
    setPickerModalState((prevState: any) => ({
      ...prevState,
      tempMonth: month,
    }));
  }

  function setClickedYear(year: number) {
    setPickerModalState((prevState: any) => ({
      ...prevState,
      tempYear: year,
    }));
  }

  function onClose() {
    setPickerModalState((prevState: any) => ({
      ...prevState,
      showPickerMonthModal: false,
      showPickerYearModal: false,
    }));
  }

  function onDone() {
    setPickerModalState((prevState: any) => ({
      ...prevState,
      selectedMonth: prevState.tempMonth,
      selectedYear: prevState.tempYear,
    }));
    setPickerModalState((prevState: any) => ({
      ...prevState,
      showPickerMonthModal: false,
      showPickerYearModal: false,
    }));
  }

  function onNext() {
    setPickerModalState((prevState: any) => ({
      ...prevState,
      showPickerYearModal: true,
      showPickerMonthModal: false,
    }));
  }

  function onBack() {
    setPickerModalState((prevState: any) => ({
      ...prevState,
      showPickerYearModal: false,
      showPickerMonthModal: true,
    }));
  }

  return (
    <SafeAreaView>
      <Modal transparent={true} visible={true} animationType="fade">
        <Pressable style={styles.modalBackground}>
          <View style={styles.modalContainerWrapper}>
            {isMonthVisible ? (
              <Pressable onPress={(e) => e.stopPropagation()}>
                <SafeAreaView
                  style={[styles.modalContent, { backgroundColor: bgColor }]}
                >
                  <ImageBackground
                    source={backgroundImage}
                    style={styles.backImage}
                  />

                  <SafeAreaView style={styles.optionsContainer}>
                    <View
                      style={[
                        styles.flexRowRight,
                        { borderBottomColor: textColor },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={onClose}
                        style={styles.actionButton}
                      >
                        <Text
                          style={[
                            styles.actionButtonText,
                            { color: textColor },
                          ]}
                        >
                          <FontAwesome6Icon name="circle-xmark" size={18} />
                        </Text>
                      </TouchableOpacity>

                      <Text
                        style={[
                          styles.modalTitle,
                          {
                            color: darkTheme ? Colors.white : Colors.black,
                            borderColor: textColor,
                          },
                        ]}
                      >
                        Select Month
                      </Text>

                      <TouchableOpacity
                        onPress={onNext}
                        style={styles.actionButton}
                      >
                        <Text
                          style={[
                            styles.actionButtonText,
                            { color: textColor },
                          ]}
                        >
                          <FontAwesome6Icon name="arrow-right" size={18} />
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {months.map((month, index) => (
                      <Pressable
                        key={index}
                        onPress={() => handleMonthClick(index)}
                        style={[
                          styles.optionButton,
                          {
                            backgroundColor:
                              clickedMonth === index
                                ? Colors.lightBlue
                                : "transparent",
                          },
                        ]}
                      >
                        <Text
                          style={{
                            color:
                              clickedMonth === index ? Colors.white : textColor,
                            fontWeight: clickedMonth === index ? 600 : 400,
                          }}
                        >
                          {month}
                        </Text>
                      </Pressable>
                    ))}
                  </SafeAreaView>
                </SafeAreaView>
              </Pressable>
            ) : (
              <Pressable onPress={(e) => e.stopPropagation()}>
                <SafeAreaView
                  style={[styles.modalContent, { backgroundColor: bgColor }]}
                >
                  <ImageBackground
                    source={backgroundImage}
                    style={styles.backImage}
                  />

                  <View
                    style={[
                      styles.flexRowRight,
                      { borderBottomColor: textColor, marginBottom: 15 },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={onBack}
                      style={styles.actionButton}
                    >
                      <Text
                        style={[styles.actionButtonText, { color: textColor }]}
                      >
                        <FontAwesome6Icon name="arrow-left" size={18} />
                      </Text>
                    </TouchableOpacity>

                    <Text
                      style={[
                        styles.modalTitle,
                        {
                          color: darkTheme ? Colors.white : Colors.black,
                          borderColor: textColor,
                        },
                      ]}
                    >
                      Select Year
                    </Text>

                    <TouchableOpacity
                      onPress={onDone}
                      style={styles.actionButton}
                    >
                      <Text
                        style={[styles.actionButtonText, { color: textColor }]}
                      >
                        <FontAwesome6Icon name="check-circle" size={18} />
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <SafeAreaView style={styles.optionsContainer}>
                    {years.map((year, index) => (
                      <Pressable
                        key={index}
                        onPress={() => handleYearClick(year)}
                        style={[
                          styles.optionButton,
                          {
                            backgroundColor:
                              clickedYear === year
                                ? Colors.lightBlue
                                : "transparent",
                          },
                        ]}
                      >
                        <Text
                          style={{
                            color:
                              clickedYear === year ? Colors.white : textColor,
                            fontWeight: clickedYear === year ? 600 : 400,
                          }}
                        >
                          {year}
                        </Text>
                      </Pressable>
                    ))}
                  </SafeAreaView>
                </SafeAreaView>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainerWrapper: {
    width: "85%",
  },
  modalContent: {
    padding: 15,
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  optionsContainer: {
    rowGap: 7,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  flexRowRight: {
    width: "100%",
    marginBottom: 10,
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  optionButton: {
    width: "32%",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    padding: 5,
  },
  actionButtonText: {
    color: Colors.darkBlue,
  },
  backImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
});
