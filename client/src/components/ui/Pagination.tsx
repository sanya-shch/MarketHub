import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

import { cn } from '@/lib/utils';

interface PaginationProps {
    page: number;
    totalPages: number;
    /** Builds the link of another page, e.g. `p => '/explorer?page=' + p` */
    getHref: (page: number) => string;
}

const linkClass = buttonVariants({ variant: 'outline', size: 'sm' });
const disabledClass = cn(linkClass, 'pointer-events-none opacity-50');

/** Server-rendered (plain links), so it works without client JavaScript. */
export function Pagination({ page, totalPages, getHref }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <nav
            aria-label='Pagination'
            className='mt-8 flex items-center justify-center gap-4'
        >
            {page > 1 ? (
                <Link href={getHref(page - 1)} className={linkClass} rel='prev'>
                    <ChevronLeft /> Previous
                </Link>
            ) : (
                <span aria-disabled className={disabledClass}>
                    <ChevronLeft /> Previous
                </span>
            )}

            <span className='text-sm text-muted-foreground'>
                Page {page} of {totalPages}
            </span>

            {page < totalPages ? (
                <Link href={getHref(page + 1)} className={linkClass} rel='next'>
                    Next <ChevronRight />
                </Link>
            ) : (
                <span aria-disabled className={disabledClass}>
                    Next <ChevronRight />
                </span>
            )}
        </nav>
    );
}
