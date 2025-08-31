import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {api} from '@/lib/api';
import type { User, RegisterRequest, LoginRequest, AuthResponse, RegisterResponse } from '@/types/auth';
 

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
            login: async (credentials :LoginRequest) => {
                set({ isLoading: true, error: null })

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

                    // Login berhasil
                    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
                    const { token, user, refreshToken } = response.data;
                    if (!response.data.token) {
                        // Handle invalid login response
                        // NextResponse.redirect('/');
                        // Credentials salah
                        set({
                            isLoading: false,
                            error: 'Invalid email or password. Please check your credentials and try again.'
                        })
                        return {
                            success: false,
                            error: 'Invalid email or password. Please check your credentials and try again.'
                        }
                    }else{
                        set({
                            user: user,
                            token: token,
                            refreshToken: refreshToken,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null
                        });
                        return { success: true }
                    }
                     
                } catch (error) {
                    const errorMessage = 'Network error. Please check your internet connection and try again.'
                    set({ isLoading: false, error: errorMessage })
                    return { success: false, error: errorMessage }
                }
            }, 
            register: async (userData: RegisterRequest) => {
                set({isLoading: true, error: null});
                try {
                    const response = await api.post<RegisterResponse>('/api/auth/register', userData);
                    const {token, user} = response.data;
                    if(!response.data.token) {
                        set({
                            error: response.data.message || 'Registration failed',
                            isLoading: false
                        });
                        return { success: false, error: response.data.message || 'Registration failed' };
                    }else{
                        set({
                            user: user,
                            token: token,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null
                        });
                        return { success: true, error: undefined };
                    }
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Registration failed',
                        isLoading: false
                    });
                    return { success: false, error: error.response?.data?.message || 'Registration failed' };
                }
            },
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