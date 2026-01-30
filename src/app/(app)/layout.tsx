"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';
import { BookHeart, BarChart3, Award, Bot, LogOut, Smile, LifeBuoy } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Diary', icon: BookHeart },
    { href: '/history', label: 'History', icon: BarChart3 },
    { href: '/achievements', label: 'Achievements', icon: Award },
    { href: '/chat', label: 'AI Chat', icon: Bot },
    { href: '/mood-detector', label: 'Mood Detector', icon: Smile },
    { href: '/resources', label: 'Resources', icon: LifeBuoy },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <h2 className="text-xl font-headline font-semibold tracking-tight">Mood Mapper</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right' }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton asChild tooltip={{ children: 'Change Theme', side: 'right' }}>
            <Link href="/">
              <LogOut />
              <span>Change Theme</span>
            </Link>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-6 md:hidden">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
                <Logo className="h-8 w-8" />
                <h2 className="text-xl font-headline font-semibold tracking-tight">Mood Mapper</h2>
            </div>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
