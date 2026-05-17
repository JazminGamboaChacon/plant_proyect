import { Feather } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const PHOTO_HEIGHT = Dimensions.get('window').height * 0.4;
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { PlantIdentificationResult } from '../services/plantIdService';

interface PlantIdentificationModalProps {
  visible: boolean;
  photoUri: string | null;
  photoBase64?: string;
  result: PlantIdentificationResult | null;
  isLoading: boolean;
  error: string | null;
  onSave: (result: PlantIdentificationResult) => void;
  onRetake: () => void;
}

function ConfidenceBadge({ value }: { value: number }) {
  const bg = value >= 75 ? '#2E7D32' : value >= 50 ? '#F9A825' : '#E65100';
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: '#fff' }]}>{value}% confianza</Text>
    </View>
  );
}

function ToxicityBadge({ value }: { value: string }) {
  if (!value || value === 'No disponible') return null;
  const lower = value.toLowerCase();
  const isToxic = !lower.includes('non-toxic') && !lower.includes('no tóxic') && !lower.includes('not toxic') && (lower.includes('toxic') || lower.includes('tóxic') || lower.includes('poison'));
  const bg = isToxic ? '#C62828' : '#2E7D32';
  const label = isToxic ? 'Tóxica' : 'No tóxica';
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: '#fff' }]}>{label}</Text>
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
  photoBase64,
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

        {/* Foto siempre visible arriba */}
        {photoUri || photoBase64 ? (
          <Image
            source={{
              uri: photoBase64
                ? `data:image/jpeg;base64,${photoBase64}`
                : photoUri!,
            }}
            style={styles.photo}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.photo, { backgroundColor: t.border }]} />
        )}

        {/* Contenido dinámico abajo */}
        {isLoading && (
          <View style={[styles.bottom, { backgroundColor: t.background }]}>
            <ActivityIndicator size="large" color={t.primary} />
            <Text style={[styles.loadingText, { color: t.textSecondary }]}>
              Identificando planta…
            </Text>
          </View>
        )}

        {!isLoading && error && (
          <View style={[styles.bottom, { backgroundColor: t.background }]}>
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

        {!isLoading && !error && result && !result.isPlant && (
          <View style={[styles.bottom, { backgroundColor: t.background }]}>
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

        {!isLoading && !error && result && result.isPlant && (
          <ScrollView
            style={styles.resultSheet}
            contentContainerStyle={[styles.resultContent, { backgroundColor: t.surface }]}
          >
            <Text style={[styles.commonName, { color: t.textPrimary }]}>
              {result.commonName}
            </Text>
            <Text style={[styles.scientificName, { color: t.textSecondary }]}>
              {result.scientificName}
            </Text>
            {result.family !== 'No disponible' && (
              <Text style={[styles.familyText, { color: t.textSecondary }]}>
                Familia: {result.family}
              </Text>
            )}

            <View style={styles.badgeRow}>
              <ConfidenceBadge value={result.confidence} />
              <ToxicityBadge value={result.toxicity} />
            </View>

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

            {result.description !== 'No disponible' && (
              <View style={[styles.descriptionBox, { backgroundColor: t.background }]}>
                <Text style={[styles.descriptionLabel, { color: t.textSecondary }]}>
                  Descripción
                </Text>
                <Text style={[styles.descriptionText, { color: t.textPrimary }]}>
                  {result.description}
                </Text>
              </View>
            )}

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
                <Text style={styles.btnText}>Agregar a colección</Text>
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
    height: PHOTO_HEIGHT,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  bottom: {
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
  familyText: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: -4,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  careRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  descriptionBox: {
    borderRadius: 10,
    padding: 12,
    gap: 4,
    marginTop: 4,
  },
  descriptionLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
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
