import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fonts, radius, spacing } from "../theme";

export default function LeaderboardItem({ runner, index }) {
  const isTop3 = runner.rank <= 3;
  const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

  const changeIcon = runner.change > 0 ? "↑" : runner.change < 0 ? "↓" : "—";
  const changeColor =
    runner.change > 0
      ? colors.success
      : runner.change < 0
        ? colors.secondary
        : colors.textMuted;

  return (
    <View style={[styles.row, runner.isCurrentUser && styles.currentUserRow]}>
      {/* Rank */}
      <View style={styles.rankContainer}>
        {isTop3 ? (
          <Text style={styles.medalEmoji}>
            {runner.rank === 1 ? "🥇" : runner.rank === 2 ? "🥈" : "🥉"}
          </Text>
        ) : (
          <Text
            style={[
              styles.rank,
              runner.isCurrentUser && { color: colors.primary },
            ]}
          >
            {runner.rank}
          </Text>
        )}
      </View>

      {/* Avatar */}
      <View
        style={[
          styles.avatarContainer,
          isTop3 && { borderColor: rankColors[runner.rank - 1] },
        ]}
      >
        <Text style={styles.avatar}>{runner.avatar}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text
            style={[
              styles.name,
              runner.isCurrentUser && styles.currentUserName,
            ]}
          >
            {runner.name}
          </Text>
          {runner.isCurrentUser && (
            <View style={styles.youBadge}>
              <Text style={styles.youText}>Sen</Text>
            </View>
          )}
        </View>
        <Text style={styles.username}>{runner.username}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRight}>
        <Text style={styles.distance}>{runner.distance.toFixed(1)} km</Text>
        <View style={styles.streakRow}>
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={styles.streak}>{runner.streak}</Text>
          <Text style={[styles.change, { color: changeColor }]}>
            {" "}
            {changeIcon}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  currentUserRow: {
    backgroundColor: colors.primary + "15",
    borderWidth: 1,
    borderColor: colors.primary + "40",
  },
  rankContainer: {
    width: 32,
    alignItems: "center",
  },
  rank: {
    fontSize: fonts.md,
    fontWeight: "800",
    color: colors.textSecondary,
  },
  medalEmoji: {
    fontSize: 20,
  },
  avatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.bgCardLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    marginRight: spacing.sm,
  },
  avatar: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  name: {
    fontSize: fonts.md,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  currentUserName: {
    color: colors.primary,
  },
  youBadge: {
    backgroundColor: colors.primary + "30",
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 10,
  },
  youText: {
    fontSize: fonts.xs,
    color: colors.primary,
    fontWeight: "700",
  },
  username: {
    fontSize: fonts.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  statsRight: {
    alignItems: "flex-end",
  },
  distance: {
    fontSize: fonts.md,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  streakFire: {
    fontSize: 11,
  },
  streak: {
    fontSize: fonts.xs,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  change: {
    fontSize: fonts.xs,
    fontWeight: "700",
  },
});
