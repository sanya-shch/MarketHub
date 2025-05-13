'use client';

import { Heading } from '@/components/ui/Heading';
import { DataTable } from '@/components/ui/data-table/DataTable';
import { DataTableLoading } from '@/components/ui/data-table/DataTableLoading';

import { useGetReviews } from '@/hooks/queries/reviews/useGetReviews';

import { IReviewColumn, reviewColumns } from './ReviewColumns';
import { formatDate } from '@/utils/formatDate';

export const Reviews = () => {
    const { reviews, isLoading } = useGetReviews();

    const formattedReviews: IReviewColumn[] = reviews
        ? reviews.map(review => ({
              id: review.id,
              username: review.user.name,
              rating: Array.from({ length: review.rating })
                  .map(() => '⭐')
                  .join(' '),
              createdAt: formatDate(review.createdAt),
          }))
        : [];

    return (
        <div className='p-6'>
            {isLoading ? (
                <DataTableLoading />
            ) : (
                <>
                    <div className='flex items-center justify-between'>
                        <Heading
                            title={`Reviews (${reviews?.length})`}
                            description='All reviews of your store'
                        />
                    </div>

                    <div className='mt-3'>
                        <DataTable
                            columns={reviewColumns}
                            data={formattedReviews}
                        />
                    </div>
                </>
            )}
        </div>
    );
};
