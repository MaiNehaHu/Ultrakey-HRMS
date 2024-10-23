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

                  <Text
                    style={[
                      styles.modalTitle,
                      {
                        color: darkTheme ? Colors.white : Colors.darkBlue,
                        borderColor: textColor,
                      },
                    ]}
                  >
                    Select Month
                  </Text>
                  <SafeAreaView style={styles.monthsContainer}>
                    {months.map((month, index) => (
                      <Pressable
                        key={index}
                        onPress={() => handleMonthClick(index)}
                        style={[
                          styles.monthButton,
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
                  <View style={styles.flexRowRight}>
                    <Pressable
                      onPress={onClose}
                      style={[
                        styles.actionButton,
                        {
                          backgroundColor: darkTheme
                            ? Colors.white
                            : Colors.darkBlue,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          { color: oppTextColor },
                        ]}
                      >
                        <FontAwesome6Icon name="circle-xmark" /> Close
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={onNext}
                      style={[
                        styles.actionButton,
                        {
                          backgroundColor: darkTheme
                            ? Colors.white
                            : Colors.darkBlue,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          { color: oppTextColor },
                        ]}
                      >
                        Next <FontAwesome6Icon name="arrow-right" />
                      </Text>
                    </Pressable>
                  </View>
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

                  <Text
                    style={[
                      styles.modalTitle,
                      {
                        color: darkTheme ? Colors.white : Colors.darkBlue,
                        borderColor: textColor,
                      },
                    ]}
                  >
                    Select Year
                  </Text>
                  <SafeAreaView style={styles.monthsContainer}>
                    {years.map((year, index) => (
                      <Pressable
                        key={index}
                        onPress={() => handleYearClick(year)}
                        style={[
                          styles.monthButton,
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
                  <View style={styles.flexRowRight}>
                    <Pressable
                      onPress={onBack}
                      style={[
                        styles.actionButton,
                        {
                          backgroundColor: darkTheme
                            ? Colors.white
                            : Colors.darkBlue,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          { color: oppTextColor },
                        ]}
                      >
                        <FontAwesome6Icon name="arrow-left" /> Back
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={onDone}
                      style={[
                        styles.actionButton,
                        {
                          backgroundColor: darkTheme
                            ? Colors.white
                            : Colors.darkBlue,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          { color: oppTextColor },
                        ]}
                      >
                        Done <FontAwesome6Icon name="check-circle" />
                      </Text>
                    </Pressable>
                  </View>
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
    marginBottom: 10,
    textAlign: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  monthsContainer: {
    rowGap: 7,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  flexRowRight: {
    width: "100%",
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  monthButton: {
    width: "32%",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: Colors.white,
  },
  actionButtonText: {
    color: Colors.darkBlue,
  },
  backImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
});
