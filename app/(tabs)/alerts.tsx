import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import SunCalc from 'suncalc';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { usePlantStorage } from '../../src/hooks/usePlantStorage';
import { getLunarPhase } from '../../src/utils/lunarPhase';
import {
  getPendingCareTypes,
  recordCare,
  getCareHistory,
} from '../../src/services/careService';
import { requestNotificationPermissions } from '../../src/services/notificationService';
import Header from '../../src/componets/common/Header';
import { CareHistoryEntry, CareType, LocalPlant } from '../../src/types-dtos/plant.types';

const MONTH_NAMES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];
const DAY_HEADERS = ['L','M','X','J','V','S','D'];

const CARE_LABEL: Record<CareType, string> = {
  riego: 'Riego',
  abono: 'Abono',
  poda:  'Poda',
};

function moonDotColor(date: Date): string {
  const { phase } = SunCalc.getMoonIllumination(date);
  if (phase < 0.063 || phase > 0.937) return '#888';
  if (phase < 0.437) return '#A0C4FF';
  if (phase < 0.563) return '#FFD700';
  return '#C0A0FF';
}

function isFavorable(careType: CareType, phaseName: string): boolean {
  const rules: Record<CareType, string[]> = {
    riego: ['Llena', 'Creciente'],
    abono: ['Menguante'],
    poda:  ['Menguante'],
  };
  return rules[careType].some((w) => phaseName.includes(w));
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

export default function AlertsScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { plants, isLoading, refresh } = usePlantStorage(user?.id ?? '');

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [history, setHistory] = useState<CareHistoryEntry[]>([]);
  const [markingPlant, setMarkingPlant] = useState<string | null>(null);

  const phase = getLunarPhase(today);

  const loadHistory = useCallback(async () => {
    if (!user?.id) return;
    const h = await getCareHistory(user.id);
    setHistory(h);
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      refresh();
      loadHistory();
      requestNotificationPermissions().catch(() => {});
    }, [refresh, loadHistory]),
  );

  const pendingPlants = plants.filter(
    (p) => getPendingCareTypes(p).length > 0,
  );

  const handleDone = async (plant: LocalPlant, careType: CareType) => {
    if (!user?.id) return;
    setMarkingPlant(plant.localId + careType);
    await recordCare(plant, careType, 'manual', user.id);
    await refresh();
    await loadHistory();
    setMarkingPlant(null);
  };

  // Calendar grid
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const rawFirstDay = new Date(viewYear, viewMonth, 1).getDay();
  const offset = (rawFirstDay + 6) % 7; // Monday-based offset

  const doneDays = new Set(
    history
      .filter((e) => {
        const d = new Date(e.doneAt);
        return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
      })
      .map((e) => new Date(e.doneAt).getDate()),
  );

  const cells: Array<number | null> = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: Array<Array<number | null>> = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const s = styles(theme);

  return (
    <SafeAreaView style={s.safe}>
      <Header />
      <ScrollView contentContainerStyle={s.scroll}>

        {/* A — Lunar Header */}
        <View style={s.lunarCard}>
          <View style={s.lunarRow}>
            <Feather name="moon" size={32} color="#C0B0EE" />
            <View style={s.lunarText}>
              <Text style={s.phaseName}>{phase.name}</Text>
              <Text style={s.phaseRec}>{phase.recommendation}</Text>
            </View>
          </View>
        </View>

        {/* B — Month Calendar */}
        <View style={s.card}>
          <View style={s.calHeader}>
            <TouchableOpacity
              onPress={() => {
                if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
                else setViewMonth(m => m - 1);
              }}
              style={s.navBtn}
            >
              <Feather name="chevron-left" size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <Text style={s.calTitle}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
                else setViewMonth(m => m + 1);
              }}
              style={s.navBtn}
            >
              <Feather name="chevron-right" size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={s.dayHeaderRow}>
            {DAY_HEADERS.map((d) => (
              <Text key={d} style={s.dayHeaderText}>{d}</Text>
            ))}
          </View>

          {rows.map((row, ri) => (
            <View key={ri} style={s.dayRow}>
              {row.map((day, ci) => {
                if (!day) return <View key={ci} style={s.dayCell} />;
                const cellDate = new Date(viewYear, viewMonth, day);
                const dotColor = moonDotColor(cellDate);
                const isToday =
                  day === today.getDate() &&
                  viewMonth === today.getMonth() &&
                  viewYear === today.getFullYear();
                const hasCare = doneDays.has(day);
                return (
                  <View key={ci} style={s.dayCell}>
                    <View style={[s.dayBg, isToday && { backgroundColor: theme.colors.primary }]}>
                      <Text style={[s.dayNum, isToday && { color: '#fff' }]}>{day}</Text>
                    </View>
                    <View style={[s.moonDot, { backgroundColor: dotColor }]} />
                    {hasCare && <View style={s.careDot} />}
                  </View>
                );
              })}
            </View>
          ))}

          <View style={s.legend}>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: '#888' }]} />
              <Text style={s.legendText}>Nueva</Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: '#A0C4FF' }]} />
              <Text style={s.legendText}>Creciente</Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: '#FFD700' }]} />
              <Text style={s.legendText}>Llena</Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: '#C0A0FF' }]} />
              <Text style={s.legendText}>Menguante</Text>
            </View>
          </View>
        </View>

        {/* C — Pending care */}
        <Text style={s.sectionTitle}>Cuidados pendientes hoy</Text>
        {isLoading ? (
          <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 16 }} />
        ) : pendingPlants.length === 0 ? (
          <View style={s.emptyCard}>
            <Feather name="check-circle" size={24} color={theme.colors.success} />
            <Text style={s.emptyText}>Todas las plantas estan al dia</Text>
          </View>
        ) : (
          pendingPlants.map((plant) => {
            const types = getPendingCareTypes(plant);
            return (
              <View key={plant.localId} style={s.plantCard}>
                <Image
                  source={{ uri: plant.localPhotoUri }}
                  style={s.plantPhoto}
                />
                <View style={s.plantInfo}>
                  <Text style={s.plantName} numberOfLines={1}>{plant.commonName}</Text>
                  {types.map((ct) => {
                    const favorable = isFavorable(ct, phase.name);
                    const isMarking = markingPlant === plant.localId + ct;
                    return (
                      <View key={ct} style={s.careRow}>
                        <View style={s.pillRow}>
                          <View style={[s.pill, { backgroundColor: theme.colors.primaryPale }]}>
                            <Text style={[s.pillText, { color: theme.colors.primary }]}>
                              {CARE_LABEL[ct]}
                            </Text>
                          </View>
                          {favorable && (
                            <View style={[s.pill, { backgroundColor: '#FFF3E0' }]}>
                              <Text style={[s.pillText, { color: '#E65100' }]}>Favorable</Text>
                            </View>
                          )}
                        </View>
                        <TouchableOpacity
                          style={[s.doneBtn, isMarking && { opacity: 0.5 }]}
                          onPress={() => handleDone(plant, ct)}
                          disabled={!!isMarking}
                        >
                          {isMarking
                            ? <ActivityIndicator size="small" color="#fff" />
                            : <Text style={s.doneBtnText}>Hecho</Text>
                          }
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}

        {/* D — Care history */}
        <Text style={s.sectionTitle}>Historial reciente</Text>
        {history.length === 0 ? (
          <View style={s.emptyCard}>
            <Text style={s.emptyText}>Sin registros aun</Text>
          </View>
        ) : (
          history.slice(0, 5).map((entry) => {
            const dotColor = moonDotColor(new Date(entry.doneAt));
            return (
              <View key={entry.id} style={s.historyRow}>
                <View style={[s.historyDot, { backgroundColor: dotColor }]} />
                <View style={s.historyInfo}>
                  <Text style={s.historyName} numberOfLines={1}>{entry.plantName}</Text>
                  <Text style={s.historyMeta}>
                    {CARE_LABEL[entry.careType]} · {formatDate(entry.doneAt)}
                  </Text>
                </View>
                <Text style={s.historyPhase}>{entry.lunarPhase}</Text>
              </View>
            );
          })
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function styles(theme: ReturnType<typeof import('../../src/context/ThemeContext').useTheme>['theme']) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.colors.background },
    scroll: { padding: 16 },

    lunarCard: {
      backgroundColor: '#1A1040',
      borderRadius: theme.radius.lg,
      padding: 20,
      marginBottom: 16,
    },
    lunarRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    lunarText: { flex: 1 },
    phaseName: {
      color: '#fff',
      fontFamily: theme.typography.families.bold,
      fontSize: theme.typography.sizes.lg,
      marginBottom: 4,
    },
    phaseRec: {
      color: '#C0B0EE',
      fontFamily: theme.typography.families.regular,
      fontSize: theme.typography.sizes.sm,
    },

    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    calHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    navBtn: { padding: 4 },
    calTitle: {
      fontFamily: theme.typography.families.bold,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textPrimary,
    },
    dayHeaderRow: { flexDirection: 'row', marginBottom: 4 },
    dayHeaderText: {
      flex: 1,
      textAlign: 'center',
      fontFamily: theme.typography.families.medium,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
    },
    dayRow: { flexDirection: 'row', marginBottom: 2 },
    dayCell: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 2,
    },
    dayBg: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayNum: {
      fontFamily: theme.typography.families.regular,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textPrimary,
    },
    moonDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      marginTop: 2,
    },
    careDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#2D7A4F',
      marginTop: 1,
    },
    legend: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 12,
      justifyContent: 'center',
    },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendText: {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
      fontFamily: theme.typography.families.regular,
    },

    sectionTitle: {
      fontFamily: theme.typography.families.bold,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textPrimary,
      marginBottom: 10,
      marginTop: 4,
    },

    emptyCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: 20,
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    emptyText: {
      fontFamily: theme.typography.families.regular,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
    },

    plantCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: 12,
      marginBottom: 10,
      flexDirection: 'row',
      gap: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    plantPhoto: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.border,
    },
    plantInfo: { flex: 1 },
    plantName: {
      fontFamily: theme.typography.families.bold,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textPrimary,
      marginBottom: 6,
    },
    careRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    pillRow: { flexDirection: 'row', gap: 4, flexWrap: 'wrap', flex: 1 },
    pill: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: theme.radius.full,
    },
    pillText: {
      fontFamily: theme.typography.families.medium,
      fontSize: theme.typography.sizes.xs,
    },
    doneBtn: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: theme.radius.full,
      minWidth: 58,
      alignItems: 'center',
    },
    doneBtnText: {
      color: '#fff',
      fontFamily: theme.typography.families.medium,
      fontSize: theme.typography.sizes.xs,
    },

    historyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    historyDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    historyInfo: { flex: 1 },
    historyName: {
      fontFamily: theme.typography.families.medium,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textPrimary,
    },
    historyMeta: {
      fontFamily: theme.typography.families.regular,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
    },
    historyPhase: {
      fontFamily: theme.typography.families.regular,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
    },
  });
}
