'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { PUBLIC_URL } from '@/config/url.config';

import { buildQuery } from '@/utils/catalogQuery';

export function SearchInput() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const router = useRouter();

    const search = () => {
        const term = searchTerm.trim();

        router.push(PUBLIC_URL.explorer(buildQuery({ searchTerm: term })));
    };

    return (
        <div className='flex items-center relative'>
            <Input
                placeholder='Product search'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
                maxLength={100}
                className='rounded-lg rounded-r-none focus-visible:ring-transparent pr-8'
            />
            <Button
                variant='primary'
                onClick={search}
                aria-label='Search'
                className='rounded-l-none'
            >
                <Search className='size-4' />
            </Button>
        </div>
    );
}
