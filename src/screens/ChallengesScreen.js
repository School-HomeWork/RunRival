import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { challenges } from "../data/mockData";
import ChallengeCard from "../components/ChallengeCard";
import { colors, fonts, radius, spacing } from "../theme";

const FILTERS = [
  { key: "all", label: "Tümü", icon: "🏆" },
  { key: "joined", label: "Katıldıklarım", icon: "✅" },
  { key: "distance", label: "Mesafe", icon: "📍" },
  { key: "speed", label: "Hız", icon: "⚡" },
  { key: "community", label: "Topluluk", icon: "🌍" },
];

export default function ChallengesScreen() {
  const [activeFilter, setActiveFilter] = useState("all");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const filtered = challenges.filter((c) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "joined") return c.joined;
    return c.type === activeFilter;
  });

  const joinedCount = challenges.filter((c) => c.joined).length;
  const totalParticipants = challenges.reduce(
    (sum, c) => sum + c.participants,
    0,
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Meydan Okumalar</Text>
              <Text style={styles.subtitle}>
                Sınırlarını zorla, rekabete katıl!
              </Text>
            </View>
            <Text style={styles.headerEmoji}>🏆</Text>
          </View>

          {/* Stats Banner */}
          <View style={styles.banner}>
            <View style={styles.bannerStat}>
              <Text style={styles.bannerVal}>{joinedCount}</Text>
              <Text style={styles.bannerLabel}>Aktif</Text>
            </View>
            <View style={styles.bannerDivider} />
            <View style={styles.bannerStat}>
              <Text style={styles.bannerVal}>{challenges.length}</Text>
              <Text style={styles.bannerLabel}>Toplam</Text>
            </View>
            <View style={styles.bannerDivider} />
            <View style={styles.bannerStat}>
              <Text style={styles.bannerVal}>
                {(totalParticipants / 1000).toFixed(1)}k
              </Text>
              <Text style={styles.bannerLabel}>Katılımcı</Text>
            </View>
          </View>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContent}
          >
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterTab,
                  activeFilter === f.key && styles.filterTabActive,
                ]}
                onPress={() => setActiveFilter(f.key)}
              >
                <Text style={styles.filterIcon}>{f.icon}</Text>
                <Text
                  style={[
                    styles.filterLabel,
                    activeFilter === f.key && styles.filterLabelActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Challenges List */}
          <View style={styles.list}>
            {filtered.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🏃</Text>
                <Text style={styles.emptyTitle}>Sonuç bulunamadı</Text>
                <Text style={styles.emptyText}>
                  Bu kategoride meydan okuma yok.
                </Text>
              </View>
            ) : (
              filtered.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))
            )}
          </View>

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
  banner: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    flexDirection: "row",
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: "center",
    justifyContent: "space-around",
  },
  bannerStat: { alignItems: "center" },
  bannerVal: { fontSize: fonts.xxl, fontWeight: "900", color: colors.primary },
  bannerLabel: {
    fontSize: fonts.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bannerDivider: { width: 1, height: 36, backgroundColor: colors.border },
  filterScroll: { marginBottom: spacing.lg },
  filterContent: { gap: spacing.sm, paddingRight: spacing.sm },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderRadius: radius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  filterTabActive: {
    backgroundColor: colors.primary + "20",
    borderColor: colors.primary,
  },
  filterIcon: { fontSize: 14 },
  filterLabel: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  filterLabelActive: { color: colors.primary },
  list: {},
  empty: { alignItems: "center", paddingVertical: 60 },
  emptyIcon: { fontSize: 52, marginBottom: spacing.md },
  emptyTitle: {
    fontSize: fonts.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  emptyText: { fontSize: fonts.sm, color: colors.textSecondary, marginTop: 4 },
});
