import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    HomeIcon,
    ChartBarIcon,
    BeakerIcon,
    UsersIcon,
    ShieldCheckIcon,
    BookOpenIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    ChartBarIcon as ChartBarIconSolid,
    BeakerIcon as BeakerIconSolid,
    UsersIcon as UsersIconSolid,
    ShieldCheckIcon as ShieldCheckIconSolid,
    BookOpenIcon as BookOpenIconSolid,
    Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/solid';
import { useTranslation } from '../context/LanguageContext';


// FIX: Use 'as const' to ensure 'navigation' items have literal types for their 'name' properties,
// which is required by the 't' function for type-safe translations.
const navigation = [
    { name: 'dashboard', href: '/dashboard', outline: HomeIcon, solid: HomeIconSolid },
    { name: 'disease_trends', href: '/disease-trends', outline: ChartBarIcon, solid: ChartBarIconSolid },
    { name: 'water_quality', href: '/water-quality', outline: BeakerIcon, solid: BeakerIconSolid },
    { name: 'community_reports', href: '/community-reports', outline: UsersIcon, solid: UsersIconSolid },
    { name: 'interventions', href: '/interventions', outline: ShieldCheckIcon, solid: ShieldCheckIconSolid },
    { name: 'resources', href: '/resources', outline: BookOpenIcon, solid: BookOpenIconSolid },
    { name: 'settings', href: '/settings', outline: Cog6ToothIcon, solid: Cog6ToothIconSolid },
] as const;

// FIX: Corrected the type for the 'item' prop to accept any item from the navigation array, not just the first one.
const NavItem: React.FC<{ item: (typeof navigation)[number], isActive: boolean }> = ({ item, isActive }) => {
    const Icon = isActive ? item.solid : item.outline;
    return <Icon className={`h-6 w-6 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-600 dark:text-gray-400 group-hover/item:text-gray-900 dark:group-hover/item:text-gray-100'}`} />;
};

const Sidebar: React.FC = () => {
    const { t } = useTranslation();

    return (
        <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-[2000] group">
            <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-700">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            `group/item flex cursor-pointer items-center justify-center group-hover:justify-start gap-3 rounded-lg p-3 transition-colors ${
                                isActive ? 'bg-blue-50 dark:bg-blue-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <NavItem item={item} isActive={isActive} />
                                <p className="w-0 overflow-hidden whitespace-nowrap text-sm font-medium leading-normal text-gray-800 dark:text-gray-200 opacity-0 transition-all duration-300 ease-in-out group-hover:w-40 group-hover:opacity-100">
                                    {t(item.name)}
                                </p>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default Sidebar;