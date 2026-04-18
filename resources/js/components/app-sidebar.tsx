import { Link, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    ClipboardList,
    Clock,
    LayoutGrid,
    Scissors,
    ShieldCheck,
    Users,
} from 'lucide-react';
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

const funcionarioNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Agenda de citas',
        href: '/funcionario/citas',
        icon: ClipboardList,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Agenda de citas',
        href: '/funcionario/citas',
        icon: ClipboardList,
    },
    {
        title: 'Panel',
        href: '/admin',
        icon: ShieldCheck,
    },
    {
        title: 'Horarios',
        href: '/admin/horarios',
        icon: Clock,
    },
    {
        title: 'Servicios',
        href: '/admin/servicios',
        icon: Scissors,
    },
    {
        title: 'Usuarios',
        href: '/admin/usuarios',
        icon: Users,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as unknown as {
        auth: { isAdmin: boolean; user: { rol?: string } };
    };

    let navItems: NavItem[];
    if (auth.isAdmin) {
        navItems = adminNavItems;
    } else if (auth.user?.rol === 'funcionario') {
        navItems = funcionarioNavItems;
    } else {
        navItems = clientNavItems;
    }

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
