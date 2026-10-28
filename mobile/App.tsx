import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { VenueZone } from './src/types';
import { createZone, deleteZone, getZones, replaceZone, updateZone } from './src/api';

const replacement = {
  name: 'Garden Stage',
  capacity: 2800,
  status: 'OPEN' as const
};

export default function App() {
  const [zones, setZones] = useState<VenueZone[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  async function loadZones() {
    setLoading(true);
    setError('');
    try {
      setZones(await getZones());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Error de red');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadZones();
  }, []);

  async function run(label: string, task: () => Promise<unknown>) {
    setBusy(true);
    setError('');
    setResult('');
    try {
      const value = await task();
      setResult(`${label}\n${JSON.stringify(value, null, 2)}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Error de red');
    } finally {
      setBusy(false);
    }
  }

  const actions: [string, () => Promise<unknown>][] = [
    ['POST · crear zona', () => createZone({
      name: 'River Entrance', capacity: 1200, status: 'OPEN'
    })],
    ['PUT · reemplazar ZONE-07', () => replaceZone('ZONE-07', replacement)],
    ['PATCH · cerrar ZONE-07', () => updateZone('ZONE-07', 'CLOSED')],
    ['DELETE · eliminar ZONE-18', () => deleteZone('ZONE-18')]
  ];

  const openCount = zones.filter(zone => zone.status === 'OPEN').length;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>FESTIVAL OPERATIONS / 01</Text>
            <Text style={styles.title}>Venue Control</Text>
            <Text style={styles.subtitle}>Estado operativo de las zonas del recinto</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricNumber}>{openCount}</Text>
            <Text style={styles.metricLabel}>ZONAS ABIERTAS</Text>
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Zonas</Text>
            <Text style={styles.muted}>Catálogo recibido desde la API</Text>
          </View>
          <Pressable disabled={loading || busy} style={styles.secondaryButton} onPress={() => void loadZones()}>
            <Text style={styles.secondaryButtonText}>{loading ? 'Cargando…' : '↻  Actualizar'}</Text>
          </Pressable>
        </View>

        {zones.map(zone => (
          <View key={zone.id} style={styles.zoneCard}>
            <View style={styles.cardTop}>
              <Text style={styles.zoneId}>{zone.id}</Text>
              <View style={[styles.badge, zone.status === 'OPEN' ? styles.badgeOpen : styles.badgeOther]}>
                <Text style={styles.badgeText}>{zone.status}</Text>
              </View>
            </View>
            <Text style={styles.zoneName}>{zone.name}</Text>
            <Text style={styles.capacity}>{zone.capacity.toLocaleString()} personas · aforo máximo</Text>
          </View>
        ))}

        {zones.length === 0 && !loading && !error ? (
          <Text style={styles.muted}>La API no tiene zonas para mostrar.</Text>
        ) : null}
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Acciones de entrenamiento</Text>
            <Text style={styles.muted}>Cada botón genera una petición HTTP real.</Text>
          </View>
        </View>

        <View style={styles.actions}>
          {actions.map(([label, task]) => (
            <Pressable
              key={label}
              accessibilityRole="button"
              disabled={busy || loading}
              style={({ pressed }) => [styles.actionButton, pressed && styles.pressed, (busy || loading) && styles.disabled]}
              onPress={() => void run(label, task)}
            >
              <Text style={styles.actionText}>{label}</Text>
            </Pressable>
          ))}
        </View>

        {busy ? <Text style={styles.muted}>Enviando petición…</Text> : null}
        {result ? <Text accessibilityLiveRegion="polite" style={styles.result}>{result}</Text> : null}

        <Text style={styles.footnote}>
          Demo evaluable · Los datos se guardan solo en memoria y pueden reiniciarse al reiniciar el backend.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b1018' },
  page: { width: '100%', maxWidth: 900, alignSelf: 'center', padding: 24, paddingTop: 44, paddingBottom: 56, gap: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, paddingBottom: 14 },
  eyebrow: { color: '#68e0c2', fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#f5f7fa', fontSize: 36, fontWeight: '800', marginTop: 9 },
  subtitle: { color: '#a2adbb', fontSize: 15, marginTop: 7 },
  metric: { minWidth: 110, padding: 14, borderRadius: 14, backgroundColor: '#142129', alignItems: 'center' },
  metricNumber: { color: '#68e0c2', fontSize: 25, fontWeight: '800' },
  metricLabel: { color: '#a2adbb', fontSize: 9, fontWeight: '700', letterSpacing: 1, marginTop: 4 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  sectionTitle: { color: '#f5f7fa', fontSize: 20, fontWeight: '700' },
  muted: { color: '#8995a5', fontSize: 13, marginTop: 4 },
  secondaryButton: { borderColor: '#354350', borderWidth: 1, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 13 },
  secondaryButtonText: { color: '#dce5ec', fontSize: 13, fontWeight: '700' },
  zoneCard: { backgroundColor: '#131c26', borderColor: '#253340', borderWidth: 1, borderRadius: 15, padding: 18, gap: 7 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  zoneId: { color: '#68e0c2', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  badge: { borderRadius: 20, paddingVertical: 5, paddingHorizontal: 9 },
  badgeOpen: { backgroundColor: '#173b34' },
  badgeOther: { backgroundColor: '#3b3020' },
  badgeText: { color: '#d9fff4', fontSize: 10, fontWeight: '800' },
  zoneName: { color: '#f5f7fa', fontSize: 21, fontWeight: '700' },
  capacity: { color: '#a2adbb', fontSize: 13 },
  error: { color: '#ff9f9f', fontSize: 14, padding: 12, backgroundColor: '#351c22', borderRadius: 10 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionButton: { flexGrow: 1, flexBasis: 185, backgroundColor: '#1b2e37', borderColor: '#31505a', borderWidth: 1, paddingVertical: 13, paddingHorizontal: 14, borderRadius: 10 },
  actionText: { color: '#e9f7f4', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.45 },
  result: { color: '#adf5d5', backgroundColor: '#101b1b', borderRadius: 10, padding: 14, fontFamily: 'monospace', fontSize: 12, lineHeight: 18 },
  footnote: { color: '#687787', fontSize: 11, lineHeight: 16, marginTop: 10 }
});
