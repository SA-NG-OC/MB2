import React, { useState, useCallback } from 'react';
import {
    StyleSheet, Text, View, FlatList, TouchableOpacity,
    Modal, TextInput, Alert, KeyboardAvoidingView,
    Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../type';
import {
    getProfile,
    getAllPosts,
    addPost,
    deletePost,
    Post,
    Profile,
} from '../storage'; // ← đổi từ '../storage' sang '../api'

type Props = NativeStackScreenProps<MainTabParamList, 'Home'>;

const formatDate = (iso: string): string => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// --- Component PostCard ---
const PostCard = ({
    item,
    currentUserEmail,
    onDelete
}: {
    item: Post;
    currentUserEmail: string;
    onDelete: (id: string) => void;
}) => {
    // ← dùng creator_email thay vì authorEmail
    const isOwner = item.creator_email === currentUserEmail;

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    {/* ← creator_email */}
                    <Text style={styles.authorTag}>✍️ Tác giả: {item.creator_email}</Text>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
                {isOwner && (
                    <TouchableOpacity onPress={() => onDelete(item.id)}>
                        <Text style={styles.deleteBtn}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* ← description thay vì text */}
            <Text style={styles.cardText}>{item.description}</Text>

            {/* ← created_at thay vì createdAt */}
            <Text style={styles.cardDate}>🕐 {formatDate(item.created_at)}</Text>
        </View>
    );
};

// --- HomeScreen ---
export default function HomeScreen({ navigation, route }: Props) {
    const { email } = route.params;
    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newText, setNewText] = useState('');

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                const [p, allPosts] = await Promise.all([
                    getProfile(email),
                    getAllPosts()
                ]);
                setProfile(p);
                setPosts(allPosts);
            };
            loadData();
        }, [email])
    );

    const handleAddPost = async () => {
        if (!newTitle.trim() || !newText.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tiêu đề và nội dung");
            return;
        }
        const created = await addPost({
            authorEmail: email,
            title: newTitle.trim(),
            text: newText.trim()
        });
        if (!created) {
            Alert.alert("Lỗi", "Không thể đăng bài, thử lại sau.");
            return;
        }
        setPosts(prev => [created, ...prev]);
        setNewTitle('');
        setNewText('');
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Chào mừng bạn,</Text>
                    <Text style={styles.username}>{profile?.name || email} 👋</Text>
                </View>
            </View>

            <View style={styles.subHeader}>
                <Text style={styles.subTitle}>Bảng tin cộng đồng ({posts.length})</Text>
                <TouchableOpacity style={styles.newBtn} onPress={() => setModalVisible(true)}>
                    <Text style={styles.newBtnText}>+ Đăng bài</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={posts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <PostCard
                        item={item}
                        currentUserEmail={email}
                        onDelete={(id) => {
                            Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xoá bài viết này?", [
                                { text: "Huỷ", style: "cancel" },
                                {
                                    text: "Xoá",
                                    style: "destructive",
                                    onPress: async () => {
                                        await deletePost(id);
                                        setPosts(prev => prev.filter(p => p.id !== id));
                                    }
                                }
                            ]);
                        }}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 50, color: '#bbb' }}>
                        Chưa có bài đăng nào trên bảng tin.
                    </Text>
                }
            />

            <Modal visible={modalVisible} animationType="fade" transparent>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalBox}>
                            <Text style={styles.modalTitle}>Tạo bài đăng mới</Text>
                            <TextInput
                                style={styles.input}
                                value={newTitle}
                                onChangeText={setNewTitle}
                                placeholder="Tiêu đề bài viết..."
                            />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={newText}
                                onChangeText={setNewText}
                                placeholder="Bạn đang nghĩ gì?"
                                multiline
                            />
                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={[styles.modalBtn, { borderColor: '#ddd' }]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={{ color: '#666' }}>Huỷ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalBtn, { backgroundColor: '#000' }]}
                                    onPress={handleAddPost}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đăng bài</Text>
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
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: {
        paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20,
        backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee'
    },
    greeting: { fontSize: 13, color: '#888' },
    username: { fontSize: 20, fontWeight: 'bold', color: '#000' },
    subHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', padding: 24
    },
    subTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    newBtn: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
    newBtnText: { color: '#fff', fontWeight: 'bold' },
    card: {
        backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 16,
        padding: 16, borderRadius: 12, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05,
        shadowRadius: 10, elevation: 3
    },
    authorTag: { fontSize: 12, color: '#007AFF', marginBottom: 4, fontWeight: '600' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
    cardText: { fontSize: 15, color: '#444', lineHeight: 22, marginBottom: 12 },
    cardDate: { fontSize: 11, color: '#bbb' },
    deleteBtn: { fontSize: 18, color: '#ff4d4f', padding: 5 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
    modalBox: { backgroundColor: '#fff', padding: 24, borderRadius: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#eee', padding: 12, marginBottom: 15, borderRadius: 10, backgroundColor: '#fafafa' },
    textArea: { height: 120, textAlignVertical: 'top' },
    modalActions: { flexDirection: 'row', gap: 12 },
    modalBtn: { flex: 1, borderWidth: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' }
});