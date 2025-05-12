import { FC } from 'react';

import { Loader } from '../Loader';
import { Card, CardContent } from '../card';
import { Skeleton } from '../skeleton';

export const DataTableLoading: FC = () => (
    <div className='max-w-screen-2xl mx-auto w-full'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-8 w-72 mt-6' />
        <Card className='mt-6'>
            <CardContent>
                <div className='lh-[520px] w-full flex items-center justify-center'>
                    <Loader />
                </div>
            </CardContent>
        </Card>
    </div>
);
