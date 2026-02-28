import React, { useRef, useEffect } from "react";
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

// ─── Layout constants ────────────────────────────────────────────────────────
const BUTTON_SIZE = 56; // diameter of the elevated circle
const NOTCH_DIAM = BUTTON_SIZE + 22; // 78 — bg-colored circle that carves the wave
const BAR_HEIGHT = 62;
const BUMP_H = 0; // button centre sits this many px above bar top
const WRAPPER_H = BAR_HEIGHT + BUMP_H + BUTTON_SIZE / 2; // 112

const BAR_MARGIN = 14;
const BAR_W = width - BAR_MARGIN * 2;
const TAB_W = BAR_W / 5;

// Vertical positions from container top
const BAR_TOP = BUMP_H + BUTTON_SIZE / 2; // 28 — where the bar begins

const BTN_OVERLAP = 14; // px the button centre sits INSIDE the bar
const BTN_CENTER_Y = BAR_TOP + BTN_OVERLAP; // 42
const BTN_TOP_OFFSET = BTN_CENTER_Y - BUTTON_SIZE / 2; // 14 — top of the button in the container
const NOTCH_TOP = BTN_CENTER_Y - NOTCH_DIAM / 2; //  3 — notch centred with the button

// Screen-X of tab i's centre
const getTabCenterX = (i) => BAR_MARGIN + (i + 0.5) * TAB_W;

// ─── Tab definitions ─────────────────────────────────────────────────────────
const TAB_CONFIG = [
  {
    name: "Home",
    icon: "🏠",
    activeColor: "#FF6B35",
    glowColors: ["#FF8C5A", "#FF4500"],
  },
  {
    name: "Challenges",
    icon: "🏆",
    activeColor: "#F5A623",
    glowColors: ["#F5C842", "#E8920A"],
  },
  {
    name: "Leaderboard",
    icon: "🌍",
    activeColor: "#9B59B6",
    glowColors: ["#C084FC", "#7C3AED"],
  },
  {
    name: "HeadToHead",
    icon: "⚔️",
    activeColor: "#E94560",
    glowColors: ["#FF6B8A", "#C41B3A"],
  },
  {
    name: "Profile",
    icon: "👤",
    activeColor: "#00D4AA",
    glowColors: ["#00F5C8", "#00A884"],
  },
];

export default function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  // Single animated value tracking the X centre of the active bump
  const bumpX = useRef(new Animated.Value(getTabCenterX(state.index))).current;
  const scaleAnims = useRef(
    TAB_CONFIG.map(() => new Animated.Value(1)),
  ).current;

  // Spring the bump to the new active tab whenever state.index changes
  useEffect(() => {
    Animated.spring(bumpX, {
      toValue: getTabCenterX(state.index),
      useNativeDriver: false, // 'left' is a layout prop — native driver unsupported
      friction: 8,
      tension: 130,
    }).start();
  }, [state.index]);

  // notchLeft  = bumpX − NOTCH_DIAM/2   (linear interpolate, slope = 1)
  // buttonLeft = bumpX − BUTTON_SIZE/2
  const notchLeft = bumpX.interpolate({
    inputRange: [0, width],
    outputRange: [-NOTCH_DIAM / 2, width - NOTCH_DIAM / 2],
  });
  const buttonLeft = bumpX.interpolate({
    inputRange: [0, width],
    outputRange: [-BUTTON_SIZE / 2, width - BUTTON_SIZE / 2],
  });

  const handlePress = (name, index) => {
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.78,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        friction: 4,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();
    navigation.navigate(name);
  };

  const activeIndex = state.index;
  const activeCfg = TAB_CONFIG[activeIndex];

  return (
    <View style={[styles.container, { height: WRAPPER_H + insets.bottom }]}>
      {/* ── 1. Flat bar — renders all 5 icons; active one is invisible (elevated button shows it) ── */}
      <View style={[styles.bar, { top: BAR_TOP }]}>
        {TAB_CONFIG.map((tab, i) => (
          <Animated.View
            key={tab.name}
            style={[styles.tabItem, { transform: [{ scale: scaleAnims[i] }] }]}
          >
            <TouchableOpacity
              style={styles.tabTouch}
              onPress={() => handlePress(tab.name, i)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.icon,
                  i === activeIndex ? styles.iconHidden : styles.iconInactive,
                ]}
              >
                {tab.icon}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* ── 2. Moving notch — bg-coloured circle that carves the wave dip ── */}
      <Animated.View
        style={[styles.notch, { top: NOTCH_TOP, left: notchLeft }]}
      />

      {/* ── 3. Moving elevated button — icon & colour always match the active tab ── */}
      <Animated.View
        style={[styles.btnOuter, { top: BTN_TOP_OFFSET, left: buttonLeft }]}
      >
        <TouchableOpacity
          onPress={() => handlePress(activeCfg.name, activeIndex)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={activeCfg.glowColors}
            style={[styles.btn, { shadowColor: activeCfg.activeColor }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.btnIcon}>{activeCfg.icon}</Text>
            <View style={styles.btnShine} />
          </LinearGradient>
          {/* coloured halo ring */}
          <View
            style={[
              styles.btnRing,
              { borderColor: activeCfg.activeColor + "90" },
            ]}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Outer container ──
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },

  // ── Bar ──
  bar: {
    position: "absolute",
    left: BAR_MARGIN,
    right: BAR_MARGIN,
    height: BAR_HEIGHT,
    backgroundColor: "#141428",
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A45",
    shadowColor: "#000",
    shadowOpacity: 0.55,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 20,
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  tabTouch: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: { fontSize: 24 },

  // Active tab's icon in the bar is hidden — the elevated button shows it
  iconHidden: { opacity: 0 },
  iconInactive: { opacity: 0.35 },

  // ── Moving notch (wave carver) ──
  notch: {
    position: "absolute",
    width: NOTCH_DIAM,
    height: NOTCH_DIAM,
    borderRadius: NOTCH_DIAM / 2,
    backgroundColor: colors.bg, // matches app background → invisible "hole"
    zIndex: 2,
  },

  // ── Moving elevated button ──
  btnOuter: {
    position: "absolute",
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    zIndex: 10,
  },

  btn: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.75,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 18,
    overflow: "hidden",
  },

  btnIcon: { fontSize: 26 },

  btnShine: {
    position: "absolute",
    top: 7,
    left: 8,
    width: 18,
    height: 9,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.22)",
    transform: [{ rotate: "-35deg" }],
  },

  btnRing: {
    position: "absolute",
    top: -5,
    left: -5,
    width: BUTTON_SIZE + 10,
    height: BUTTON_SIZE + 10,
    borderRadius: (BUTTON_SIZE + 10) / 2,
    borderWidth: 2,
    opacity: 0.65,
  },
});
