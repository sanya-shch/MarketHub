'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { PUBLIC_URL } from '@/config/url.config';

export function SearchInput() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const router = useRouter();

    return (
        <div className='flex items-center relative'>
            <Input
                placeholder='Product search'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='rounded-lg rounded-r-none focus-visible:ring-transparent pr-8'
            />
            <Button
                variant='primary'
                onClick={() =>
                    router.push(
                        PUBLIC_URL.explorer(`?searchTerm=${searchTerm}`),
                    )
                }
                className='rounded-l-none'
            >
                <Search className='size-4' />
            </Button>
        </div>
    );
}
