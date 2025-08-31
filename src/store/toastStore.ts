// src/store/toastStore.ts
import { create } from 'zustand'

interface Toast {
    id: string
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    duration?: number
}

interface ToastState {
    toasts: Toast[]
    addToast: (toast: Omit<Toast, 'id'>) => void
    removeToast: (id: string) => void
    clearToasts: () => void
}

export const useToastStore = create<ToastState>((set, get) => ({
    toasts: [],

    addToast: (toast) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newToast = { ...toast, id }

        set(state => ({
            toasts: [...state.toasts, newToast]
        }))

        // Auto remove after duration
        setTimeout(() => {
            get().removeToast(id)
        }, toast.duration || 5000)
    },

    removeToast: (id) => {
        set(state => ({
            toasts: state.toasts.filter(toast => toast.id !== id)
        }))
    },

    clearToasts: () => {
        set({ toasts: [] })
    }
}))