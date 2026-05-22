import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

function DecorativeLeaf() {
  return (
    <Svg width={90} height={90} viewBox="0 0 100 100" style={{ position: "absolute", top: 0, left: 0, opacity: 0.2 }}>
      <Path
        d="M 10 90 Q 10 10 90 10 Q 50 50 10 90 Z"
        fill="#2D7A4F"
      />
      <Path
        d="M 10 90 Q 50 50 90 10"
        stroke="#2D7A4F"
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
}

type Props = {
  visible: boolean;
  onAllow: () => void;
  onDismiss: () => void;
};

export default function CameraPermissionModal({ visible, onAllow, onDismiss }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.55)",
        }}
      >
        <View
          style={{
            width: "85%",
            maxWidth: 320,
            backgroundColor: "#FAF7F2",
            borderRadius: 24,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 20,
          }}
        >
          {/* Hero superior con gradiente */}
          <LinearGradient
            colors={["#E8F5EE", "#D4EDD8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 28, paddingBottom: 20, alignItems: "center", gap: 12 }}
          >
            <DecorativeLeaf />

            {/* Ícono cámara en círculo blanco */}
            <View style={{ position: "relative" }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#2D7A4F",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 6,
                  elevation: 4,
                }}
              >
                <Ionicons name="camera-outline" size={32} color="#2D7A4F" />
              </View>
              {/* Badge hoja en esquina sup-der */}
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1.5,
                  borderColor: "#D4EDD8",
                }}
              >
                <Ionicons name="leaf" size={12} color="#2D7A4F" />
              </View>
            </View>

            <Text
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: "#1A3A2A",
                textAlign: "center",
                letterSpacing: 0.2,
              }}
            >
              Permiso de cámara
            </Text>
          </LinearGradient>

          {/* Zona de textos */}
          <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, gap: 6 }}>
            <Text
              style={{
                fontSize: 13.5,
                color: "#4A5A4E",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Para identificar y fotografiar tus plantas necesitamos acceso a tu cámara.
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#7A927E",
                textAlign: "center",
                lineHeight: 18,
                marginTop: 6,
              }}
            >
              Solo se usará cuando abras la función de escaneo. Nunca accederemos sin tu permiso.
            </Text>
          </View>

          {/* Botones */}
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingBottom: 20,
              paddingTop: 12,
              gap: 10,
            }}
          >
            {/* Ahora no */}
            <TouchableOpacity
              onPress={onDismiss}
              style={{
                flex: 1,
                paddingVertical: 12,
                backgroundColor: "#F0ECE4",
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.75}
            >
              <Text style={{ fontSize: 14, color: "#6A7A6E", fontWeight: "500" }}>
                Ahora no
              </Text>
            </TouchableOpacity>

            {/* Permitir acceso */}
            <TouchableOpacity
              onPress={onAllow}
              style={{
                flex: 1.6,
                borderRadius: 14,
                overflow: "hidden",
                shadowColor: "#2D7A4F",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.35,
                shadowRadius: 6,
                elevation: 6,
              }}
              activeOpacity={0.82}
            >
              <LinearGradient
                colors={["#2D7A4F", "#4CAF50"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  gap: 6,
                }}
              >
                <Ionicons name="camera" size={15} color="#fff" />
                <Text style={{ fontSize: 14, color: "#fff", fontWeight: "600" }}>
                  Permitir acceso
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
