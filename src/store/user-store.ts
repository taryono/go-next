import { create } from 'zustand';
import { api } from '@/lib/api';
import type { User } from '@/types/auth';

interface UserState {
    users: User[];
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;

    fetchUsers: () => Promise<void>;
    updateProfile: (email: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    isLoading: false,
    isAuthenticated: false,
    error: null,

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/users'); 
            set({ users: response.data.users, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Failed to fetch users',
                isLoading: false
            });
        }
    },

    updateProfile: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put('/profile', { email });
            // Update user di auth store juga
            const { useAuthStore } = await import('../store/authStore');
            useAuthStore.getState().user && useAuthStore.setState({
                user: response.data.user
            });
            set({ isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Failed to update profile',
                isLoading: false
            });
        }
    },
}));