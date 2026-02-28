import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { colors, fonts, radius, spacing } from "../theme";

export default function ChallengeCard({ challenge, onPress }) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  const progress = Math.min((challenge.current / challenge.goal) * 100, 100);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: challenge.color, borderLeftWidth: 3 },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>{challenge.icon}</Text>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{challenge.title}</Text>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: challenge.difficultyColor + "25" },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: challenge.difficultyColor },
                  ]}
                >
                  {challenge.difficulty}
                </Text>
              </View>
              <Text style={styles.meta}>
                👥 {challenge.participants.toLocaleString()}
              </Text>
              <Text style={styles.meta}>⏳ {challenge.daysLeft} gün</Text>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            challenge.joined ? styles.joinedBadge : styles.openBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              challenge.joined ? styles.joinedText : styles.openText,
            ]}
          >
            {challenge.joined ? "✓ Katıldın" : "Katıl"}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{challenge.description}</Text>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>İlerleme</Text>
          <Text style={[styles.progressValue, { color: challenge.color }]}>
            {challenge.current} / {challenge.goal} {challenge.unit}
          </Text>
        </View>
        <View style={styles.progressBg}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: progressWidth, backgroundColor: challenge.color },
            ]}
          />
        </View>
        <Text style={[styles.progressPct, { color: challenge.color }]}>
          {Math.round(progress)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    flex: 1,
  },
  icon: {
    fontSize: 28,
    marginRight: spacing.sm,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: fonts.md,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.round,
  },
  badgeText: {
    fontSize: fonts.xs,
    fontWeight: "600",
  },
  meta: {
    fontSize: fonts.xs,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.round,
    marginLeft: spacing.sm,
  },
  joinedBadge: {
    backgroundColor: colors.success + "20",
  },
  openBadge: {
    backgroundColor: colors.primary + "20",
  },
  statusText: {
    fontSize: fonts.xs,
    fontWeight: "700",
  },
  joinedText: {
    color: colors.success,
  },
  openText: {
    color: colors.primary,
  },
  description: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  progressSection: {
    gap: 6,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: fonts.xs,
    color: colors.textSecondary,
  },
  progressValue: {
    fontSize: fonts.xs,
    fontWeight: "700",
  },
  progressBg: {
    height: 8,
    backgroundColor: colors.bgCardLight,
    borderRadius: radius.round,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radius.round,
  },
  progressPct: {
    fontSize: fonts.xs,
    fontWeight: "800",
    textAlign: "right",
  },
});
