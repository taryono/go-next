import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    id: string
    email: string
    name: string
    role: string
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email: string, password: string) => {
                set({ isLoading: true })

                try {
                    // Simulasi API call
                    await new Promise(resolve => setTimeout(resolve, 1000))

                    // Validasi sederhana (dalam production gunakan API real)
                    if (email === 'admin@example.com' && password === 'password') {
                        const user: User = {
                            id: '1',
                            email: email,
                            name: 'Admin User',
                            role: 'admin'
                        }

                        set({
                            user,
                            isAuthenticated: true,
                            isLoading: false
                        })
                        return true
                    } else {
                        set({ isLoading: false })
                        return false
                    }
                } catch (error) {
                    set({ isLoading: false })
                    return false
                }
            },

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false
                })
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading })
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
)