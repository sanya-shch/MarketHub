import { Plus, Trash } from 'lucide-react';
import Image from 'next/image';
import { Rating } from 'react-simple-star-rating';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { ReviewModal } from '@/components/modals/ReviewModal';
import { Button } from '@/components/ui/button';

import { useDeleteReview } from '@/hooks/queries/reviews/useDeleteReview';
import { useProfile } from '@/hooks/useProfile';

import { IProduct } from '@/shared/types/product.interface';

interface ProductReviewsProps {
    product: IProduct;
}

export const ProductReviews = ({ product }: ProductReviewsProps) => {
    const { profile } = useProfile();
    const { deleteReview } = useDeleteReview();

    return (
        <>
            <div className='flex justify-between items-center mt-2'>
                <h1 className='text-2xl font-bold'>Reviews</h1>
                {profile && (
                    <ReviewModal storeId={product.storeId}>
                        <Button variant='ghost'>
                            <Plus className='size-4 mr-2' />
                            Add review
                        </Button>
                    </ReviewModal>
                )}
            </div>

            <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4'>
                {product.reviews.length ? (
                    product.reviews.map(review => (
                        <div key={review.id} className='border rounded-lg p-4'>
                            <div className='flex justify-between'>
                                <div className='flex items-center gap-x-4 font-medium'>
                                    <Image
                                        src={review.user.picture}
                                        alt={review.user.name}
                                        width={40}
                                        height={40}
                                        className='rounded-full'
                                    />
                                    {review.user.name}
                                </div>

                                {review.user.id === profile?.id && (
                                    <ConfirmModal
                                        handleClick={() =>
                                            deleteReview(review.id)
                                        }
                                    >
                                        <button className='-mt-3 text-red-500'>
                                            <Trash className='size-5' />
                                        </button>
                                    </ConfirmModal>
                                )}
                            </div>

                            <Rating
                                initialValue={review.rating}
                                SVGstyle={{ display: 'inline-block' }}
                                size={18}
                                readonly
                                allowFraction
                                transition
                            />

                            <div className='text-sm text-muted-foreground mt-1'>
                                {review.text}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='mt-4'>This product has no reviews</div>
                )}
            </div>
        </>
    );
};
