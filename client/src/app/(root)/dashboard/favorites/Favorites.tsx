'use client';

import { Catalog } from '@/components/ui/catalog/Catalog';

import { useProfile } from '@/hooks/useProfile';

export function Favorites() {
    const { profile } = useProfile();

    if (!profile) return null;

    return (
        <div className='my-6'>
            <Catalog title='Favorites' products={profile.favorites} />
        </div>
    );
}
