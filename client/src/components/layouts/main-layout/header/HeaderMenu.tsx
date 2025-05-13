'use client';

import { LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { CreateStoreModal } from '@/components/modals/CreateStoreModal';
import { Loader } from '@/components/ui/Loader';
import { Button } from '@/components/ui/button';

import { useProfile } from '@/hooks/useProfile';

import { DASHBOARD_URL, PUBLIC_URL, STORE_URL } from '@/config/url.config';

import { HeaderCart } from './header-cart/HeaderCart';

export function HeaderMenu() {
    const { profile, isLoading } = useProfile();

    return (
        <div className='hidden items-center gap-x-2 ml-auto lg:flex'>
            <HeaderCart />

            <Link href={PUBLIC_URL.explorer()}>
                <Button variant='ghost'>Catalog</Button>
            </Link>

            {isLoading ? (
                <Loader size='sm' />
            ) : profile ? (
                <>
                    <Link href={DASHBOARD_URL.favorites()}>
                        <Button variant='ghost'>Favorites</Button>
                    </Link>

                    {profile.stores.length ? (
                        <Link href={STORE_URL.home(profile.stores[0].id)}>
                            <Button variant='ghost'>My stores</Button>
                        </Link>
                    ) : (
                        <CreateStoreModal>
                            <Button variant='ghost'>Create store</Button>
                        </CreateStoreModal>
                    )}

                    <Link href={DASHBOARD_URL.home()}>
                        <Image
                            src={profile.picture}
                            alt={profile.name}
                            width={42}
                            height={42}
                            className='rounded-full'
                        />
                    </Link>
                </>
            ) : (
                <Link href={PUBLIC_URL.auth()}>
                    <Button variant='primary'>
                        <LogOut className='size-4 mr-2' /> Log In
                    </Button>
                </Link>
            )}
        </div>
    );
}
