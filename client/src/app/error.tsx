'use client';

import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';

import { PUBLIC_URL } from '@/config/url.config';

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4'>
            <h1 className='text-2xl font-semibold'>Something went wrong</h1>
            <p className='text-muted-foreground'>
                The page could not be loaded. Please try again.
            </p>

            {error.digest && (
                <p className='text-xs text-muted-foreground'>
                    Error ID: {error.digest}
                </p>
            )}

            <div className='flex gap-3'>
                <Button onClick={reset}>Try again</Button>
                <Link
                    href={PUBLIC_URL.home()}
                    className={buttonVariants({ variant: 'outline' })}
                >
                    Back to the shop
                </Link>
            </div>
        </div>
    );
}
