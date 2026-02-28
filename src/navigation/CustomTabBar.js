import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme";

const { width } = Dimensions.get("window");

const BAR_HEIGHT = 64;
const CENTER_SIZE = 62;
const NOTCH_SIZE = CENTER_SIZE + 16;

const TAB_CONFIG = [
  {
    name: "Home",
    icon: "🏠",
    activeColor: "#FF6B35",
    gradientColors: ["#FF6B3540", "#FF6B3510"],
  },
  {
    name: "Challenges",
    icon: "🏆",
    activeColor: "#F5A623",
    gradientColors: ["#F5A62340", "#F5A62310"],
  },
  {
    name: "Leaderboard",
    icon: "🌍",
    activeColor: "#9B59B6",
    gradientColors: ["#C084FC", "#9B59B6"],
    isCenter: true,
  },
  {
    name: "HeadToHead",
    icon: "⚔️",
    activeColor: "#E94560",
    gradientColors: ["#E9456040", "#E9456010"],
  },
  {
    name: "Profile",
    icon: "👤",
    activeColor: "#00D4AA",
    gradientColors: ["#00D4AA40", "#00D4AA10"],
  },
];

export default function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const scaleAnims = useRef(
    TAB_CONFIG.map(() => new Animated.Value(1)),
  ).current;
  const glowAnims = useRef(TAB_CONFIG.map(() => new Animated.Value(0))).current;

  const handlePress = (tabName, index) => {
    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.82,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        friction: 4,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();

    navigation.navigate(tabName);
  };

  const activeIndex = state.index;

  const renderTab = (tab, globalIndex) => {
    const isActive = activeIndex === globalIndex;
    const cfg = TAB_CONFIG[globalIndex];

    return (
      <Animated.View
        key={tab.name}
        style={[
          styles.tabWrapper,
          { transform: [{ scale: scaleAnims[globalIndex] }] },
        ]}
      >
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handlePress(tab.name, globalIndex)}
          activeOpacity={0.7}
        >
          {/* Active glow background */}
          {isActive && (
            <LinearGradient
              colors={cfg.gradientColors}
              style={styles.activeGlow}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}

          <Text style={[styles.icon, !isActive && styles.iconInactive]}>
            {tab.icon}
          </Text>

          {/* Active dot indicator */}
          {isActive && (
            <View
              style={[styles.activeDot, { backgroundColor: cfg.activeColor }]}
            />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.outerWrapper, { paddingBottom: insets.bottom }]}>
      {/* Notch circle — same color as app bg, creates wave cutout illusion */}
      <View style={styles.notchCircle} />

      {/* Bar */}
      <View style={styles.bar}>
        {/* Left 2 tabs */}
        <View style={styles.side}>
          {TAB_CONFIG.slice(0, 2).map((tab, i) => renderTab(tab, i))}
        </View>

        {/* Center gap (notch space) */}
        <View style={styles.centerGap} />

        {/* Right 2 tabs */}
        <View style={styles.side}>
          {TAB_CONFIG.slice(3, 5).map((tab, i) => renderTab(tab, i + 3))}
        </View>
      </View>

      {/* Center elevated button */}
      <Animated.View
        style={[
          styles.centerButtonOuter,
          { transform: [{ scale: scaleAnims[2] }] },
        ]}
      >
        <TouchableOpacity
          onPress={() => handlePress("Leaderboard", 2)}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={
              activeIndex === 2
                ? ["#D8A0F7", "#9B59B6", "#6C3483"]
                : ["#8E44AD", "#6C3483", "#4A235A"]
            }
            style={styles.centerButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.centerIcon}>🌍</Text>
            {/* Shine streak */}
            <View style={styles.centerShine} />
          </LinearGradient>

          {/* Active ring */}
          {activeIndex === 2 && <View style={styles.centerRing} />}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    // Extra height to accommodate the elevated center button
    height: BAR_HEIGHT + CENTER_SIZE / 2 + 16,
    justifyContent: "flex-end",
  },

  // The wave notch illusion — bg-colored circle punches a hole in the bar top
  notchCircle: {
    position: "absolute",
    width: NOTCH_SIZE,
    height: NOTCH_SIZE,
    borderRadius: NOTCH_SIZE / 2,
    backgroundColor: colors.bg, // same as app background
    top: 6, // peek above the bar
    zIndex: 2,
    // No shadow — it needs to be invisible against the background
  },

  bar: {
    width: width - 24,
    height: BAR_HEIGHT,
    backgroundColor: "#141428",
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    zIndex: 1,
    // Shadow
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 20,
    borderWidth: 1,
    borderColor: "#2A2A45",
  },

  side: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  centerGap: {
    width: NOTCH_SIZE + 4,
  },

  tabWrapper: {
    flex: 1,
    alignItems: "center",
  },

  tab: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    position: "relative",
  },

  activeGlow: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 14,
  },

  icon: {
    fontSize: 24,
    zIndex: 1,
  },

  iconInactive: {
    opacity: 0.38,
  },

  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    position: "absolute",
    bottom: 3,
  },

  // Center elevated button
  centerButtonOuter: {
    position: "absolute",
    top: 0,
    zIndex: 10,
    alignSelf: "center",
  },

  centerButton: {
    width: CENTER_SIZE,
    height: CENTER_SIZE,
    borderRadius: CENTER_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#9B59B6",
    shadowOpacity: 0.7,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 16,
    overflow: "hidden",
  },

  centerIcon: {
    fontSize: 28,
    zIndex: 1,
  },

  centerShine: {
    position: "absolute",
    top: 6,
    left: 10,
    width: 20,
    height: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.18)",
    transform: [{ rotate: "-30deg" }],
  },

  centerRing: {
    position: "absolute",
    top: -5,
    left: -5,
    width: CENTER_SIZE + 10,
    height: CENTER_SIZE + 10,
    borderRadius: (CENTER_SIZE + 10) / 2,
    borderWidth: 2,
    borderColor: "#9B59B6",
    opacity: 0.6,
  },
});
