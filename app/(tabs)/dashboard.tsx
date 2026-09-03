import { StyleSheet, Text, View } from 'react-native';
import { campaigns } from '../../data/campaigns';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>OVERVIEW</Text>
      <Text style={styles.title}>Good morning.</Text>
      <Text style={styles.subtitle}>Your workspace foundation is ready for data.</Text>
      <View style={styles.featured}>
        <Text style={styles.featuredLabel}>NEXT CAMPAIGN</Text>
        <Text style={styles.featuredTitle}>{campaigns[0].name}</Text>
        <Text style={styles.featuredMeta}>{campaigns[0].clientName} · {campaigns[0].status}</Text>
      </View>
      <View style={styles.metricRow}>
        <Metric label="Active campaigns" value="0" />
        <Metric label="Clients" value="0" />
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <View style={styles.metric}><Text style={styles.value}>{value}</Text><Text style={styles.label}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f1ea', padding: 24 },
  kicker: { color: '#b54a2b', fontSize: 12, fontWeight: '700', letterSpacing: 2, marginTop: 18 },
  title: { color: '#202522', fontSize: 32, fontWeight: '700', marginTop: 8 },
  subtitle: { color: '#5f665f', fontSize: 16, marginTop: 8 },
  featured: { backgroundColor: '#202522', borderRadius: 8, marginTop: 28, padding: 20 },
  featuredLabel: { color: '#e7b85c', fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  featuredTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 10 },
  featuredMeta: { color: '#d6d9d2', fontSize: 14, marginTop: 8, textTransform: 'capitalize' },
  metricRow: { flexDirection: 'row', marginTop: 32 },
  metric: { backgroundColor: '#fff', borderRadius: 8, flex: 1, marginRight: 12, padding: 18 },
  value: { color: '#202522', fontSize: 30, fontWeight: '700' },
  label: { color: '#5f665f', fontSize: 13, marginTop: 6 },
});