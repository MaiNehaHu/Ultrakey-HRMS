import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import holidaysList from "@/constants/holidaysList";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import Colors from "@/constants/Colors";
import { useAppTheme } from "@/contexts/AppTheme";
type RootStackParamList = {
  task: undefined;
  holidaysList: undefined;
  leaves: undefined;
};

export default function UpcomingHolidaysCard() {
  const { darkTheme } = useAppTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const filteredHolidays = holidaysList.filter(
    (holiday) =>
      (new Date(holiday.date).getMonth() === currentMonth &&
        new Date(holiday.date).getFullYear() === currentYear) ||
      (new Date(holiday.date).getMonth() === currentMonth + 1 &&
        new Date(holiday.date).getFullYear() === currentYear)
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      // year: "numeric",
    }).format(new Date(date));
  };

  return (
    <SafeAreaView style={styles.cardContainer}>
      <View
        style={[
          styles.duplicateCard,
          {
            backgroundColor: darkTheme ? Colors.lightBlue : Colors.light.border,
          },
        ]}
      />
      <View style={styles.cardStyle}>
        {/**Header */}
        <SafeAreaView style={styles.flex_row}>
          <Text
            style={{
              color: Colors.darkBlue,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Upcoming Holidays
          </Text>

          <Text
            style={{
              color: Colors.darkBlue,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {filteredHolidays.length > 0 ? "Holiday for" : ""}
          </Text>
        </SafeAreaView>

        {/* Table */}
        <SafeAreaView>
          {filteredHolidays.length > 0 ? (
            filteredHolidays.map((holiday) => (
              <SafeAreaView style={styles.flex_row} key={holiday.date}>
                <Text
                  style={{
                    width: "60%",
                    color: Colors.black,
                    overflow: "scroll",
                  }}
                >
                  {formatDate(holiday.date)}
                </Text>
                <Text style={{ color: Colors.black, maxWidth: "60%" }}>
                  {holiday.name}
                </Text>
              </SafeAreaView>
            ))
          ) : (
            <Text style={{ color: Colors.black }}>No holidays in</Text>
          )}
        </SafeAreaView>

        <SafeAreaView>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => {
              navigation.navigate("holidaysList");
            }}
          >
            <Text style={styles.viewAllButtonText}>
              View All <FontAwesome6Icon name="arrow-right" />
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: "relative",
    // marginHorizontal: 10,
  },
  duplicateCard: {
    position: "absolute",
    top: -6,
    left: 0,
    right: 0,
    zIndex: -1,
    height: "100%",
    borderRadius: 20,
    elevation: 5,
    shadowRadius: 15,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  cardStyle: {
    display: "flex",
    gap: 5,
    padding: 12,
    borderRadius: 15,
    borderWidth: 0.5,
    borderTopWidth: 0,
    borderColor: "#929394",
    backgroundColor: Colors.white,
  },
  flex_row: {
    gap: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewAllButton: {
    marginTop: 5,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-end",
    backgroundColor: Colors.lightBlue,
  },
  viewAllButtonText: {
    color: Colors.white,
    textAlign: "right",
    fontWeight: "500",
    fontSize: 10,
  },
});
