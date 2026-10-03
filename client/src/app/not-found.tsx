import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

import { PUBLIC_URL } from '@/config/url.config';

export default function NotFound() {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4'>
            <p className='text-6xl font-bold text-muted-foreground'>404</p>
            <h1 className='text-2xl font-semibold'>Page not found</h1>
            <p className='text-muted-foreground'>
                The page you are looking for does not exist or was removed.
            </p>
            <Link href={PUBLIC_URL.home()} className={buttonVariants()}>
                Back to the shop
            </Link>
        </div>
    );
}
