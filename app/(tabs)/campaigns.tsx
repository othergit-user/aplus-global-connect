import { StyleSheet, Text, View } from 'react-native';
import { campaigns } from '../../data/campaigns';

export default function CampaignsScreen() {
  return <View style={styles.container}><Text style={styles.title}>Campaigns</Text>{campaigns.map(campaign => <View key={campaign.id} style={styles.item}><Text style={styles.itemTitle}>{campaign.name}</Text><Text style={styles.text}>{campaign.clientName} · {campaign.platforms.join(', ')}</Text><Text style={styles.status}>{campaign.status}</Text></View>)}</View>;
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#f4f1ea', padding: 24 }, title: { color: '#202522', fontSize: 30, fontWeight: '700', marginTop: 18 }, item: { backgroundColor: '#fff', borderRadius: 8, marginTop: 22, padding: 18 }, itemTitle: { color: '#202522', fontSize: 18, fontWeight: '700' }, text: { color: '#5f665f', fontSize: 15, marginTop: 10 }, status: { color: '#b54a2b', fontSize: 12, fontWeight: '700', marginTop: 14, textTransform: 'uppercase' } });