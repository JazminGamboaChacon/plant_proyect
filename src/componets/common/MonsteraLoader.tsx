import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Ellipse, Path } from 'react-native-svg';

const BG = '#08200F';

// Leaf shape: shield/oval with petiole notch at bottom.
// viewBox 0 0 100 115
const LEAF_PATH =
  'M50,6 C70,6 90,22 90,48 C90,68 78,86 64,96 L60,108 L50,112 L40,108 L36,96 C22,86 10,68 10,48 C10,22 30,6 50,6 Z';

function MonsteraLeafSvg({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size * 1.15} viewBox="0 0 100 115">
      {/* Leaf body */}
      <Path d={LEAF_PATH} fill={color} />

      {/* Cuts from left margin — filled with BG to simulate pinnate splits */}
      <Path d="M10,44 L42,52 L10,62 Z" fill={BG} />
      <Path d="M12,66 L40,73 L16,83 Z" fill={BG} />

      {/* Cuts from right margin */}
      <Path d="M90,44 L58,52 L90,62 Z" fill={BG} />
      <Path d="M88,66 L60,73 L84,83 Z" fill={BG} />

      {/* Fenestrations (holes) */}
      <Ellipse cx="33" cy="48" rx="9" ry="5" transform="rotate(-22,33,48)" fill={BG} />
      <Ellipse cx="50" cy="41" rx="7" ry="4.5" fill={BG} />
      <Ellipse cx="67" cy="48" rx="9" ry="5" transform="rotate(22,67,48)" fill={BG} />

      {/* Veins */}
      <Path d="M50,6 L50,108" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" fill="none" />
      <Path d="M50,44 L18,62" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
      <Path d="M50,60 L16,76" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
      <Path d="M50,44 L82,62" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
      <Path d="M50,60 L84,76" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
    </Svg>
  );
}

function AnimatedLeaf({
  color,
  size,
  baseRotation,
  delay,
  style,
}: {
  color: string;
  size: number;
  baseRotation: number;
  delay: number;
  style?: object;
}) {
  const scale = useSharedValue(1);
  const swing = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.07, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.93, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );

    swing.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(5, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
          withTiming(-5, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { rotate: `${baseRotation + swing.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[style, animStyle]}>
      <MonsteraLeafSvg color={color} size={size} />
    </Animated.View>
  );
}

function Dot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.25);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.25, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.dot, style]} />;
}

export default function MonsteraLoader() {
  return (
    <View style={styles.container}>
      <View style={styles.leavesBox}>
        <AnimatedLeaf color="#163D22" size={135} baseRotation={-32} delay={0}   style={styles.leaf1} />
        <AnimatedLeaf color="#1F6033" size={158} baseRotation={6}   delay={320} style={styles.leaf2} />
        <AnimatedLeaf color="#267842" size={115} baseRotation={36}  delay={640} style={styles.leaf3} />
      </View>

      <View style={styles.dotsRow}>
        <Dot delay={0} />
        <Dot delay={240} />
        <Dot delay={480} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leavesBox: {
    width: 280,
    height: 290,
    position: 'relative',
  },
  leaf1: { position: 'absolute', top: 35, left: 5 },
  leaf2: { position: 'absolute', top: 20, left: 65 },
  leaf3: { position: 'absolute', top: 75, left: 155 },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 36,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#4CAF70',
  },
});
