import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { useToast } from '../../src/context/ToastContext';
import { usePlantStorage } from '../../src/hooks/usePlantStorage';
import { getLunarPhase } from '../../src/utils/lunarPhase';
import {
  getPendingCareTypes,
  recordCare,
  getCareHistory,
} from '../../src/services/careService';
import { requestNotificationPermissions } from '../../src/services/notificationService';
import { checkAndUnlock } from '../../src/services/achievementService';
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

const CARE_DOT_COLOR: Record<CareType, string> = {
  riego: '#3B9BDB',
  abono: '#FF9800',
  poda:  '#8B6914',
};

type DayCareEntry = { plant: LocalPlant; careType: CareType };

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
  const { showToast } = useToast();
  const { plants, isLoading, refresh } = usePlantStorage(user?.id ?? '');

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [history, setHistory] = useState<CareHistoryEntry[]>([]);
  const [markingPlant, setMarkingPlant] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

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
    const unlocked = await checkAndUnlock(user.id).catch(() => []);
    for (const label of unlocked) showToast(`🏆 ${label}`, 'success');
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

  // Próximos cuidados por día del mes visible (con referencia a la planta)
  const nextCareDays = new Map<number, DayCareEntry[]>();
  for (const plant of plants) {
    const care = plant.care;
    const items: Array<{ lastDate: string | null; freqDays: number; type: CareType }> = [
      { lastDate: care?.lastWatered    ?? null, freqDays: care?.waterFreqDays    ?? 3,  type: 'riego' },
      { lastDate: care?.lastFertilized ?? null, freqDays: care?.fertilizeFreqDays ?? 30, type: 'abono' },
      { lastDate: care?.lastPruned     ?? null, freqDays: care?.pruneFreqDays    ?? 60, type: 'poda'  },
    ];
    for (const { lastDate, freqDays, type } of items) {
      const nextDate = lastDate
        ? new Date(new Date(lastDate).getTime() + freqDays * 86_400_000)
        : new Date(today);
      if (nextDate.getFullYear() === viewYear && nextDate.getMonth() === viewMonth) {
        const day = nextDate.getDate();
        const arr = nextCareDays.get(day) ?? [];
        arr.push({ plant, careType: type });
        nextCareDays.set(day, arr);
      }
    }
  }

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
                const isToday =
                  day === today.getDate() &&
                  viewMonth === today.getMonth() &&
                  viewYear === today.getFullYear();
                const hasCare = doneDays.has(day);
                const upcomingEntries = nextCareDays.get(day);
                const upcomingTypes = upcomingEntries
                  ? new Set(upcomingEntries.map((e) => e.careType))
                  : undefined;
                return (
                  <TouchableOpacity
                    key={ci}
                    style={s.dayCell}
                    onPress={() => setSelectedDay(day)}
                    activeOpacity={0.7}
                  >
                    <View style={[s.dayBg, isToday && { backgroundColor: theme.colors.primary }]}>
                      <Text style={[s.dayNum, isToday && { color: '#fff' }]}>{day}</Text>
                    </View>
                    {/* Puntos de próximos cuidados */}
                    {upcomingTypes && (
                      <View style={s.upcomingRow}>
                        {upcomingTypes.has('riego') && <View style={[s.upcomingDot, { backgroundColor: '#3B9BDB' }]} />}
                        {upcomingTypes.has('abono') && <View style={[s.upcomingDot, { backgroundColor: '#FF9800' }]} />}
                        {upcomingTypes.has('poda')  && <View style={[s.upcomingDot, { backgroundColor: '#8B6914' }]} />}
                      </View>
                    )}
                    {/* Punto de cuidado ya registrado */}
                    {hasCare && !upcomingTypes && <View style={s.careDot} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          <View style={s.legend}>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: '#3B9BDB' }]} />
              <Text style={s.legendText}>Riego</Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: '#FF9800' }]} />
              <Text style={s.legendText}>Abono</Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: '#8B6914' }]} />
              <Text style={s.legendText}>Poda</Text>
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
          history.slice(0, 5).map((entry) => (
              <View key={entry.id} style={s.historyRow}>
                <View style={[s.historyDot, { backgroundColor: CARE_DOT_COLOR[entry.careType] }]} />
                <View style={s.historyInfo}>
                  <Text style={s.historyName} numberOfLines={1}>{entry.plantName}</Text>
                  <Text style={s.historyMeta}>
                    {CARE_LABEL[entry.careType]} · {formatDate(entry.doneAt)}
                  </Text>
                </View>
                <Text style={s.historyPhase}>{entry.lunarPhase}</Text>
              </View>
          ))
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Modal de detalle del día */}
      <Modal
        visible={selectedDay !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedDay(null)}
      >
        <TouchableOpacity
          style={s.modalBackdrop}
          activeOpacity={1}
          onPress={() => setSelectedDay(null)}
        >
          <View style={s.modalSheet} onStartShouldSetResponder={() => true}>
            <Text style={s.modalTitle}>
              {selectedDay} de {MONTH_NAMES[viewMonth]}
            </Text>
            {(() => {
              const entries = selectedDay !== null ? (nextCareDays.get(selectedDay) ?? []) : [];
              if (entries.length === 0) {
                return (
                  <Text style={s.modalEmpty}>No hay cuidados programados para este dia</Text>
                );
              }
              return entries.map((entry, idx) => (
                <View key={idx} style={s.modalRow}>
                  <Image source={{ uri: entry.plant.localPhotoUri }} style={s.modalPhoto} />
                  <View style={s.modalInfo}>
                    <Text style={s.modalPlantName} numberOfLines={1}>{entry.plant.commonName}</Text>
                    <View style={[s.pill, { backgroundColor: theme.colors.primaryPale, alignSelf: 'flex-start' }]}>
                      <Text style={[s.pillText, { color: theme.colors.primary }]}>
                        {CARE_LABEL[entry.careType]}
                      </Text>
                    </View>
                  </View>
                  <View style={[s.modalTypeDot, { backgroundColor: CARE_DOT_COLOR[entry.careType] }]} />
                </View>
              ));
            })()}
            <TouchableOpacity style={s.modalCloseBtn} onPress={() => setSelectedDay(null)}>
              <Text style={s.modalCloseTxt}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    careDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#2D7A4F',
      marginTop: 1,
    },
    upcomingRow: {
      flexDirection: 'row',
      gap: 2,
      marginTop: 1,
    },
    upcomingDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
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

    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'flex-end',
    },
    modalSheet: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
      padding: 20,
      maxHeight: '70%',
    },
    modalTitle: {
      fontFamily: theme.typography.families.bold,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textPrimary,
      marginBottom: 16,
    },
    modalEmpty: {
      fontFamily: theme.typography.families.regular,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      paddingVertical: 24,
    },
    modalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12,
    },
    modalPhoto: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.border,
    },
    modalInfo: { flex: 1, gap: 4 },
    modalPlantName: {
      fontFamily: theme.typography.families.medium,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textPrimary,
    },
    modalTypeDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    modalCloseBtn: {
      marginTop: 16,
      alignSelf: 'center',
      paddingHorizontal: 24,
      paddingVertical: 10,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.full,
    },
    modalCloseTxt: {
      color: '#fff',
      fontFamily: theme.typography.families.medium,
      fontSize: theme.typography.sizes.sm,
    },
  });
}
