import { Skeleton } from '@/components/ui/skeleton';

/** Shown while a server-rendered page of the shop (catalog, category, product) loads. */
export default function Loading() {
    return (
        <div className='my-6' aria-busy='true' aria-label='Loading'>
            <Skeleton className='h-8 w-64 mb-6' />

            <div className='grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-8'>
                {Array.from({ length: 6 }, (_, index) => (
                    <div key={index} className='space-y-3'>
                        <Skeleton className='aspect-square w-full' />
                        <Skeleton className='h-4 w-3/4' />
                        <Skeleton className='h-4 w-1/3' />
                    </div>
                ))}
            </div>
        </div>
    );
}
