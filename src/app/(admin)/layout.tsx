'use client'

import AppHeader from '@/layout/AppHeader'
import AppSidebar from '@/layout/AppSidebar'
import { SidebarProvider, useSidebar } from '@/context/SidebarContext'
import { ThemeProvider } from '@/context/ThemeContext' 
import Backdrop from "@/layout/Backdrop";
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
  const { isExpanded, isHovered, isMobileOpen, sidebarOpen } = useSidebar();
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      ></div>
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