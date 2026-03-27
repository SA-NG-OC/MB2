import React, { useState, useCallback } from 'react';
import {
    StyleSheet, Text, View, FlatList, TouchableOpacity,
    Modal, TextInput, Alert, KeyboardAvoidingView,
    Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../type';
import { getProfile, getPosts, addPost, deletePost, Post, Profile } from '../storage';

type Props = NativeStackScreenProps<MainTabParamList, 'Home'>;

const formatDate = (iso: string): string => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}  ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function HomeScreen({ navigation, route }: Props) {
    const { email } = route.params;
    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newText, setNewText] = useState('');

    // Reload data whenever screen is focused
    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                const [p, userPosts] = await Promise.all([getProfile(email), getPosts(email)]);
                setProfile(p);
                setPosts(userPosts);
            };
            load();
        }, [email])
    );

    const handleAddPost = async () => {
        if (!newTitle.trim() || !newText.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập tiêu đề và nội dung bài đăng");
            return;
        }
        const created = await addPost({ authorEmail: email, title: newTitle.trim(), text: newText.trim() });
        setPosts(prev => [created, ...prev]); // prepend since sorted newest first
        setNewTitle('');
        setNewText('');
        setModalVisible(false);
        Keyboard.dismiss();
    };

    const handleDelete = (id: string) => {
        Alert.alert("Xác nhận", "Bạn có chắc muốn xoá bài đăng này?", [
            { text: "Huỷ", style: "cancel" },
            {
                text: "Xoá", style: "destructive", onPress: async () => {
                    await deletePost(id);
                    setPosts(prev => prev.filter(p => p.id !== id));
                }
            }
        ]);
    };

    const renderPost = ({ item }: { item: Post }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Text style={styles.deleteBtn}>✕</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.cardText}>{item.text}</Text>
            <Text style={styles.cardDate}>🕐 {formatDate(item.createdAt)}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello,</Text>
                    <Text style={styles.username}>{profile?.name || email} 👋</Text>
                </View>
                {/* <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Profile', { email })}>
                        <Text style={styles.iconText}>👤</Text>
                    </TouchableOpacity>
                </View> */}
            </View>

            {/* Posts count */}
            <View style={styles.subHeader}>
                <Text style={styles.subTitle}>Bài đăng của bạn ({posts.length})</Text>
                <TouchableOpacity style={styles.newBtn} onPress={() => setModalVisible(true)}>
                    <Text style={styles.newBtnText}>+ Thêm</Text>
                </TouchableOpacity>
            </View>

            {/* FlatList */}
            <FlatList
                data={posts}
                keyExtractor={item => item.id}
                renderItem={renderPost}
                contentContainerStyle={posts.length === 0 ? styles.emptyContainer : { paddingBottom: 40 }}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>Chưa có bài đăng nào.</Text>
                        <Text style={styles.emptyHint}>Nhấn "+ Thêm" để tạo bài đầu tiên!</Text>
                    </View>
                }
            />

            {/* Modal: Add Post */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalBox}>
                            <Text style={styles.modalTitle}>Bài đăng mới</Text>

                            <Text style={styles.label}>Tiêu đề</Text>
                            <TextInput
                                style={styles.input}
                                value={newTitle}
                                onChangeText={setNewTitle}
                                placeholder="Nhập tiêu đề..."
                                maxLength={100}
                            />

                            <Text style={styles.label}>Nội dung</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={newText}
                                onChangeText={setNewText}
                                placeholder="Nhập nội dung bài đăng..."
                                multiline
                                numberOfLines={5}
                            />

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={[styles.modalBtn, { borderColor: '#999' }]}
                                    onPress={() => { setModalVisible(false); setNewTitle(''); setNewText(''); }}
                                >
                                    <Text style={[styles.modalBtnText, { color: '#666' }]}>Huỷ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalBtn} onPress={handleAddPost}>
                                    <Text style={styles.modalBtnText}>Đăng</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    // Header
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20,
        borderBottomWidth: 1, borderColor: '#eee',
    },
    greeting: { fontSize: 14, color: '#888' },
    username: { fontSize: 22, fontWeight: 'bold', color: '#111', marginTop: 2 },
    headerActions: { flexDirection: 'row', gap: 8 },
    iconBtn: { width: 40, height: 40, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
    iconText: { fontSize: 18 },

    // Sub header
    subHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 24, paddingVertical: 16,
    },
    subTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
    newBtn: { borderWidth: 1, borderColor: '#000', paddingVertical: 6, paddingHorizontal: 14 },
    newBtnText: { fontSize: 14, fontWeight: '600' },

    // Card
    card: {
        marginHorizontal: 24, marginBottom: 16,
        borderWidth: 1, borderColor: '#ddd', padding: 16,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#111', flex: 1, marginRight: 8 },
    cardText: { fontSize: 14, color: '#444', lineHeight: 20, marginBottom: 10 },
    cardDate: { fontSize: 12, color: '#999' },
    deleteBtn: { fontSize: 14, color: '#bbb', paddingLeft: 4 },

    // Empty state
    emptyContainer: { flexGrow: 1 },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
    emptyIcon: { fontSize: 48, marginBottom: 12 },
    emptyText: { fontSize: 16, color: '#555', marginBottom: 6 },
    emptyHint: { fontSize: 14, color: '#aaa' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalBox: { backgroundColor: '#fff', padding: 28, paddingBottom: 40 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    label: { fontSize: 14, color: '#555', marginBottom: 6 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 16, fontSize: 15 },
    textArea: { height: 120, textAlignVertical: 'top' },
    modalActions: { flexDirection: 'row', gap: 12, marginTop: 4 },
    modalBtn: { flex: 1, borderWidth: 1, borderColor: '#000', paddingVertical: 12, alignItems: 'center' },
    modalBtnText: { fontSize: 16, fontWeight: '600' },
});