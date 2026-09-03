import { StyleSheet, Text, View } from 'react-native';
import { clients } from '../../data/clients';

export default function ClientsScreen() {
  return <View style={styles.container}><Text style={styles.title}>Clients</Text>{clients.map(client => <View key={client.id} style={styles.item}><Text style={styles.itemTitle}>{client.companyName}</Text><Text style={styles.text}>{client.industry} · {client.location}</Text><Text style={styles.status}>{client.status}</Text></View>)}</View>;
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#f4f1ea', padding: 24 }, title: { color: '#202522', fontSize: 30, fontWeight: '700', marginTop: 18 }, item: { backgroundColor: '#fff', borderRadius: 8, marginTop: 22, padding: 18 }, itemTitle: { color: '#202522', fontSize: 18, fontWeight: '700' }, text: { color: '#5f665f', fontSize: 15, marginTop: 10 }, status: { color: '#b54a2b', fontSize: 12, fontWeight: '700', marginTop: 14, textTransform: 'uppercase' } });