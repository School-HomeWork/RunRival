import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { leaderboard } from "../data/mockData";
import LeaderboardItem from "../components/LeaderboardItem";
import { colors, fonts, radius, spacing } from "../theme";

const PERIODS = ["Bu Hafta", "Bu Ay", "Tüm Zamanlar"];

export default function LeaderboardScreen() {
  const [activePeriod, setActivePeriod] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const currentUserRank = leaderboard.find((r) => r.isCurrentUser);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Liderlik Tablosu</Text>
              <Text style={styles.subtitle}>Dünyaya Meydan Oku! 🌍</Text>
            </View>
            <Text style={styles.headerEmoji}>🏆</Text>
          </View>

          {/* Period Tabs */}
          <View style={styles.periodTabs}>
            {PERIODS.map((p, i) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.periodTab,
                  activePeriod === i && styles.periodTabActive,
                ]}
                onPress={() => setActivePeriod(i)}
              >
                <Text
                  style={[
                    styles.periodText,
                    activePeriod === i && styles.periodTextActive,
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Your Rank Banner */}
          {currentUserRank && (
            <LinearGradient
              colors={[colors.primary + "30", colors.secondary + "20"]}
              style={styles.myRankBanner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.myRankLabel}>Senin Sıran</Text>
              <Text style={styles.myRankNum}>#{currentUserRank.rank}</Text>
              <Text style={styles.myRankDist}>
                🥇 Lider'e{" "}
                {(leaderboard[0].distance - currentUserRank.distance).toFixed(
                  1,
                )}{" "}
                km uzakta
              </Text>
            </LinearGradient>
          )}

          {/* Podium */}
          <View style={styles.podium}>
            {/* 2nd place - left */}
            <View style={[styles.podiumItem, styles.podiumSecond]}>
              <Text style={styles.podiumAvatar}>{top3[1].avatar}</Text>
              <View
                style={[
                  styles.podiumBlock,
                  {
                    height: 70,
                    backgroundColor: "#C0C0C020",
                    borderColor: "#C0C0C0",
                  },
                ]}
              >
                <Text style={styles.podiumMedal}>🥈</Text>
                <Text style={styles.podiumName}>
                  {top3[1].name.split(" ")[0]}
                </Text>
                <Text style={styles.podiumKm}>{top3[1].distance} km</Text>
              </View>
            </View>

            {/* 1st place - center */}
            <View style={[styles.podiumItem, styles.podiumFirst]}>
              <View style={styles.crownWrapper}>
                <Text style={styles.crown}>👑</Text>
              </View>
              <Text style={[styles.podiumAvatar, { fontSize: 36 }]}>
                {top3[0].avatar}
              </Text>
              <View
                style={[
                  styles.podiumBlock,
                  {
                    height: 90,
                    backgroundColor: "#FFD70020",
                    borderColor: "#FFD700",
                  },
                ]}
              >
                <Text style={styles.podiumMedal}>🥇</Text>
                <Text style={[styles.podiumName, { fontSize: fonts.md }]}>
                  {top3[0].name.split(" ")[0]}
                </Text>
                <Text style={styles.podiumKm}>{top3[0].distance} km</Text>
              </View>
            </View>

            {/* 3rd place - right */}
            <View style={[styles.podiumItem, styles.podiumThird]}>
              <Text style={styles.podiumAvatar}>{top3[2].avatar}</Text>
              <View
                style={[
                  styles.podiumBlock,
                  {
                    height: 55,
                    backgroundColor: "#CD7F3220",
                    borderColor: "#CD7F32",
                  },
                ]}
              >
                <Text style={styles.podiumMedal}>🥉</Text>
                <Text style={styles.podiumName}>
                  {top3[2].name.split(" ")[0]}
                </Text>
                <Text style={styles.podiumKm}>{top3[2].distance} km</Text>
              </View>
            </View>
          </View>

          {/* Top 3 stats */}
          <View style={styles.top3Cards}>
            {top3.map((r) => (
              <View key={r.id} style={styles.top3Card}>
                <Text style={styles.top3Name}>{r.name.split(" ")[0]}</Text>
                <Text style={styles.top3Streak}>🔥 {r.streak} gün seri</Text>
              </View>
            ))}
          </View>

          {/* Rest of leaderboard */}
          <Text style={styles.sectionLabel}>Diğer Koşucular</Text>
          {rest.map((runner, i) => (
            <LeaderboardItem key={runner.id} runner={runner} index={i} />
          ))}

          <View style={{ height: 110 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  title: { fontSize: fonts.xxl, fontWeight: "900", color: colors.textPrimary },
  subtitle: { fontSize: fonts.sm, color: colors.textSecondary, marginTop: 2 },
  headerEmoji: { fontSize: 40 },
  periodTabs: {
    flexDirection: "row",
    backgroundColor: colors.bgCard,
    borderRadius: radius.round,
    padding: 4,
    marginBottom: spacing.lg,
  },
  periodTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: radius.round,
  },
  periodTabActive: { backgroundColor: colors.primary },
  periodText: {
    fontSize: fonts.sm,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  periodTextActive: { color: "#fff", fontWeight: "800" },
  myRankBanner: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + "40",
  },
  myRankLabel: { fontSize: fonts.sm, color: colors.textSecondary },
  myRankNum: { fontSize: fonts.xxl, fontWeight: "900", color: colors.primary },
  myRankDist: { fontSize: fonts.xs, color: colors.textSecondary },
  podium: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  podiumItem: { flex: 1, alignItems: "center" },
  podiumFirst: { marginBottom: 0 },
  podiumSecond: { marginBottom: 0 },
  podiumThird: { marginBottom: 0 },
  crownWrapper: { marginBottom: -4 },
  crown: { fontSize: 24 },
  podiumAvatar: { fontSize: 28, marginBottom: 4 },
  podiumBlock: {
    width: "100%",
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
  },
  podiumMedal: { fontSize: 16 },
  podiumName: {
    fontSize: fonts.sm,
    fontWeight: "800",
    color: colors.textPrimary,
    marginTop: 2,
  },
  podiumKm: { fontSize: fonts.xs, color: colors.textSecondary, marginTop: 1 },
  top3Cards: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  top3Card: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: "center",
  },
  top3Name: {
    fontSize: fonts.sm,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  top3Streak: { fontSize: fonts.xs, color: colors.textSecondary, marginTop: 2 },
  sectionLabel: {
    fontSize: fonts.md,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
