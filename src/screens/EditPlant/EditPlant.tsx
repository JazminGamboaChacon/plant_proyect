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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import InputText from "../../componets/ui/InputText";
import {
  plantUpdateSchema,
  type PlantUpdateFormData,
} from "../../validation/schemas";
import {
  fetchPlantDetail,
  fetchPlantTypes,
  updatePlant,
  type ApiPlantType,
} from "../../services/api";
import { createStyles } from "./EditPlant.styles";

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

export default function EditPlant() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { showToast } = useToast();
  const { plantId } = useLocalSearchParams<{ plantId: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [plantTypes, setPlantTypes] = useState<ApiPlantType[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlantUpdateFormData>({
    resolver: zodResolver(plantUpdateSchema),
    defaultValues: {
      commonName: "",
      scientificName: "",
      type: "",
      notes: "",
      isFavorite: false,
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      if (!plantId) {
        showToast("ID de planta no proporcionado", "error");
        router.back();
        return;
      }

      try {
        const [plant, types] = await Promise.all([
          fetchPlantDetail(plantId),
          fetchPlantTypes(),
        ]);

        if (cancelled) return;

        setPhotoURL(plant.photoURL);
        setPlantTypes(types);

        reset({
          commonName: plant.commonName,
          scientificName: plant.scientificName,
          type: plant.type,
          notes: plant.notes || "",
          isFavorite: plant.isFavorite,
        });
      } catch (err) {
        if (!cancelled) {
          showToast("Error al cargar datos de la planta", "error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [plantId, reset, showToast, router]);

  const onSubmit = async (data: PlantUpdateFormData) => {
    if (!plantId) return;
    setSaving(true);
    try {
      await updatePlant(plantId, {
        commonName: data.commonName,
        scientificName: data.scientificName,
        type: data.type,
        notes: data.notes || "",
        isFavorite: data.isFavorite,
      });
      showToast("Planta actualizada correctamente", "success");
      router.back();
    } catch (err: any) {
      showToast(err.message || "Error al actualizar la planta", "error");
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
            <Text style={styles.headerTitle}>Editar Planta</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Plant Image */}
            <View style={styles.plantImageSection}>
              {photoURL ? (
                <Image source={{ uri: photoURL }} style={styles.plantImage} />
              ) : (
                <View style={styles.plantImagePlaceholder}>
                  <MaterialCommunityIcons
                    name="flower"
                    size={40}
                    color={theme.colors.primary}
                  />
                </View>
              )}
            </View>

            {/* Common Name */}
            <Controller
              control={control}
              name="commonName"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputText
                  label="Nombre común"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.commonName?.message}
                  placeholder="Ej. Rosa, Cactus"
                  leftIcon="tag"
                  autoCapitalize="words"
                />
              )}
            />

            {/* Scientific Name */}
            <Controller
              control={control}
              name="scientificName"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputText
                  label="Nombre científico"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.scientificName?.message}
                  placeholder="Ej. Rosa gallica"
                  leftIcon="book-open"
                  autoCapitalize="none"
                />
              )}
            />

            <View style={styles.divider} />

            {/* Plant Type */}
            <View style={{ gap: theme.spacing.sm }}>
              <Text style={styles.sectionLabel}>Tipo de planta</Text>
              <View style={styles.plantTypeGrid}>
                {plantTypes.map((pt) => {
                  const isSelected = selectedType === pt.id;
                  const iconColor = isSelected
                    ? theme.colors.primary
                    : theme.colors.textSecondary;
                  return (
                    <TouchableOpacity
                      key={pt.id}
                      style={[
                        styles.typeCard,
                        isSelected && styles.typeCardSelected,
                      ]}
                      onPress={() =>
                        setValue("type", pt.id, { shouldValidate: true })
                      }
                    >
                      <PlantIcon
                        lib={pt.lib}
                        icon={pt.icon}
                        color={iconColor}
                      />
                      <Text
                        style={[
                          styles.typeLabel,
                          isSelected && styles.typeLabelSelected,
                        ]}
                      >
                        {pt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.type?.message && (
                <Text style={styles.errorText}>{errors.type.message}</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Notes */}
            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputText
                  label="Notas"
                  value={value || ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.notes?.message}
                  placeholder="Notas sobre el cuidado de la planta..."
                  leftIcon="file-text"
                  multiline
                  numberOfLines={4}
                />
              )}
            />

            <View style={styles.divider} />

            {/* Favorite */}
            <Controller
              control={control}
              name="isFavorite"
              render={({ field: { onChange, value } }) => (
                <View style={styles.toggleRow}>
                  <View style={styles.toggleLeft}>
                    <Ionicons
                      name="heart"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <View>
                      <Text style={styles.toggleTitle}>Planta favorita</Text>
                      <Text style={styles.toggleSubtitle}>
                        Marcar como tu planta favorita
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
