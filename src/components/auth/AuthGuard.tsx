'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

interface AuthGuardProps {
    children: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { isAuthenticated, isLoading, setLoading } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()

    // Public routes yang tidak perlu authentication
    const publicRoutes = ['/signin', '/signup', '/error-404']
    const isPublicRoute = publicRoutes.includes(pathname)

    useEffect(() => {
        // Set loading false setelah hydration
        setLoading(false)

        // Redirect logic
        if (!isLoading) {
            if (!isAuthenticated && !isPublicRoute) {
                // User belum login dan mengakses protected route
                router.push('/signin')
            } else if (isAuthenticated && (pathname === '/signin' || pathname === '/signup')) {
                // User sudah login tapi mengakses login/signup page
                router.push('/')
            }
        }
    }, [isAuthenticated, isLoading, pathname, router, setLoading, isPublicRoute])

    // Show loading spinner saat checking authentication
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        )
    }

    // Render children jika sudah authenticated atau di public route
    if (isAuthenticated || isPublicRoute) {
        return <>{children}</>
    }

    // Return null saat redirecting
    return null
}

export default AuthGuard