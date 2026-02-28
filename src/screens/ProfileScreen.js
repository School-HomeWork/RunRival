import React, { useRef, useEffect } from "react";
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
import { currentUser } from "../data/mockData";
import { colors, fonts, radius, spacing } from "../theme";

export default function ProfileScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const mainStats = [
    {
      icon: "📍",
      value: `${currentUser.totalDistance} km`,
      label: "Toplam Mesafe",
    },
    { icon: "🏃", value: currentUser.totalRuns, label: "Toplam Koşu" },
    {
      icon: "🔥",
      value: `${(currentUser.calories / 1000).toFixed(1)}k`,
      label: "Yakılan Kcal",
    },
    { icon: "⚡", value: currentUser.avgPace, label: "Ort. Pace" },
    {
      icon: "🏔️",
      value: `${currentUser.elevation}m`,
      label: "Toplam Tırmanış",
    },
    { icon: "💨", value: `${currentUser.avgSpeed} km/s`, label: "Ort. Hız" },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Hero Header */}
          <LinearGradient
            colors={[colors.primary + "30", colors.secondary + "10", colors.bg]}
            style={styles.heroGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <Animated.View
              style={[
                styles.avatarWrapper,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.avatarGrad}
              >
                <Text style={styles.avatarEmoji}>{currentUser.avatar}</Text>
              </LinearGradient>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>⭐ {currentUser.level}</Text>
              </View>
            </Animated.View>
            <Text style={styles.name}>{currentUser.name}</Text>
            <Text style={styles.username}>{currentUser.username}</Text>

            <View style={styles.streakRow}>
              <View style={styles.streakCard}>
                <Text style={styles.streakNum}>🔥 {currentUser.streak}</Text>
                <Text style={styles.streakLabel}>Günlük Seri</Text>
              </View>
              <View style={styles.streakCard}>
                <Text style={styles.streakNum}>📅 {currentUser.totalRuns}</Text>
                <Text style={styles.streakLabel}>Toplam Koşu</Text>
              </View>
              <View style={styles.streakCard}>
                <Text style={styles.streakNum}>
                  🏅 {currentUser.badges.length}
                </Text>
                <Text style={styles.streakLabel}>Rozet</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Stats Grid */}
          <Text style={styles.sectionTitle}>Koşu İstatistikleri</Text>
          <View style={styles.statsGrid}>
            {mainStats.map((stat, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Badges */}
          <Text style={styles.sectionTitle}>Başarı Rozetleri</Text>
          <View style={styles.badgesGrid}>
            {currentUser.badges.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <View style={styles.badgeIconWrapper}>
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                </View>
                <Text style={styles.badgeLabel}>{badge.label}</Text>
                <Text style={styles.badgeDesc}>{badge.desc}</Text>
              </View>
            ))}
          </View>

          {/* Recent Runs */}
          <Text style={styles.sectionTitle}>Son Koşular</Text>
          {currentUser.recentRuns.map((run) => (
            <View key={run.id} style={styles.runCard}>
              <View style={styles.runLeft}>
                <Text style={styles.runIcon}>🏃</Text>
                <View>
                  <Text style={styles.runDate}>{run.date}</Text>
                  <Text style={styles.runDist}>{run.distance} km</Text>
                </View>
              </View>
              <View style={styles.runMetrics}>
                <View style={styles.runMetric}>
                  <Text style={styles.runMetricVal}>{run.time}</Text>
                  <Text style={styles.runMetricLabel}>Süre</Text>
                </View>
                <View style={styles.runMetric}>
                  <Text style={styles.runMetricVal}>{run.pace}</Text>
                  <Text style={styles.runMetricLabel}>Pace</Text>
                </View>
                <View style={styles.runMetric}>
                  <Text style={styles.runMetricVal}>{run.elevation}m</Text>
                  <Text style={styles.runMetricLabel}>Yükseliş</Text>
                </View>
                <View style={styles.runMetric}>
                  <Text style={styles.runMetricVal}>{run.calories}</Text>
                  <Text style={styles.runMetricLabel}>kcal</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Settings placeholder */}
          <View style={styles.settingsSection}>
            {[
              { icon: "🔔", label: "Bildirimler" },
              { icon: "🔒", label: "Gizlilik" },
              { icon: "🌍", label: "Dil & Bölge" },
              { icon: "❓", label: "Yardım & Destek" },
            ].map((item) => (
              <TouchableOpacity key={item.label} style={styles.settingsRow}>
                <Text style={styles.settingsIcon}>{item.icon}</Text>
                <Text style={styles.settingsLabel}>{item.label}</Text>
                <Text style={styles.settingsArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 110 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, backgroundColor: colors.bg },
  heroGrad: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  avatarWrapper: { alignItems: "center", marginBottom: spacing.md },
  avatarGrad: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    elevation: 12,
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  avatarEmoji: { fontSize: 46 },
  levelBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: radius.round,
    marginTop: -10,
    elevation: 4,
  },
  levelText: { fontSize: fonts.xs, color: "#fff", fontWeight: "800" },
  name: {
    fontSize: fonts.xxl,
    fontWeight: "900",
    color: colors.textPrimary,
    marginTop: 10,
  },
  username: { fontSize: fonts.sm, color: colors.textSecondary, marginTop: 2 },
  streakRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
    width: "100%",
  },
  streakCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: "center",
  },
  streakNum: {
    fontSize: fonts.lg,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  streakLabel: {
    fontSize: fonts.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: fonts.lg,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statItem: {
    width: "30.5%",
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: "center",
  },
  statIcon: { fontSize: 22, marginBottom: 4 },
  statValue: {
    fontSize: fonts.md,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fonts.xs,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 2,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  badgeItem: {
    width: "30.5%",
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: "center",
  },
  badgeIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  badgeIcon: { fontSize: 24 },
  badgeLabel: {
    fontSize: fonts.xs,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  badgeDesc: {
    fontSize: 9,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 2,
  },
  runCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  runLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  runIcon: { fontSize: 22 },
  runDate: { fontSize: fonts.xs, color: colors.textSecondary },
  runDist: { fontSize: fonts.xl, fontWeight: "900", color: colors.textPrimary },
  runMetrics: { flexDirection: "row", justifyContent: "space-between" },
  runMetric: { alignItems: "center" },
  runMetricVal: {
    fontSize: fonts.sm,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  runMetricLabel: { fontSize: fonts.xs, color: colors.textSecondary },
  settingsSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingsIcon: { fontSize: 20, marginRight: spacing.md },
  settingsLabel: {
    flex: 1,
    fontSize: fonts.md,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  settingsArrow: { fontSize: fonts.xl, color: colors.textMuted },
});
