import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity, Image,
    ScrollView, Alert, KeyboardAvoidingView, Platform,
    TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../type';

type Props = NativeStackScreenProps<MainTabParamList, 'Profile'>;

const BASE_URL = 'http://blackntt.net:4321';

interface Profile {
    name: string;
    email: string;
    description: string;
    avatar?: string;
    address?: string;
}

const getProfile = async (email: string): Promise<Profile | null> => {
    try {
        const res = await fetch(`${BASE_URL}/profile/${encodeURIComponent(email)}`);
        if (!res.ok) return null;
        return await res.json();
    } catch { return null; }
};

export default function ProfileScreen({ navigation, route }: Props) {
    const { email } = route.params;
    const [profile, setProfile] = useState<Profile>({
        name: '', email, description: '', avatar: '', address: ''
    });
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        getProfile(email).then(data => {
            if (data) setProfile(prev => ({ ...prev, ...data }));
            setLoadingProfile(false);
        });
    }, []);

    const handleSave = () => {
        // API hiện chỉ có GET /profile — khi backend thêm PUT thì gọi ở đây
        Alert.alert('Đã lưu', 'Thông tin cá nhân đã được cập nhật!');
        Keyboard.dismiss();
    };

    const handleLogout = () => {
        Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
            { text: 'Huỷ', style: 'cancel' },
            { text: 'Đăng xuất', style: 'destructive', onPress: () => navigation.navigate('Login' as any) }
        ]);
    };

    if (loadingProfile) {
        return (
            <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#111" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                    {/* Avatar & Name header */}
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarWrap}>
                            {profile.avatar
                                ? <Image source={{ uri: profile.avatar }} style={styles.avatarImg} />
                                : <Text style={styles.avatarEmoji}>👤</Text>
                            }
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.profileName}>{profile.name || 'Chưa có tên'}</Text>
                            <Text style={styles.profileEmail}>{profile.email}</Text>
                        </View>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Field label="Tên hiển thị"
                            value={profile.name}
                            onChange={t => setProfile({ ...profile, name: t })}
                            placeholder="Nguyễn Văn A" />

                        <Field label="Email" value={profile.email} onChange={() => { }}
                            placeholder="" editable={false} />

                        <Field label="Địa chỉ"
                            value={profile.address || ''}
                            onChange={t => setProfile({ ...profile, address: t })}
                            placeholder="Hà Nội, Việt Nam" />

                        <Field label="Avatar URL"
                            value={profile.avatar || ''}
                            onChange={t => setProfile({ ...profile, avatar: t })}
                            placeholder="https://example.com/photo.jpg"
                            keyboardType="url" />

                        <Field label="Giới thiệu"
                            value={profile.description}
                            onChange={t => setProfile({ ...profile, description: t })}
                            placeholder="Kể về bản thân bạn..."
                            multiline />
                    </View>

                    {/* Buttons */}
                    <View style={styles.btnRow}>
                        <TouchableOpacity style={styles.btnSave} onPress={handleSave} activeOpacity={0.85}>
                            <Text style={styles.btnSaveText}>Lưu thay đổi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout} activeOpacity={0.85}>
                            <Text style={styles.btnLogoutText}>Đăng xuất</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const Field = ({
    label, value, onChange, placeholder, editable = true,
    multiline = false, keyboardType = 'default'
}: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; editable?: boolean;
    multiline?: boolean; keyboardType?: any;
}) => (
    <View style={styles.fieldWrapper}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={[
                styles.input,
                multiline && styles.textArea,
                !editable && styles.inputDisabled
            ]}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor="#bbb"
            editable={editable}
            multiline={multiline}
            keyboardType={keyboardType}
            autoCapitalize="none"
        />
    </View>
);

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#f8f9fa' },
    loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { padding: 24, paddingTop: 60, paddingBottom: 60 },

    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 32,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    avatarWrap: {
        width: 64, height: 64, borderRadius: 32,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center', alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1.5, borderColor: '#e0e0e0',
    },
    avatarImg: { width: '100%', height: '100%', resizeMode: 'cover' },
    avatarEmoji: { fontSize: 28 },
    profileName: { fontSize: 18, fontWeight: '700', color: '#111' },
    profileEmail: { fontSize: 13, color: '#888', marginTop: 2 },

    form: { gap: 4, marginBottom: 28 },
    fieldWrapper: { marginBottom: 14 },
    label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 },
    input: {
        borderWidth: 1.5, borderColor: '#e0e0e0',
        backgroundColor: '#fff', borderRadius: 12,
        padding: 14, fontSize: 15, color: '#111',
    },
    inputDisabled: { backgroundColor: '#f5f5f5', color: '#999' },
    textArea: { height: 100, textAlignVertical: 'top' },

    btnRow: { flexDirection: 'row', gap: 12 },
    btnSave: {
        flex: 1, backgroundColor: '#111', borderRadius: 14,
        paddingVertical: 15, alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 10, elevation: 4,
    },
    btnSaveText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    btnLogout: {
        flex: 1, borderWidth: 1.5, borderColor: '#ff4d4f',
        borderRadius: 14, paddingVertical: 15, alignItems: 'center',
    },
    btnLogoutText: { color: '#ff4d4f', fontWeight: '700', fontSize: 15 },
});