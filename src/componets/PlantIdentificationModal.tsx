import { Feather } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { PlantIdentificationResult } from '../services/geminiService';

interface PlantIdentificationModalProps {
  visible: boolean;
  photoUri: string | null;
  result: PlantIdentificationResult | null;
  isLoading: boolean;
  error: string | null;
  onSave: (result: PlantIdentificationResult) => void;
  onRetake: () => void;
}

function ConfidenceBadge({ value, textColor }: { value: number; textColor: string }) {
  const bg = value >= 75 ? '#2E7D32' : value >= 50 ? '#F9A825' : '#E65100';
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: '#fff' }]}>{value}% confianza</Text>
    </View>
  );
}

function CareCard({
  icon,
  label,
  value,
  borderColor,
  textColor,
  secondaryColor,
}: {
  icon: string;
  label: string;
  value: string;
  borderColor: string;
  textColor: string;
  secondaryColor: string;
}) {
  return (
    <View style={[styles.careCard, { borderColor }]}>
      <Feather name={icon as any} size={18} color={secondaryColor} />
      <Text style={[styles.careLabel, { color: secondaryColor }]}>{label}</Text>
      <Text style={[styles.careValue, { color: textColor }]}>{value}</Text>
    </View>
  );
}

export default function PlantIdentificationModal({
  visible,
  photoUri,
  result,
  isLoading,
  error,
  onSave,
  onRetake,
}: PlantIdentificationModalProps) {
  const { theme } = useTheme();
  const t = theme.colors;

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
        {/* Photo preview */}
        {photoUri && (
          <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
        )}

        {/* Loading */}
        {isLoading && (
          <View style={[styles.overlay, { backgroundColor: t.background }]}>
            <ActivityIndicator size="large" color={t.primary} />
            <Text style={[styles.loadingText, { color: t.textSecondary }]}>
              Identificando planta…
            </Text>
          </View>
        )}

        {/* Error */}
        {!isLoading && error && (
          <View style={[styles.overlay, { backgroundColor: t.background }]}>
            <Feather name="alert-circle" size={48} color={t.error} />
            <Text style={[styles.errorText, { color: t.error }]}>{error}</Text>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: t.primary }]}
              onPress={onRetake}
            >
              <Text style={styles.btnText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Not a plant */}
        {!isLoading && !error && result && !result.isPlant && (
          <View style={[styles.overlay, { backgroundColor: t.background }]}>
            <Feather name="x-circle" size={48} color={t.textSecondary} />
            <Text style={[styles.errorText, { color: t.textPrimary }]}>
              No se detectó una planta en la imagen.
            </Text>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: t.primary }]}
              onPress={onRetake}
            >
              <Text style={styles.btnText}>Tomar otra foto</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Success */}
        {!isLoading && !error && result && result.isPlant && (
          <ScrollView
            style={styles.resultSheet}
            contentContainerStyle={[
              styles.resultContent,
              { backgroundColor: t.surface },
            ]}
          >
            <Text style={[styles.commonName, { color: t.textPrimary }]}>
              {result.commonName}
            </Text>
            <Text style={[styles.scientificName, { color: t.textSecondary }]}>
              {result.scientificName}
            </Text>
            <ConfidenceBadge value={result.confidence} textColor={t.textPrimary} />

            <View style={styles.careRow}>
              <CareCard
                icon="droplet"
                label="Riego"
                value={result.watering}
                borderColor={t.border}
                textColor={t.textPrimary}
                secondaryColor={t.textSecondary}
              />
              <CareCard
                icon="sun"
                label="Luz"
                value={result.sunlight}
                borderColor={t.border}
                textColor={t.textPrimary}
                secondaryColor={t.textSecondary}
              />
              <CareCard
                icon="layers"
                label="Sustrato"
                value={result.soil}
                borderColor={t.border}
                textColor={t.textPrimary}
                secondaryColor={t.textSecondary}
              />
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.btn, styles.btnSecondary, { borderColor: t.border }]}
                onPress={onRetake}
              >
                <Text style={[styles.btnText, { color: t.textPrimary }]}>Retomar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: t.primary }]}
                onPress={() => onSave(result)}
              >
                <Text style={styles.btnText}>Guardar Planta</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photo: {
    width: '100%',
    height: '45%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 8,
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
  },
  resultSheet: {
    flex: 1,
  },
  resultContent: {
    padding: 24,
    gap: 12,
    flexGrow: 1,
  },
  commonName: {
    fontSize: 24,
    fontWeight: '700',
  },
  scientificName: {
    fontSize: 15,
    fontStyle: 'italic',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  careRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  careCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  careLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  careValue: {
    fontSize: 12,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
