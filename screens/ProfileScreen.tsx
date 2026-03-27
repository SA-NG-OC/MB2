import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity, Image,
    ScrollView, Alert, KeyboardAvoidingView, Platform,
    TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../type';
import { getProfile, saveProfile, Profile } from '../storage';

type Props = NativeStackScreenProps<MainTabParamList, 'Profile'>;

export default function ProfileScreen({ navigation, route }: Props) {
    const { email } = route.params;
    const [profile, setProfile] = useState<Profile>({
        name: '', email, address: '', avatar: '', description: ''
    });

    useEffect(() => {
        const load = async () => {
            const saved = await getProfile(email);
            if (saved) setProfile(saved);
        };
        load();
    }, []);

    const handleSave = async () => {
        try {
            await saveProfile(profile);
            Alert.alert("Thông báo", "Đã lưu thông tin cá nhân!");
            Keyboard.dismiss();
        } catch {
            Alert.alert("Lỗi", "Không thể lưu thông tin");
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{profile.name || 'User'}!</Text>
                        <View style={styles.avatarBox}>
                            {profile.avatar
                                ? <Image source={{ uri: profile.avatar }} style={styles.image} key={profile.avatar} />
                                : <Text style={{ fontSize: 30 }}>🖼️</Text>
                            }
                        </View>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput style={styles.input} value={profile.name}
                            onChangeText={t => setProfile({ ...profile, name: t })} placeholder="Your Name" />

                        <Text style={styles.label}>Email</Text>
                        <TextInput style={[styles.input, { backgroundColor: '#f0f0f0' }]}
                            value={profile.email} editable={false} />

                        <Text style={styles.label}>Address</Text>
                        <TextInput style={styles.input} value={profile.address}
                            onChangeText={t => setProfile({ ...profile, address: t })} placeholder="Your Address" />

                        <Text style={styles.label}>Avatar URL</Text>
                        <TextInput style={styles.input} value={profile.avatar}
                            onChangeText={t => setProfile({ ...profile, avatar: t })}
                            placeholder="https://example.com/photo.jpg"
                            autoCapitalize="none" autoCorrect={false} keyboardType="url" />

                        <Text style={styles.label}>Description</Text>
                        <TextInput style={[styles.input, styles.textArea]} multiline numberOfLines={4}
                            value={profile.description}
                            onChangeText={t => setProfile({ ...profile, description: t })}
                            placeholder="Tell us about yourself..." />
                    </View>

                    {/* Footer buttons */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.btnSmall} onPress={handleSave}>
                            <Text style={styles.btnText}>Save</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.btnSmall} onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.btnText}>Logout</Text>
                        </TouchableOpacity> */}
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 30, backgroundColor: '#fff', flexGrow: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 40 },
    title: { fontSize: 30, fontWeight: 'bold', flex: 1 },
    avatarBox: { width: 80, height: 80, borderWidth: 1, justifyContent: 'center', alignItems: 'center', borderColor: '#000', overflow: 'hidden' },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    form: { width: '100%' },
    label: { fontSize: 16, marginBottom: 5, color: '#333' },
    input: { borderWidth: 1, padding: 10, marginBottom: 15, borderColor: '#000', fontSize: 16 },
    textArea: { height: 100, textAlignVertical: 'top' },
    footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingBottom: 40 },
    btnSmall: { borderWidth: 1, padding: 12, width: '45%', alignItems: 'center', borderColor: '#000' },
    btnText: { fontSize: 16, fontWeight: '500' },
});