'use client';
import Link from 'next/link';
import { Home, Menu, Search } from 'lucide-react';
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
      <SidebarHeader>
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
            <Link href="/" legacyBehavior passHref>
              <SidebarMenuButton isActive={pathname === '/'} tooltip="Home">
                <Home />
                <span className="group-data-[collapsible=icon]:hidden">Home</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Search">
              <Search />
              <span className="group-data-[collapsible=icon]:hidden">Search</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Menu">
              <Menu />
              <span className="group-data-[collapsible=icon]:hidden">Menu</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
