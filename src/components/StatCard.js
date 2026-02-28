import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fonts, radius, spacing } from "../theme";

export default function StatCard({
  label,
  value,
  unit,
  icon,
  gradientColors,
  style,
}) {
  return (
    <LinearGradient
      colors={gradientColors || ["#1A1A2E", "#22223B"]}
      style={[styles.card, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>
        {value}
        {unit ? <Text style={styles.unit}> {unit}</Text> : null}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  icon: {
    fontSize: 22,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: fonts.xl,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: fonts.sm,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  label: {
    fontSize: fonts.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
});
