'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import { IMenuItem } from './menu.interface';

interface MenuItemProps {
    item: IMenuItem;
}

export const MenuItem = ({ item }: MenuItemProps) => {
    const pathname = usePathname();

    return (
        <Link
            href={item.link}
            className={cn(
                'flex items-center gap-x-3 text-slate-500 text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-blue-200/20 hover:text-blue-500 hover:drop-shadow-sm bg-transparent transition-all duration-200',
                {
                    'text-sm text-blue-500 bg-blue-200/20 hover:bg-blue-200/20 hover:text0blue-500':
                        pathname === item.link,
                },
            )}
        >
            <item.icon className='size-5' />
            {item.value}
        </Link>
    );
};
