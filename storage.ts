import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('UserDatabase.db');

export interface User { name: string; email: string; password: string; }
export interface Profile { name: string; email: string; address: string; avatar: string; description: string; }
export interface Post { id: string; authorEmail: string; title: string; text: string; createdAt: string; }

// Interface cho Comment
export interface Comment {
    id: string;
    postId: string;
    authorEmail: string;
    text: string;
    createdAt: string;
}

export const initDatabase = async () => {
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY NOT NULL, name TEXT, password TEXT);
        CREATE TABLE IF NOT EXISTS profiles (email TEXT PRIMARY KEY NOT NULL, name TEXT, address TEXT, avatar TEXT, description TEXT);
        CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY NOT NULL, authorEmail TEXT, title TEXT, text TEXT, createdAt TEXT);
        
        -- Thêm bảng comments
        CREATE TABLE IF NOT EXISTS comments (
            id TEXT PRIMARY KEY NOT NULL,
            postId TEXT,
            authorEmail TEXT,
            text TEXT,
            createdAt TEXT,
            FOREIGN KEY (postId) REFERENCES posts (id) ON DELETE CASCADE
        );
    `);
};

// ===================== AUTH & PROFILE (Giữ nguyên các hàm cũ) =====================
export const findUser = async (email: string, password: string) => await db.getFirstAsync<User>('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
export const registerUser = async (user: User) => {
    try {
        const exist = await db.getFirstAsync<User>('SELECT email FROM users WHERE email = ?', [user.email]);
        if (exist) return { success: false, message: 'Email đã tồn tại!' };
        await db.runAsync('INSERT INTO users VALUES (?, ?, ?)', [user.email, user.name, user.password]);
        await db.runAsync('INSERT INTO profiles VALUES (?, ?, ?, ?, ?)', [user.email, user.name, '', '', '']);
        return { success: true, message: 'Thành công!' };
    } catch (e) { return { success: false, message: 'Lỗi hệ thống' }; }
};
export const getProfile = async (email: string) => await db.getFirstAsync<Profile>('SELECT * FROM profiles WHERE email = ?', [email]);
export const saveProfile = async (p: Profile) => await db.runAsync('UPDATE profiles SET name=?, address=?, avatar=?, description=? WHERE email=?', [p.name, p.address, p.avatar, p.description, p.email]);

// ===================== POSTS (Sửa để lấy tất cả) =====================

export const getAllPosts = async (): Promise<Post[]> => {
    // Không lọc theo email nữa để ai cũng thấy bài của nhau
    return await db.getAllAsync<Post>('SELECT * FROM posts ORDER BY createdAt DESC');
};

export const addPost = async (post: Omit<Post, 'id' | 'createdAt'>): Promise<Post> => {
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();
    await db.runAsync('INSERT INTO posts VALUES (?, ?, ?, ?, ?)', [id, post.authorEmail, post.title, post.text, createdAt]);
    return { ...post, id, createdAt };
};

export const deletePost = async (id: string) => await db.runAsync('DELETE FROM posts WHERE id = ?', [id]);

// ===================== COMMENTS =====================

export const getCommentsByPost = async (postId: string): Promise<Comment[]> => {
    return await db.getAllAsync<Comment>('SELECT * FROM comments WHERE postId = ? ORDER BY createdAt ASC', [postId]);
};

export const addComment = async (comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> => {
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();
    await db.runAsync('INSERT INTO comments VALUES (?, ?, ?, ?, ?)', [id, comment.postId, comment.authorEmail, comment.text, createdAt]);
    return { ...comment, id, createdAt };
};