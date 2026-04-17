import React, { useState } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity, Alert,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
    Keyboard, ScrollView, ActivityIndicator
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../type';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const BASE_URL = 'http://blackntt.net:4321';

const findUser = async (email: string, password: string) => {
    try {
        const res = await fetch(`${BASE_URL}/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
            method: 'POST',
        });
        const json = await res.json();
        if (!res.ok) return null;
        return { email, name: json.name }; // API trả về { message, name }
    } catch (e) {
        return null;
    }
};

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ Email và Mật khẩu');
            return;
        }
        setLoading(true);
        try {
            const user = await findUser(email.trim().toLowerCase(), password);
            if (user) {
                Keyboard.dismiss();
                navigation.navigate('Main', { email: user.email });
            } else {
                Alert.alert('Sai thông tin', 'Email hoặc mật khẩu không đúng.');
            }
        } catch {
            Alert.alert('Lỗi', 'Không thể kết nối server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                    {/* Header */}
                    <View style={styles.headerBlock}>
                        <Text style={styles.title}>Đăng nhập</Text>
                        <Text style={styles.subtitle}>Chào mừng bạn quay trở lại 👋</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="ban@email.com"
                            placeholderTextColor="#bbb"
                        />

                        <Text style={styles.label}>Mật khẩu</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            placeholderTextColor="#bbb"
                        />
                    </View>

                    {/* Button */}
                    <TouchableOpacity
                        style={[styles.btn, loading && styles.btnDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.btnText}>Đăng nhập</Text>
                        }
                    </TouchableOpacity>

                    {/* Link register */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Register')}
                        style={styles.registerLink}
                    >
                        <Text style={styles.registerLinkText}>
                            Chưa có tài khoản?{' '}
                            <Text style={styles.registerLinkBold}>Đăng ký ngay</Text>
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#f8f9fa' },
    container: { flexGrow: 1, padding: 24, justifyContent: 'center', paddingBottom: 60 },

    headerBlock: { marginBottom: 40 },
    title: { fontSize: 34, fontWeight: '800', color: '#111', letterSpacing: -0.5 },
    subtitle: { fontSize: 15, color: '#888', marginTop: 6 },

    form: { gap: 6, marginBottom: 28 },
    label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 },
    input: {
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: '#111',
        marginBottom: 16,
    },

    btn: {
        backgroundColor: '#111',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 4,
    },
    btnDisabled: { opacity: 0.6 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },

    registerLink: { marginTop: 24, alignItems: 'center' },
    registerLinkText: { fontSize: 14, color: '#888' },
    registerLinkBold: { color: '#007AFF', fontWeight: '700' },
});