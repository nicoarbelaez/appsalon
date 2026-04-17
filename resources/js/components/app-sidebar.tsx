import { Link, usePage } from '@inertiajs/react';
import { CalendarDays, LayoutGrid, Scissors, Settings2, ShieldCheck } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const clientNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Mis citas',
        href: '/citas',
        icon: CalendarDays,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Mis citas',
        href: '/citas',
        icon: CalendarDays,
    },
    {
        title: 'Admin: Panel',
        href: '/admin',
        icon: ShieldCheck,
    },
    {
        title: 'Admin: Servicios',
        href: '/admin/servicios',
        icon: Scissors,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as { auth: { isAdmin: boolean } };

    const navItems = auth.isAdmin ? adminNavItems : clientNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
