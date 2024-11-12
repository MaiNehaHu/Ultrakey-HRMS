import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from "@/constants/Colors";

interface BreakRecord {
  breakStartAt: string;
  breakEndAt: string | null;
}

interface BreaksProps {
  breakRecords: BreakRecord[];
}

export default function BreakRecords({ breakRecords }: BreaksProps) {
  const { darkTheme } = useAppTheme();
  const textColor = Colors[darkTheme ? "dark" : "light"].text;

  return (
    <View style={styles.recordContainer}>
      <View style={styles.recordRow}>
        <Text
          style={{
            color: darkTheme ? Colors.white : Colors.black,
            fontWeight: "500",
            fontSize: 16,
          }}
        >
          Break Start:
        </Text>
        <Text
          style={{
            fontWeight: "500",
            fontSize: 16,
            color: darkTheme ? Colors.white : Colors.black,
          }}
        >
          Break End:
        </Text>
      </View>
      {breakRecords.length > 0 ? (
        breakRecords.map((breakRecord, index) => (
          <View key={index} style={styles.recordRow}>
            <Text style={{ color: textColor }}>
              {breakRecord.breakStartAt
                ? new Date(breakRecord.breakStartAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "~~"}
            </Text>
            <Text style={{ color: textColor }}>
              {breakRecord.breakEndAt
                ? new Date(breakRecord.breakEndAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "~~"}
            </Text>
          </View>
        ))
      ) : (
        <Text style={{ color: textColor }}>No breaks recorded</Text>
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
