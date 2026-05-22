import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Ellipse } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

type Props = {
  permanentlyDenied: boolean;
  onAllow: () => void;
  onOpenSettings: () => void;
};

const PETALS = [0, 45, 90, 135, 180, 225, 270, 315];

function DecoFlower({
  size,
  petalColor,
  accentColor,
  centerColor,
}: {
  size: number;
  petalColor: string;
  accentColor: string;
  centerColor: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const rx = size * 0.09;
  const ry = size * 0.22;
  const petalOffset = size * 0.18;
  const dotR = size * 0.06;
  const dotOffset = size * 0.3;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {PETALS.map((angle, i) => (
        <Ellipse
          key={`p${i}`}
          cx={cx}
          cy={petalOffset}
          rx={rx}
          ry={ry}
          fill={i % 2 === 0 ? petalColor : accentColor}
          opacity={0.9}
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      ))}
      {PETALS.map((angle, i) => (
        <Circle
          key={`d${i}`}
          cx={cx}
          cy={dotOffset}
          r={dotR}
          fill={accentColor}
          opacity={0.6}
          transform={`rotate(${angle + 22.5} ${cx} ${cy})`}
        />
      ))}
      <Circle cx={cx} cy={cy} r={size * 0.13} fill={centerColor} opacity={0.95} />
    </Svg>
  );
}

export default function CameraPermissionScreen({ permanentlyDenied, onAllow, onOpenSettings }: Props) {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 32, paddingVertical: 24 }}>

        {/* Zona superior: flores decorativas */}
        <View style={{ width: "100%", alignItems: "center", paddingTop: 16 }}>
          {/* Flores pequeñas en esquinas superiores */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: -24 }}>
            <View style={{ opacity: 0.7 }}>
              <DecoFlower
                size={72}
                petalColor={theme.colors.teal}
                accentColor={theme.colors.primaryLight}
                centerColor={theme.colors.peach}
              />
            </View>
            <View style={{ opacity: 0.7 }}>
              <DecoFlower
                size={72}
                petalColor={theme.colors.primaryLight}
                accentColor={theme.colors.teal}
                centerColor={theme.colors.peach}
              />
            </View>
          </View>

          {/* Flor central grande */}
          <DecoFlower
            size={180}
            petalColor={theme.colors.primary}
            accentColor={theme.colors.teal}
            centerColor={theme.colors.peach}
          />
        </View>

        {/* Zona central: ícono + textos */}
        <View style={{ alignItems: "center", gap: 16, flex: 1, justifyContent: "center" }}>
          {/* Ícono de cámara en círculo */}
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: theme.colors.primaryLight,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 3,
              borderColor: theme.colors.primary,
            }}
          >
            <Ionicons
              name={permanentlyDenied ? "camera-off-outline" : "camera-outline"}
              size={40}
              color={theme.colors.primary}
            />
          </View>

          <Text
            style={{
              fontFamily: theme.typography.families.bold,
              fontSize: theme.typography.sizes.xl,
              color: theme.colors.textPrimary,
              textAlign: "center",
            }}
          >
            {permanentlyDenied ? "Permiso bloqueado" : "Activa tu cámara"}
          </Text>

          <Text
            style={{
              fontFamily: theme.typography.families.regular,
              fontSize: theme.typography.sizes.md,
              color: theme.colors.textSecondary,
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            {permanentlyDenied
              ? "El acceso a la cámara fue denegado. Ve a Configuración para activarlo manualmente."
              : "Para escanear e identificar tus plantas, necesitamos acceso a la cámara y a tu galería de fotos."}
          </Text>
        </View>

        {/* Zona inferior: botón + flores pequeñas */}
        <View style={{ width: "100%", alignItems: "center", gap: 16 }}>
          <TouchableOpacity
            onPress={permanentlyDenied ? onOpenSettings : onAllow}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              backgroundColor: theme.colors.primary,
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: theme.radius.full,
              width: "100%",
            }}
          >
            <Feather
              name={permanentlyDenied ? "settings" : "camera"}
              size={18}
              color="#fff"
            />
            <Text
              style={{
                fontFamily: theme.typography.families.medium,
                fontSize: theme.typography.sizes.md,
                color: "#fff",
              }}
            >
              {permanentlyDenied ? "Abrir Configuración" : "Permitir acceso"}
            </Text>
          </TouchableOpacity>

          {/* Flores pequeñas inferiores */}
          <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", opacity: 0.5 }}>
            <DecoFlower
              size={52}
              petalColor={theme.colors.peach}
              accentColor={theme.colors.teal}
              centerColor={theme.colors.primary}
            />
            <DecoFlower
              size={40}
              petalColor={theme.colors.teal}
              accentColor={theme.colors.primaryLight}
              centerColor={theme.colors.peach}
            />
            <DecoFlower
              size={52}
              petalColor={theme.colors.primaryLight}
              accentColor={theme.colors.primary}
              centerColor={theme.colors.peach}
            />
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}
