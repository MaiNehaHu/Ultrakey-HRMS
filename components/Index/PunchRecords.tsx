import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";

interface PunchRecord {
  punchIn: Date | null;
  punchOut: Date | null;
}

interface PunchProps {
  punchRecords: PunchRecord[];
}

export default function PunchRecords({ punchRecords }: PunchProps) {
  const { darkTheme } = useAppTheme();
  const textColor = Colors[darkTheme ? "dark" : "light"].text;

  return (
    <View style={styles.recordContainer}>
      <SafeAreaView style={styles.recordRow}>
        <Text
          style={{
            color: darkTheme ? Colors.white : Colors.black,
            fontWeight: "500",
            fontSize: 16,
          }}
        >
          Punch In:{" "}
        </Text>
        <Text
          style={{
            fontWeight: "500",
            fontSize: 16,
            color: darkTheme ? Colors.white : Colors.black,
          }}
        >
          Punch Out:
        </Text>
      </SafeAreaView>

      {punchRecords.length > 0 ? (
        <SafeAreaView style={styles.recordRow}>
          <Text style={{ color: textColor }}>
            {punchRecords[0].punchIn?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }) ?? "~~"}
          </Text>
          <Text style={{ color: textColor }}>
            {punchRecords[punchRecords.length - 1].punchOut?.toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ) ?? "~~"}
          </Text>
        </SafeAreaView>
      ) : (
        <Text style={{ color: textColor }}>No punch recorded</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  recordContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
  },
  recordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    backgroundColor: "transparent",
  },
});
