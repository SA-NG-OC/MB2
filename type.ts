import { NavigatorScreenParams } from '@react-navigation/native';

// 1. Khai báo các màn hình có trong Bottom Tab
export type MainTabParamList = {
    Home: { email: string };
    Profile: { email: string };
    Settings: undefined;
};

// 2. Cập nhật lại Stack ban đầu
export type RootStackParamList = {
    Register: undefined;
    Login: undefined;
    // Khai báo 'Main' chứa các màn hình của MainTabParamList
    Main: { email: string };
};