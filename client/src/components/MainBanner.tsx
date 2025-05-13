import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { SITE_DESCRIPTION } from '@/constants/seo.constants';

import { PUBLIC_URL } from '@/config/url.config';

export const MainBanner = () => {
    return (
        <div className='my-24 py-20 mx-auto text-center flex flex-col items-center max-w-4xl space-y-6'>
            <h1 className='text-4xl font-bold tracking-tight md:text-5xl'>
                Your shopping, your pleasure -{' '}
                <span className='text-blue-600'>all in one place</span>
            </h1>

            <p className='text-lg text-muted-foreground'>{SITE_DESCRIPTION}</p>

            <Link href={PUBLIC_URL.explorer()}>
                <Button className='hover:ml-3'>
                    Let's go shopping{' '}
                    <ArrowRight className='size-4 ml-2 transition-all' />
                </Button>
            </Link>
        </div>
    );
};
