import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { currentUser, challenges } from "../data/mockData";
import StatCard from "../components/StatCard";
import { colors, fonts, radius, spacing } from "../theme";

const { width } = Dimensions.get("window");
const MAX_BAR = 90;

export default function HomeScreen({ navigation }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const barAnims = useRef(
    currentUser.weeklyStats.map(() => new Animated.Value(0)),
  ).current;

  const todayKm =
    currentUser.weeklyStats[6].km || currentUser.weeklyStats[5].km;
  const ringProgress = Math.min((todayKm / 10) * 100, 100);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    Animated.stagger(
      80,
      barAnims.map((anim, i) =>
        Animated.timing(anim, {
          toValue: (currentUser.weeklyStats[i].km / 12) * MAX_BAR,
          duration: 700,
          useNativeDriver: false,
        }),
      ),
    ).start();
  }, []);

  const activeChallenges = challenges.filter((c) => c.joined).slice(0, 2);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                Merhaba, {currentUser.name} 👋
              </Text>
              <Text style={styles.subGreeting}>Bugün de harika koş! 🔥</Text>
            </View>
            <View style={styles.avatarWrapper}>
              <Animated.View
                style={[
                  styles.avatarPulse,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={styles.avatarGrad}
                >
                  <Text style={styles.avatarEmoji}>{currentUser.avatar}</Text>
                </LinearGradient>
              </Animated.View>
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>🔥{currentUser.streak}</Text>
              </View>
            </View>
          </View>

          {/* Today's Activity Card */}
          <LinearGradient
            colors={["#FF6B35", "#E94560"]}
            style={styles.todayCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.todayLeft}>
              <Text style={styles.todayLabel}>Bugünün Koşusu</Text>
              <Text style={styles.todayKm}>{todayKm} km</Text>
              <Text style={styles.todayGoal}>Hedef: 10 km</Text>
              <View style={styles.todayProgressBg}>
                <View
                  style={[
                    styles.todayProgressFill,
                    { width: `${ringProgress}%` },
                  ]}
                />
              </View>
              <Text style={styles.todayPct}>
                {Math.round(ringProgress)}% tamamlandı
              </Text>
            </View>
            <View style={styles.todayRight}>
              <View style={styles.ringContainer}>
                <Text style={styles.ringEmoji}>🏃</Text>
                <Text style={styles.ringValue}>{ringProgress.toFixed(0)}%</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Quick Stats */}
          <Text style={styles.sectionTitle}>Haftalık Özet</Text>
          <View style={styles.statsRow}>
            <StatCard
              label="Mesafe"
              value={currentUser.weeklyDistance}
              unit="km"
              icon="📍"
              gradientColors={["#FF6B3520", "#1A1A2E"]}
            />
            <StatCard
              label="Kalori"
              value={(currentUser.calories / 1000).toFixed(1)}
              unit="k"
              icon="🔥"
              gradientColors={["#E9456020", "#1A1A2E"]}
            />
            <StatCard
              label="Seri"
              value={currentUser.streak}
              unit="gün"
              icon="⚡"
              gradientColors={["#F5A62320", "#1A1A2E"]}
            />
          </View>

          {/* Weekly Bar Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Bu Haftaki Koşular</Text>
            <View style={styles.barsRow}>
              {currentUser.weeklyStats.map((day, i) => (
                <View key={day.day} style={styles.barColumn}>
                  <Animated.View
                    style={[
                      styles.bar,
                      {
                        height: barAnims[i],
                        backgroundColor:
                          day.km > 0 ? colors.primary : colors.bgCardLight,
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{day.day}</Text>
                  {day.km > 0 && <Text style={styles.barKm}>{day.km}</Text>}
                </View>
              ))}
            </View>
          </View>

          {/* Active Challenges */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aktif Meydan Okumalar</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Challenges")}>
              <Text style={styles.seeAll}>Tümü →</Text>
            </TouchableOpacity>
          </View>
          {activeChallenges.map((challenge) => {
            const pct = Math.round((challenge.current / challenge.goal) * 100);
            return (
              <View
                key={challenge.id}
                style={[
                  styles.miniChallenge,
                  { borderLeftColor: challenge.color },
                ]}
              >
                <Text style={styles.miniIcon}>{challenge.icon}</Text>
                <View style={styles.miniInfo}>
                  <Text style={styles.miniTitle}>{challenge.title}</Text>
                  <View style={styles.miniBarBg}>
                    <View
                      style={[
                        styles.miniBarFill,
                        { width: `${pct}%`, backgroundColor: challenge.color },
                      ]}
                    />
                  </View>
                </View>
                <Text style={[styles.miniPct, { color: challenge.color }]}>
                  {pct}%
                </Text>
              </View>
            );
          })}

          {/* Recent Runs */}
          <Text style={styles.sectionTitle}>Son Koşular</Text>
          {currentUser.recentRuns.slice(0, 3).map((run) => (
            <View key={run.id} style={styles.runRow}>
              <View style={styles.runLeft}>
                <Text style={styles.runDate}>{run.date}</Text>
                <Text style={styles.runDist}>{run.distance} km</Text>
              </View>
              <View style={styles.runStats}>
                <View style={styles.runStat}>
                  <Text style={styles.runStatVal}>{run.time}</Text>
                  <Text style={styles.runStatLabel}>Süre</Text>
                </View>
                <View style={styles.runStat}>
                  <Text style={styles.runStatVal}>{run.pace}</Text>
                  <Text style={styles.runStatLabel}>Pace</Text>
                </View>
                <View style={styles.runStat}>
                  <Text style={styles.runStatVal}>{run.calories}</Text>
                  <Text style={styles.runStatLabel}>kcal</Text>
                </View>
              </View>
            </View>
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
  greeting: {
    fontSize: fonts.xl,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subGreeting: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  avatarWrapper: { position: "relative" },
  avatarPulse: {},
  avatarGrad: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: { fontSize: 26 },
  streakBadge: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  streakText: { fontSize: 10, fontWeight: "800", color: colors.gold },
  todayCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    flexDirection: "row",
    marginBottom: spacing.xl,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  todayLeft: { flex: 1 },
  todayLabel: {
    fontSize: fonts.sm,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  todayKm: {
    fontSize: fonts.xxxl,
    fontWeight: "900",
    color: "#fff",
    marginTop: 4,
  },
  todayGoal: {
    fontSize: fonts.xs,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  todayProgressBg: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 3,
    marginTop: spacing.md,
    overflow: "hidden",
  },
  todayProgressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 3,
  },
  todayPct: {
    fontSize: fonts.xs,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
    fontWeight: "600",
  },
  todayRight: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: spacing.lg,
  },
  ringContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
  },
  ringEmoji: { fontSize: 28 },
  ringValue: { fontSize: fonts.sm, fontWeight: "800", color: "#fff" },
  sectionTitle: {
    fontSize: fonts.lg,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  seeAll: { fontSize: fonts.sm, color: colors.primary, fontWeight: "700" },
  statsRow: {
    flexDirection: "row",
    marginBottom: spacing.xl,
    marginHorizontal: -spacing.xs,
  },
  chartCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  chartTitle: {
    fontSize: fonts.md,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: MAX_BAR + 20,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  bar: { width: "65%", borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 10, color: colors.textSecondary, fontWeight: "600" },
  barKm: {
    fontSize: 9,
    color: colors.textMuted,
    position: "absolute",
    top: -16,
  },
  miniChallenge: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
  },
  miniIcon: { fontSize: 22, marginRight: spacing.sm },
  miniInfo: { flex: 1 },
  miniTitle: {
    fontSize: fonts.sm,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  miniBarBg: {
    height: 6,
    backgroundColor: colors.bgCardLight,
    borderRadius: 3,
    overflow: "hidden",
  },
  miniBarFill: { height: "100%", borderRadius: 3 },
  miniPct: { fontSize: fonts.md, fontWeight: "800", marginLeft: spacing.sm },
  runRow: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  runLeft: { marginRight: spacing.md },
  runDate: { fontSize: fonts.xs, color: colors.textSecondary },
  runDist: { fontSize: fonts.xl, fontWeight: "800", color: colors.textPrimary },
  runStats: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.lg,
  },
  runStat: { alignItems: "center" },
  runStatVal: {
    fontSize: fonts.md,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  runStatLabel: { fontSize: fonts.xs, color: colors.textSecondary },
});
