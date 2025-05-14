import { Button } from '@/components/ui/button';

import { IProduct } from '@/shared/types/product.interface';

interface AddToCartButtonProps {
    product: IProduct;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    return (
        <Button variant='primary' size='lg' className='w-full'>
            Add to cart
        </Button>
    );
}
