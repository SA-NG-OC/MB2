import React, { useState } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity, Alert,
    KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../type';
import { registerUser } from '../storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tất cả các trường");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            const result = await registerUser({ name, email: email.trim().toLowerCase(), password });
            if (result.success) {
                Alert.alert("Thành công", result.message, [
                    { text: "OK", onPress: () => navigation.navigate('Login') }
                ]);
                Keyboard.dismiss();
            } else {
                Alert.alert("Lỗi", result.message);
            }
        } catch (e) {
            Alert.alert("Lỗi", "Không thể lưu dữ liệu đăng ký");
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>Register</Text>

                    <View style={styles.form}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your full name" />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input} value={email} onChangeText={setEmail}
                            keyboardType="email-address" autoCapitalize="none" placeholder="test@mail.com"
                        />

                        <Text style={styles.label}>Password</Text>
                        <TextInput style={styles.input} secureTextEntry value={password} onChangeText={setPassword} placeholder="****" />

                        <Text style={styles.label}>Confirm password</Text>
                        <TextInput style={styles.input} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} placeholder="****" />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Create</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 20 }}>
                        <Text style={styles.link}>Đã có tài khoản? Login</Text>
                    </TouchableOpacity>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 30, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 36, textAlign: 'center', marginBottom: 30, fontWeight: '400' },
    form: { width: '100%' },
    label: { fontSize: 16, marginBottom: 5, color: '#333' },
    input: { borderWidth: 1, padding: 12, marginBottom: 15, borderColor: '#000', fontSize: 16 },
    button: { borderWidth: 1, paddingVertical: 12, paddingHorizontal: 40, alignItems: 'center', alignSelf: 'center', marginTop: 10, borderColor: '#000' },
    buttonText: { fontSize: 18, fontWeight: '500' },
    link: { textAlign: 'center', textDecorationLine: 'underline', color: '#666' },
});