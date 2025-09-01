'use client'

import AppHeader from '@/layout/AppHeader'
import AppSidebar from '@/layout/AppSidebar'
import { SidebarProvider, useSidebar } from '@/context/SidebarContext'
import { ThemeProvider } from '@/context/ThemeContext' 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {   
  return (
    <ThemeProvider>
      <SidebarProvider> 
          <InnerLayout>{children}</InnerLayout> 
      </SidebarProvider>
    </ThemeProvider>
  )
}


function InnerLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useSidebar()

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AppHeader sidebarOpen={sidebarOpen} />

        {/* Page Content */}
        <main className={`${sidebarOpen ? 'ml-64' : 'ml-20'}  flex-1 overflow-auto p-4 sm:p-6 lg:p-8`}>
          {children}
        </main>
      </div>
    </div>
  )
}