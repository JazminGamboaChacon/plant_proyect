import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import InputText from "../../componets/ui/InputText";
import {
  userUpdateSchema,
  type UserUpdateFormData,
} from "../../validation/schemas";
import {
  fetchUserProfile,
  fetchPlantTypes,
  updateUser,
  type ApiPlantType,
} from "../../services/api";
import { createStyles } from "./EditUserProfile.styles";

const USER_ID = "user-1";

type PlantIconProps = {
  lib: string;
  icon: string;
  color: string;
};

function PlantIcon({ lib, icon, color }: PlantIconProps) {
  if (lib === "ionicons") {
    return <Ionicons name={icon as any} size={28} color={color} />;
  }
  return <MaterialCommunityIcons name={icon as any} size={28} color={color} />;
}

export default function EditUserProfile() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [plantTypes, setPlantTypes] = useState<ApiPlantType[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserUpdateFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      fullName: "",
      username: "",
      birthday: "",
      isPublicProfile: true,
      favoritePlantTypes: [],
    },
  });

  const selectedPlants = watch("favoritePlantTypes");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [profileRes, typesRes] = await Promise.all([
          fetchUserProfile(USER_ID),
          fetchPlantTypes(),
        ]);

        if (cancelled) return;

        const user = profileRes.user;
        setAvatarUrl(user.photoURL);
        setPlantTypes(typesRes);

        reset({
          fullName: user.fullName,
          username: user.username,
          birthday: user.birthday,
          isPublicProfile: user.isPublicProfile,
          favoritePlantTypes: user.favoritePlantTypes,
        });
      } catch (err) {
        if (!cancelled) {
          showToast("Error al cargar datos del perfil", "error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [reset, showToast]);

  const togglePlantType = (id: string) => {
    const current = selectedPlants || [];
    const next = current.includes(id)
      ? current.filter((p) => p !== id)
      : [...current, id];
    setValue("favoritePlantTypes", next, { shouldValidate: true });
  };

  const onSubmit = async (data: UserUpdateFormData) => {
    setSaving(true);
    try {
      await updateUser(USER_ID, {
        fullName: data.fullName,
        username: data.username,
        birthday: data.birthday,
        isPublicProfile: data.isPublicProfile,
        favoritePlantTypes: data.favoritePlantTypes,
      });
      showToast("Perfil actualizado correctamente", "success");
      router.back();
    } catch (err: any) {
      showToast(err.message || "Error al actualizar el perfil", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Feather
                name="chevron-left"
                size={20}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Editar Perfil</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Avatar */}
            <View style={styles.avatarSection}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons
                    name="person"
                    size={36}
                    color={theme.colors.primary}
                  />
                </View>
              )}
            </View>

            {/* Full Name */}
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputText
                  label="Nombre completo"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.fullName?.message}
                  placeholder="Tu nombre completo"
                  leftIcon="user"
                  autoCapitalize="words"
                />
              )}
            />

            {/* Username */}
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputText
                  label="Usuario"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.username?.message}
                  placeholder="tu_usuario"
                  leftIcon="at-sign"
                  autoCapitalize="none"
                />
              )}
            />

            {/* Birthday */}
            <Controller
              control={control}
              name="birthday"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputText
                  label="Fecha de nacimiento"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.birthday?.message}
                  placeholder="AAAA-MM-DD"
                  leftIcon="calendar"
                  keyboardType="numeric"
                />
              )}
            />

            <View style={styles.divider} />

            {/* Plant Types */}
            <View style={{ gap: theme.spacing.sm }}>
              <Text style={styles.sectionLabel}>
                Tipos de planta favoritos
              </Text>
              <View style={styles.plantGrid}>
                {plantTypes.map((plant) => {
                  const isSelected = selectedPlants?.includes(plant.id);
                  const iconColor = isSelected
                    ? theme.colors.primary
                    : theme.colors.textSecondary;
                  return (
                    <TouchableOpacity
                      key={plant.id}
                      style={[
                        styles.plantCard,
                        isSelected && styles.plantCardSelected,
                      ]}
                      onPress={() => togglePlantType(plant.id)}
                    >
                      <PlantIcon
                        lib={plant.lib}
                        icon={plant.icon}
                        color={iconColor}
                      />
                      <Text
                        style={[
                          styles.plantLabel,
                          isSelected && styles.plantLabelSelected,
                        ]}
                      >
                        {plant.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.favoritePlantTypes?.message && (
                <Text style={styles.errorText}>
                  {errors.favoritePlantTypes.message}
                </Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Public Profile */}
            <Controller
              control={control}
              name="isPublicProfile"
              render={({ field: { onChange, value } }) => (
                <View style={styles.toggleRow}>
                  <View style={styles.toggleLeft}>
                    <Ionicons
                      name="globe-outline"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <View>
                      <Text style={styles.toggleTitle}>Perfil público</Text>
                      <Text style={styles.toggleSubtitle}>
                        Cualquiera puede ver tu jardín
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{
                      false: theme.colors.border,
                      true: theme.colors.primary,
                    }}
                    thumbColor="#F6F9F6"
                  />
                </View>
              )}
            />

            {/* Buttons */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
              >
                <Feather
                  name="x"
                  size={16}
                  color={theme.colors.textPrimary}
                />
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  saving && styles.saveButtonDisabled,
                ]}
                onPress={handleSubmit(onSubmit)}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#F6F9F6" />
                ) : (
                  <Text style={styles.saveText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
