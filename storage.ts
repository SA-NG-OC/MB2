// api.ts
const BASE_URL = 'http://blackntt.net:4321';

export interface User { name: string; email: string; password: string; }
export interface Profile { name: string; email: string; address?: string; avatar?: string; description: string; }
export interface Post { id: string; creator_email: string; title: string; description: string; created_at: string; }

// ===================== AUTH =====================
export const findUser = async (email: string, password: string) => {
    try {
        const res = await fetch(`${BASE_URL}/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
            method: 'POST',
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data; // { message: "Login successful", name: "John Doe" }
    } catch (e) { return null; }
};

export const registerUser = async (user: User) => {
    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                password: user.password,
                name: user.name,
                description: '',
            }),
        });
        const data = await res.json();
        if (!res.ok) return { success: false, message: data.detail || 'Lỗi đăng ký' };
        return { success: true, message: 'Thành công!' };
    } catch (e) { return { success: false, message: 'Lỗi hệ thống' }; }
};

// ===================== PROFILE =====================
export const getProfile = async (email: string) => {
    try {
        const res = await fetch(`${BASE_URL}/profile/${encodeURIComponent(email)}`);
        if (!res.ok) return null;
        return await res.json(); // trả về Profile
    } catch (e) { return null; }
};

// ===================== POSTS =====================
export const getAllPosts = async (): Promise<Post[]> => {
    try {
        const res = await fetch(`${BASE_URL}/posts`);
        if (!res.ok) return [];
        return await res.json();
    } catch (e) { return []; }
};

export const addPost = async (post: { authorEmail: string; title: string; text: string }): Promise<Post | null> => {
    try {
        const res = await fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: post.title,
                description: post.text,
                creator_email: post.authorEmail,
            }),
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) { return null; }
};

export const deletePost = async (id: string) => {
    try {
        await fetch(`${BASE_URL}/posts/${id}`, { method: 'DELETE' });
    } catch (e) { console.error(e); }
};