import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'users_array';
const POSTS_KEY = 'posts_array';

export interface User {
    name: string;
    email: string;
    password: string;
}

export interface Profile {
    name: string;
    email: string;
    address: string;
    avatar: string;
    description: string;
}

export const getUsers = async (): Promise<User[]> => {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
};

export const saveUsers = async (users: User[]): Promise<void> => {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUser = async (email: string, password: string): Promise<User | null> => {
    const users = await getUsers();
    return users.find(u => u.email === email && u.password === password) ?? null;
};

export const registerUser = async (user: User): Promise<{ success: boolean; message: string }> => {
    const users = await getUsers();
    if (users.find(u => u.email === user.email)) {
        return { success: false, message: 'Email đã được sử dụng!' };
    }
    users.push(user);
    await saveUsers(users);

    // Init profile
    const profile: Profile = { name: user.name, email: user.email, address: '', avatar: '', description: '' };
    await saveProfile(profile);
    return { success: true, message: 'Đăng ký thành công!' };
};

// ===================== PROFILE =====================

const profileKey = (email: string) => `profile_${email}`;

export const getProfile = async (email: string): Promise<Profile | null> => {
    const raw = await AsyncStorage.getItem(profileKey(email));
    return raw ? JSON.parse(raw) : null;
};

export const saveProfile = async (profile: Profile): Promise<void> => {
    await AsyncStorage.setItem(profileKey(profile.email), JSON.stringify(profile));
};

// ===================== POSTS =====================

export interface Post {
    id: string;
    authorEmail: string;
    title: string;
    text: string;
    createdAt: string; // ISO string
}

export const getPosts = async (email: string): Promise<Post[]> => {
    const raw = await AsyncStorage.getItem(POSTS_KEY);
    const all: Post[] = raw ? JSON.parse(raw) : [];
    const filtered = all.filter(p => p.authorEmail === email);
    // Sort newest first
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const addPost = async (post: Omit<Post, 'id' | 'createdAt'>): Promise<Post> => {
    const raw = await AsyncStorage.getItem(POSTS_KEY);
    const all: Post[] = raw ? JSON.parse(raw) : [];
    const newPost: Post = {
        ...post,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
    };
    all.push(newPost);
    await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(all));
    return newPost;
};

export const deletePost = async (id: string): Promise<void> => {
    const raw = await AsyncStorage.getItem(POSTS_KEY);
    const all: Post[] = raw ? JSON.parse(raw) : [];
    const updated = all.filter(p => p.id !== id);
    await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(updated));
};