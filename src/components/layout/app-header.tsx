'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:justify-end">
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
                <User />
                <span className="sr-only">Profile</span>
            </Button>
        </div>
    </header>
  );
}
