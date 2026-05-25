import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { summarizeSunlight, summarizeSoil, summarizeWatering } from '../../utils/plantTranslations';

interface Props {
  watering: string;
  sunlight: string;
  soil: string;
}

function CareCard({
  icon,
  label,
  summary,
  iconColor,
  onPress,
}: {
  icon: string;
  label: string;
  summary: string;
  iconColor: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={s.careCard} onPress={onPress} activeOpacity={0.75}>
      <Feather name={icon as any} size={18} color={iconColor} />
      <Text style={s.careLabel}>{label}</Text>
      <Text style={s.careValue}>{summary}</Text>
    </TouchableOpacity>
  );
}

export default function PlantCareCards({ watering, sunlight, soil }: Props) {
  const [detail, setDetail] = useState<{ label: string; fullText: string } | null>(null);

  return (
    <>
      <Modal visible={!!detail} transparent animationType="fade">
        <View style={s.detailOverlay}>
          <View style={s.detailSheet}>
            <Text style={s.detailLabel}>{detail?.label}</Text>
            <Text style={s.detailText}>{detail?.fullText}</Text>
            <TouchableOpacity style={s.detailCloseBtn} onPress={() => setDetail(null)}>
              <Text style={s.detailCloseTxt}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={s.careRow}>
        <CareCard
          icon="droplet"
          label="Riego"
          summary={summarizeWatering(watering)}
          iconColor="#3B9BDB"
          onPress={() => setDetail({ label: 'Riego', fullText: watering })}
        />
        <CareCard
          icon="sun"
          label="Luz"
          summary={summarizeSunlight(sunlight)}
          iconColor="#E0A020"
          onPress={() => setDetail({ label: 'Luz', fullText: sunlight })}
        />
        <CareCard
          icon="layers"
          label="Sustrato"
          summary={summarizeSoil(soil)}
          iconColor="#7A5C3A"
          onPress={() => setDetail({ label: 'Sustrato', fullText: soil })}
        />
      </View>
    </>
  );
}

const s = StyleSheet.create({
  careRow: { flexDirection: 'row', gap: 8 },
  careCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0ECE0',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#2D7A4F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  careLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#4A8A6A',
    letterSpacing: 0.5,
  },
  careValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A2A1A',
    textAlign: 'center',
  },
  detailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  detailSheet: {
    backgroundColor: '#FAF7F2',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D7A4F',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailText: {
    fontSize: 14,
    color: '#4A5A4E',
    lineHeight: 22,
  },
  detailCloseBtn: {
    backgroundColor: '#E8F5EE',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  detailCloseTxt: {
    color: '#2D7A4F',
    fontWeight: '600',
    fontSize: 14,
  },
});
