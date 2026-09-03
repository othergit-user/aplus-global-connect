import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>APG CONNECT</Text>
      <Text style={styles.title}>Your campaigns, in one clear view.</Text>
      <Text style={styles.subtitle}>
        Local foundation entry. Firebase authentication comes next.
      </Text>
      <TextInput autoCapitalize="none" keyboardType="email-address" placeholder="Email" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <Pressable onPress={() => router.replace('/(tabs)')} style={styles.button}>
        <Text style={styles.buttonText}>Enter workspace</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 28, backgroundColor: '#f4f1ea' },
  eyebrow: { color: '#b54a2b', fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  title: { color: '#202522', fontSize: 34, fontWeight: '700', marginTop: 12 },
  subtitle: { color: '#5f665f', fontSize: 16, lineHeight: 24, marginBottom: 28, marginTop: 12 },
  input: { backgroundColor: '#fff', borderColor: '#d8d5cc', borderRadius: 8, borderWidth: 1, fontSize: 16, marginBottom: 12, padding: 15 },
  button: { alignItems: 'center', backgroundColor: '#202522', borderRadius: 8, marginTop: 8, padding: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});