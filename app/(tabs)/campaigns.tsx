import { StyleSheet, Text, View } from 'react-native';

export default function CampaignsScreen() {
  return <View style={styles.container}><Text style={styles.title}>Campaigns</Text><Text style={styles.text}>Your first campaign will appear here.</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#f4f1ea', padding: 24 }, title: { color: '#202522', fontSize: 30, fontWeight: '700', marginTop: 18 }, text: { color: '#5f665f', fontSize: 16, marginTop: 10 } });