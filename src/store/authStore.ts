import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {api} from '@/lib/api';
import type { User, RegisterRequest, LoginRequest, AuthResponse, RegisterResponse } from '@/types/auth';
import { withLoading } from '@/utils/withLoading'

interface AuthState {
    user: User | null;
    user_profile?: User | null;
    token: string | null;
    refreshToken: string | null; // ✅ Tambah ini jika pakai dual token
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    //Actions
     login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
     register: (userData: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
     logout: () => void;
     getProfile: () => Promise<void>; 
     clearError: () => void;
    // ✅ Perbaiki refresh token function
    refreshTokenRequest: () => Promise<void>; // Tidak perlu parameter, ambil dari state
    setTokens: (accessToken: string, refreshToken?: string) => void; // Helper function
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshToken: null, // ✅ Simpan refresh token di state
            isAuthenticated: false,
            isLoading: false,
            error: null,    
            login: async (credentials) =>
                withLoading(set, async () => {
                    try {
                        // Simulasi API call dengan berbagai skenario error
                        await new Promise(resolve => setTimeout(resolve, 1000))

                        // Validasi email format
                        if (!credentials.email.includes('@')) {
                            set({ isLoading: false, error: 'Please enter a valid email address' })
                            return { success: false, error: 'Please enter a valid email address' }
                        }

                        // Validasi password length
                        if (credentials.password.length < 6) {
                            set({ isLoading: false, error: 'Password must be at least 6 characters long' })
                            return { success: false, error: 'Password must be at least 6 characters long' }
                        } 

                        const response = await api.post<AuthResponse>('/api/auth/login', credentials)
                        const { token, user, refreshToken } = response.data
                        if (!token || !user) {
                            set({ error: 'Invalid credentials' })
                            return { success: false, error: 'Invalid credentials' }
                        }
                        set({
                            user,
                            token,
                            refreshToken,
                            isAuthenticated: true,
                            error: null,
                        })
                        return { success: true }
                    } catch (err) {
                        set({ error: 'Login failed' })
                        return { success: false, error: 'Login failed' }
                    }
                }),
            register: async (userData) =>
                withLoading(set, async () => {
                    try {
                        const response = await api.post<RegisterResponse>('/api/auth/register', userData)
                        const { token, user } = response.data
                        if (!token) {
                            set({ error: 'Registration failed' })
                            return { success: false, error: 'Registration failed' }
                        }
                        set({ user, token, isAuthenticated: true, error: null })
                        return { success: true }
                    } catch (err) {
                        set({ error: 'Registration failed' })
                        return { success: false, error: 'Registration failed' }
                    }
                }),
            logout: () => {
                localStorage.removeItem('token');
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null
                }); 
            },
            getProfile: async () => {
                const {token} = get();
                if (!token) {
                    return;
                } 
                try {
                    const response = await api.get('/api/users/profile');
                    set({ user_profile: response.data.user });
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Failed to fetch profile',
                        isLoading: false
                    });
                }
            },
            clearError: () => {
                set({error: null});
            },
            // ✅ Implementasi refresh token yang benar
            refreshTokenRequest: async () => {
                const {refreshToken} = get();
                if (!refreshToken) {
                    get().logout();
                    return;
                }
                try {
                    const response = await api.post<AuthResponse>('/api/auth/refresh', { token: refreshToken });
                    const {token: newAccessToken, refreshToken: newRefreshToken} = response.data;
                    if (!response.data.token) {
                        // Refresh token invalid/expired, logout user
                        get().logout();
                        throw new Error('Session expired');
                    }else{
                        // Optionally update refresh token if provided
                        if(newRefreshToken){
                            set({refreshToken: newRefreshToken});
                        }
                        get().setTokens(newAccessToken, newRefreshToken);
                    }
                } catch (error: any) {
                    get().logout();
                }
            },
            setTokens: (accessToken: string, refreshToken?: string) => {
                set({
                    token: accessToken,
                    refreshToken: refreshToken || get().refreshToken,
                });
            },
            setLoading: (loading: boolean) => {
                set({ isLoading: loading });
            },
        }),
        {
            name: 'tailadmin-auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);