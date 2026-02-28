import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { currentUser, opponents } from "../data/mockData";
import ComparisonBar from "../components/ComparisonBar";
import { colors, fonts, radius, spacing } from "../theme";

const METRICS = [
  {
    key: "distance",
    label: "Toplam Mesafe",
    icon: "📍",
    unit: "km",
    higherIsBetter: true,
    format: (v) => `${v} km`,
  },
  {
    key: "calories",
    label: "Yakılan Kalori",
    icon: "🔥",
    unit: "kcal",
    higherIsBetter: true,
    format: (v) => `${(v / 1000).toFixed(1)}k`,
  },
  {
    key: "elevation",
    label: "Yükseklik Farkı",
    icon: "🏔️",
    unit: "m",
    higherIsBetter: true,
    format: (v) => `${v}m`,
  },
  {
    key: "speed",
    label: "Ortalama Hız",
    icon: "⚡",
    unit: "km/s",
    higherIsBetter: true,
    format: (v) => `${v} km/s`,
  },
];

export default function HeadToHeadScreen() {
  const [selectedOpponent, setSelectedOpponent] = useState(opponents[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const vsAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(vsAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedOpponent]);

  const myStats = {
    distance: currentUser.totalDistance,
    calories: currentUser.calories,
    elevation: currentUser.elevation,
    speed: currentUser.avgSpeed,
  };

  const theirStats = {
    distance: selectedOpponent.stats.distance,
    calories: selectedOpponent.stats.calories,
    elevation: selectedOpponent.stats.elevation,
    speed: selectedOpponent.stats.speed,
  };

  const myWins = METRICS.filter((m) =>
    m.higherIsBetter
      ? myStats[m.key] >= theirStats[m.key]
      : myStats[m.key] <= theirStats[m.key],
  ).length;

  const winning = myWins >= METRICS.length / 2;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Bire Bir Yarış</Text>
              <Text style={styles.subtitle}>Rakibinle kafa kafaya yaz!</Text>
            </View>
            <Text style={styles.headerEmoji}>⚔️</Text>
          </View>

          {/* VS Banner */}
          <LinearGradient
            colors={
              winning ? ["#00D4AA20", "#0D0D1A"] : ["#E9456020", "#0D0D1A"]
            }
            style={styles.vsBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            {/* Result message */}
            <View
              style={[
                styles.resultBadge,
                {
                  backgroundColor: winning
                    ? colors.success + "20"
                    : colors.secondary + "20",
                },
              ]}
            >
              <Text
                style={[
                  styles.resultText,
                  { color: winning ? colors.success : colors.secondary },
                ]}
              >
                {winning ? "🏆 Öndesin!" : "💪 Kap arkandaki!"}
              </Text>
            </View>

            {/* Vs Row */}
            <View style={styles.vsRow}>
              {/* Me */}
              <View style={styles.vsPlayer}>
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={styles.vsAvatar}
                >
                  <Text style={styles.vsAvatarEmoji}>{currentUser.avatar}</Text>
                </LinearGradient>
                <Text style={styles.vsName}>{currentUser.name}</Text>
                <Text style={styles.vsUsername}>{currentUser.username}</Text>
                <View style={styles.vsLevel}>
                  <Text style={styles.vsLevelText}>{currentUser.level}</Text>
                </View>
              </View>

              {/* VS badge */}
              <Animated.View
                style={[styles.vsBadge, { transform: [{ scale: vsAnim }] }]}
              >
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={styles.vsGrad}
                >
                  <Text style={styles.vsText}>VS</Text>
                </LinearGradient>
              </Animated.View>

              {/* Opponent */}
              <TouchableOpacity
                style={styles.vsPlayer}
                onPress={() => setModalVisible(true)}
              >
                <View
                  style={[
                    styles.vsAvatar,
                    {
                      backgroundColor: colors.bgCardLight,
                      borderWidth: 2,
                      borderColor: colors.secondary,
                      borderStyle: "dashed",
                    },
                  ]}
                >
                  <Text style={styles.vsAvatarEmoji}>
                    {selectedOpponent.avatar}
                  </Text>
                </View>
                <Text style={styles.vsName}>{selectedOpponent.name}</Text>
                <Text style={styles.vsUsername}>
                  {selectedOpponent.username}
                </Text>
                <View
                  style={[
                    styles.vsLevel,
                    { backgroundColor: colors.secondary + "20" },
                  ]}
                >
                  <Text
                    style={[styles.vsLevelText, { color: colors.secondary }]}
                  >
                    Rakip ↓
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Score */}
            <View style={styles.scoreRow}>
              <Text
                style={[
                  styles.scoreNum,
                  { color: winning ? colors.success : colors.textSecondary },
                ]}
              >
                {myWins}
              </Text>
              <Text style={styles.scoreSep}> — </Text>
              <Text
                style={[
                  styles.scoreNum,
                  { color: !winning ? colors.success : colors.textSecondary },
                ]}
              >
                {METRICS.length - myWins}
              </Text>
            </View>
            <Text style={styles.scoreLabel}>
              Kazanılan / Kaybedilen kategoriler
            </Text>
          </LinearGradient>

          {/* Comparison Bars */}
          <View style={styles.compCard}>
            <View style={styles.compHeader}>
              <Text style={styles.compMe}>{currentUser.name}</Text>
              <Text style={styles.compTitle}>İstatistik Karşılaştırması</Text>
              <Text style={styles.compThem}>
                {selectedOpponent.name.split(" ")[0]}
              </Text>
            </View>

            {METRICS.map((m) => (
              <ComparisonBar
                key={m.key}
                label={m.label}
                icon={m.icon}
                myValue={myStats[m.key]}
                theirValue={theirStats[m.key]}
                unit={m.unit}
                formatValue={m.format}
                higherIsBetter={m.higherIsBetter}
              />
            ))}
          </View>

          {/* Pace comparison */}
          <View style={styles.paceCard}>
            <Text style={styles.paceTitle}>⏱ Pace Karşılaştırması</Text>
            <View style={styles.paceRow}>
              <View style={styles.paceSide}>
                <Text style={styles.paceVal}>{currentUser.avgPace}</Text>
                <Text style={styles.paceLabel}>min/km</Text>
                <Text style={styles.paceName}>{currentUser.name}</Text>
              </View>
              <View style={styles.paceDivider} />
              <View style={styles.paceSide}>
                <Text style={styles.paceVal}>
                  {selectedOpponent.stats.pace}
                </Text>
                <Text style={styles.paceLabel}>min/km</Text>
                <Text style={styles.paceName}>
                  {selectedOpponent.name.split(" ")[0]}
                </Text>
              </View>
            </View>
            <Text style={styles.paceDiff}>
              {(() => {
                const myParts = currentUser.avgPace.split(":").map(Number);
                const thParts = selectedOpponent.stats.pace
                  .split(":")
                  .map(Number);
                const myTot = myParts[0] * 60 + myParts[1];
                const thTot = thParts[0] * 60 + thParts[1];
                const diff = Math.abs(myTot - thTot);
                const faster = myTot <= thTot;
                const mins = Math.floor(diff / 60);
                const secs = diff % 60;
                const diffStr = mins > 0 ? `${mins}dk ${secs}sn` : `${secs}sn`;
                return faster
                  ? `✅ ${diffStr} daha hızlısın!`
                  : `📈 ${diffStr} fark kapatman gerek`;
              })()}
            </Text>
          </View>

          <View style={{ height: 110 }} />
        </Animated.View>
      </ScrollView>

      {/* Opponent Picker Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Rakip Seç</Text>
            <FlatList
              data={opponents}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.opponentRow,
                    selectedOpponent.id === item.id &&
                      styles.opponentRowSelected,
                  ]}
                  onPress={() => {
                    setSelectedOpponent(item);
                    setModalVisible(false);
                    fadeAnim.setValue(0);
                    Animated.timing(fadeAnim, {
                      toValue: 1,
                      duration: 400,
                      useNativeDriver: true,
                    }).start();
                  }}
                >
                  <Text style={styles.opponentAvatar}>{item.avatar}</Text>
                  <View style={styles.opponentInfo}>
                    <Text style={styles.opponentName}>{item.name}</Text>
                    <Text style={styles.opponentUsername}>{item.username}</Text>
                  </View>
                  <Text style={styles.opponentDist}>
                    {item.stats.distance} km
                  </Text>
                  {selectedOpponent.id === item.id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
  vsBanner: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.round,
    marginBottom: spacing.lg,
  },
  resultText: { fontSize: fonts.md, fontWeight: "800" },
  vsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  vsPlayer: { flex: 1, alignItems: "center", gap: 4 },
  vsAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  vsAvatarEmoji: { fontSize: 32 },
  vsName: { fontSize: fonts.md, fontWeight: "800", color: colors.textPrimary },
  vsUsername: { fontSize: fonts.xs, color: colors.textSecondary },
  vsLevel: {
    backgroundColor: colors.primary + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.round,
  },
  vsLevelText: { fontSize: fonts.xs, color: colors.primary, fontWeight: "700" },
  vsBadge: { width: 52, height: 52, borderRadius: 26 },
  vsGrad: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  vsText: { fontSize: fonts.lg, fontWeight: "900", color: "#fff" },
  scoreRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  scoreNum: { fontSize: fonts.xxxl, fontWeight: "900" },
  scoreSep: {
    fontSize: fonts.xl,
    color: colors.textSecondary,
    fontWeight: "800",
  },
  scoreLabel: { fontSize: fonts.xs, color: colors.textSecondary },
  compCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  compHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  compMe: { fontSize: fonts.sm, fontWeight: "700", color: colors.success },
  compTitle: {
    fontSize: fonts.xs,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  compThem: { fontSize: fonts.sm, fontWeight: "700", color: colors.secondary },
  paceCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  paceTitle: {
    fontSize: fonts.md,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  paceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: spacing.md,
  },
  paceSide: { alignItems: "center" },
  paceVal: {
    fontSize: fonts.xxl,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  paceLabel: { fontSize: fonts.xs, color: colors.textSecondary },
  paceName: {
    fontSize: fonts.sm,
    fontWeight: "700",
    color: colors.textSecondary,
    marginTop: 4,
  },
  paceDivider: { width: 1, height: 50, backgroundColor: colors.border },
  paceDiff: {
    textAlign: "center",
    fontSize: fonts.sm,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: colors.bgCard,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    maxHeight: "70%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fonts.xl,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  opponentRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.bg,
  },
  opponentRowSelected: { borderWidth: 1.5, borderColor: colors.primary },
  opponentAvatar: { fontSize: 28, marginRight: spacing.sm },
  opponentInfo: { flex: 1 },
  opponentName: {
    fontSize: fonts.md,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  opponentUsername: { fontSize: fonts.xs, color: colors.textSecondary },
  opponentDist: {
    fontSize: fonts.sm,
    fontWeight: "700",
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  checkmark: { fontSize: 18, color: colors.primary, fontWeight: "800" },
});
