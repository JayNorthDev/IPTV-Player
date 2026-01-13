'use client';
import Link from 'next/link';
import { Home, Search, Play } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { GtnLogo } from '@/components/gtn-logo';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="flex h-16 items-center border-b px-4">
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent" asChild>
          <Link href="/" className="flex items-center gap-2">
            <GtnLogo className="w-8 h-8 text-accent" />
            <span className="font-headline text-lg group-data-[collapsible=icon]:hidden">GTNPlay</span>
          </Link>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Home">
              <Link href="/">
                <Home />
                <span className="group-data-[collapsible=icon]:hidden">Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Search">
              <Search />
              <span className="group-data-[collapsible=icon]:hidden">Search</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/player'} tooltip="Player">
              <Link href="/player">
                <Play />
                <span className="group-data-[collapsible=icon]:hidden">Player</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
