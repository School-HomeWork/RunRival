import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { colors, fonts, spacing } from "../theme";

export default function ComparisonBar({
  label,
  icon,
  myValue,
  theirValue,
  unit,
  formatValue,
  higherIsBetter = true,
}) {
  const myAnim = useRef(new Animated.Value(0)).current;
  const theirAnim = useRef(new Animated.Value(0)).current;

  const maxVal = Math.max(myValue, theirValue) || 1;
  const myPct = (myValue / maxVal) * 100;
  const theirPct = (theirValue / maxVal) * 100;

  const myWins = higherIsBetter ? myValue >= theirValue : myValue <= theirValue;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(myAnim, {
        toValue: myPct,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(theirAnim, {
        toValue: theirPct,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();
  }, [myPct, theirPct]);

  const myWidth = myAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });
  const theirWidth = theirAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const display = formatValue || ((v) => `${v}${unit ? " " + unit : ""}`);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.barsContainer}>
        {/* My bar (left side, grows right) */}
        <View style={styles.barSide}>
          <Text
            style={[
              styles.valueText,
              myWins ? styles.winText : styles.loseText,
            ]}
          >
            {display(myValue)}
          </Text>
          <View style={styles.barTrack}>
            <Animated.View
              style={[
                styles.barFill,
                styles.myBarFill,
                {
                  width: myWidth,
                  backgroundColor: myWins ? colors.success : colors.secondary,
                },
              ]}
            />
          </View>
        </View>

        {/* Center divider */}
        <View style={styles.divider} />

        {/* Their bar (right side, grows right) */}
        <View style={[styles.barSide, styles.barSideRight]}>
          <View style={styles.barTrack}>
            <Animated.View
              style={[
                styles.barFill,
                {
                  width: theirWidth,
                  backgroundColor: !myWins ? colors.success : colors.secondary,
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.valueText,
              !myWins ? styles.winText : styles.loseText,
            ]}
          >
            {display(theirValue)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    justifyContent: "center",
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  label: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
  },
  barSide: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  barSideRight: {
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  barTrack: {
    flex: 1,
    height: 10,
    backgroundColor: colors.bgCardLight,
    borderRadius: 5,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 5,
  },
  myBarFill: {
    alignSelf: "flex-end",
  },
  divider: {
    width: 2,
    height: 30,
    backgroundColor: colors.border,
    marginHorizontal: 10,
    borderRadius: 1,
  },
  valueText: {
    fontSize: fonts.sm,
    fontWeight: "700",
    minWidth: 55,
    textAlign: "center",
  },
  winText: {
    color: colors.success,
  },
  loseText: {
    color: colors.secondary,
  },
});
