import { ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { NO_INDEX_PAGE } from '@/constants/seo.constants';

import { PUBLIC_URL } from '@/config/url.config';

export const metadata: Metadata = {
    title: 'Thank you for your purchase',
    ...NO_INDEX_PAGE,
};

export default function Page() {
    return (
        <div className='my-24 py-20 mx-auto text-center flex flex-col items-center max-w-4xl space-y-6'>
            <h1 className='text-4xl font-bold tracking-tight md:text-5xl'>
                Thank you for your purchase
            </h1>

            <p className='text-lg text-muted-foreground'>
                Thank you for your order, we appreciate your trust and will do
                our best to deliver your order as soon as possible.
            </p>

            <Link href={PUBLIC_URL.home()}>
                <Button variant='primary' className='hover:ml-3'>
                    To the main page{' '}
                    <ArrowRight className='size-4 ml-2 transition-all' />
                </Button>
            </Link>
        </div>
    );
}
