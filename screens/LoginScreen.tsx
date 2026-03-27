import React, { useState } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity, Alert,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../type';
import { findUser } from '../storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ Email và Mật khẩu");
            return;
        }
        try {
            const user = await findUser(email.trim().toLowerCase(), password);
            if (user) {
                Keyboard.dismiss();
                navigation.navigate('Main', { email: user.email });
            } else {
                Alert.alert("Lỗi", "Sai email hoặc mật khẩu, hoặc tài khoản chưa tồn tại.");
            }
        } catch (e) {
            Alert.alert("Lỗi", "Không thể đọc dữ liệu từ máy");
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>Login</Text>

                    <View style={styles.form}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="test@mail.com"
                        />

                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            placeholder="****"
                        />

                        <View style={styles.helperRow}>
                            <TouchableOpacity>
                                <Text style={styles.helperText}>Forgot password?</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={[styles.helperText, { textDecorationLine: 'underline' }]}>Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Sign in</Text>
                    </TouchableOpacity>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 30, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 40, textAlign: 'center', marginBottom: 50, fontWeight: '400' },
    form: { width: '100%', marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 8, color: '#333' },
    input: { borderWidth: 1, padding: 12, marginBottom: 20, borderColor: '#000', fontSize: 16 },
    helperRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: -5, marginBottom: 20 },
    helperText: { color: '#666', fontSize: 14 },
    button: { borderWidth: 1, paddingVertical: 12, paddingHorizontal: 30, alignItems: 'center', alignSelf: 'center', minWidth: 120, borderColor: '#000' },
    buttonText: { fontSize: 18, fontWeight: '500' },
});