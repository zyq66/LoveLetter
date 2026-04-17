import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { colors, spacing } from '../../theme';
import { pairCouple } from '../../services/auth';
import { useAuth } from '../../store/AuthContext';
import { db } from '../../config/cloudbase';

export function CoupleCodeScreen({ route }: any) {
  const params = route.params ?? {};
  const { setAuth, userId: authUserId, gender: authGender } = useAuth();
  const userId = params.userId ?? authUserId;
  const gender = params.gender ?? authGender ?? 'male';
  const [coupleCode, setCoupleCode] = useState<string>(params.coupleCode ?? '');
  const [partnerCode, setPartnerCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coupleCode || !userId) return;
    db.collection('users').doc(userId).get().then((res: any) => {
      const user = (res.data as any[])?.[0];
      if (user?.code) setCoupleCode(user.code);
    });
  }, [userId]);

  async function handleCopy() {
    await Clipboard.setStringAsync(coupleCode);
    Alert.alert('已复制');
  }

  async function handlePair() {
    if (partnerCode.length < 6) return Alert.alert('请输入对方的6位情侣码');
    setLoading(true);
    try {
      const newCoupleId = await pairCouple(userId, partnerCode.toUpperCase());
      setAuth(userId, newCoupleId, gender ?? 'male');
    } catch (e: any) {
      Alert.alert('配对失败', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>情侣码配对</Text>
      <Text style={styles.label}>你的情侣码（发给对方）</Text>
      <TouchableOpacity style={styles.codeBox} onPress={handleCopy}>
        <Text style={styles.code}>{coupleCode}</Text>
        <Text style={styles.copyHint}>点击复制</Text>
      </TouchableOpacity>
      <Text style={styles.label}>输入对方的情侣码</Text>
      <TextInput
        style={styles.input}
        placeholder="6位情侣码"
        placeholderTextColor={colors.whiteSecondary}
        value={partnerCode}
        onChangeText={setPartnerCode}
        autoCapitalize="characters"
        maxLength={6}
      />
      <TouchableOpacity style={styles.button} onPress={handlePair} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.bg} /> : <Text style={styles.buttonText}>配对</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: spacing.lg },
  title: { fontSize: 28, fontWeight: '700', color: colors.white, marginBottom: spacing.lg },
  label: { color: colors.whiteSecondary, marginBottom: spacing.sm },
  codeBox: { backgroundColor: colors.greenDim, borderWidth: 1, borderColor: colors.greenBorder, borderRadius: 12, padding: spacing.md, alignItems: 'center', marginBottom: spacing.lg },
  code: { fontSize: 32, fontWeight: '700', color: colors.green, letterSpacing: 6 },
  copyHint: { fontSize: 11, color: colors.whiteSecondary, marginTop: 4 },
  input: { backgroundColor: colors.whiteDim, borderWidth: 1, borderColor: colors.whiteBorder, borderRadius: 12, padding: spacing.md, color: colors.white, fontSize: 16, marginBottom: spacing.md },
  button: { backgroundColor: colors.green, borderRadius: 12, padding: spacing.md, alignItems: 'center' },
  buttonText: { color: colors.bg, fontWeight: '700', fontSize: 16 },
});
