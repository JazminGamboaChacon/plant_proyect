import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface GrowingBranchProps {
  icon: string;
  iconColor: string;
  stemColor: string;
  stemHeight: number;
  iconSize: number;
  delay: number;
  cycleDuration: number;
  style: ViewStyle;
}

export function GrowingBranch({
  icon, iconColor, stemColor,
  stemHeight, iconSize,
  delay, cycleDuration, style,
}: GrowingBranchProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(14);

  useEffect(() => {
    const grow  = Math.floor(cycleDuration * 0.35);
    const hold  = Math.floor(cycleDuration * 0.28);
    const fade  = Math.floor(cycleDuration * 0.25);
    const pause = cycleDuration - grow - hold - fade;

    const timer = setTimeout(() => {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.72, { duration: grow, easing: Easing.out(Easing.cubic) }),
          withTiming(0.72, { duration: hold }),
          withTiming(0,    { duration: fade, easing: Easing.in(Easing.cubic) }),
          withTiming(0,    { duration: pause }),
        ),
        -1, false,
      );
      translateY.value = withRepeat(
        withSequence(
          withTiming(0,  { duration: grow, easing: Easing.out(Easing.cubic) }),
          withTiming(0,  { duration: hold }),
          withTiming(-8, { duration: fade, easing: Easing.in(Easing.cubic) }),
          withTiming(14, { duration: 0 }),
          withTiming(14, { duration: pause }),
        ),
        -1, false,
      );
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ position: "absolute", alignItems: "center" }, style, animStyle]}>
      <MaterialCommunityIcons name={icon as any} size={iconSize} color={iconColor} />
      <View style={{ width: 2, height: stemHeight, backgroundColor: stemColor, borderRadius: 1 }} />
    </Animated.View>
  );
}
