'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Loader } from '@/components/ui/Loader';

import { useProfile } from '@/hooks/useProfile';

import { DASHBOARD_URL } from '@/config/url.config';

import { MobileSidebar } from '../sidebar/MobileSidebar';

import { StoreSwitcher } from './StoreSwitcher';

export function Header() {
    const { profile, isLoading } = useProfile();

    return (
        <div className='p-6 gap-x-4 h-full flex items-center bg-white border-b'>
            <MobileSidebar />

            <div className='flex items-center gap-x-4 ml-auto'>
                {isLoading ? (
                    <Loader size='sm' />
                ) : (
                    profile && (
                        <>
                            <StoreSwitcher items={profile.stores} />

                            <Link href={DASHBOARD_URL.home()}>
                                <Image
                                    className='rounded-full'
                                    src={profile?.picture || ''}
                                    alt={profile?.name || ''}
                                    width={42}
                                    height={42}
                                />
                            </Link>
                        </>
                    )
                )}
            </div>
        </div>
    );
}
