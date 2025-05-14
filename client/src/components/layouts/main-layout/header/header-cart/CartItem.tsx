import Image from 'next/image';
import Link from 'next/link';

import { ICartItem } from '@/shared/types/cart.interface';

import { PUBLIC_URL } from '@/config/url.config';

import { CartActions } from './CartActions';
import { formatPrice } from '@/utils/formatPrice';

interface CartItemProps {
    item: ICartItem;
}

export const CartItem = ({ item }: CartItemProps) => {
    return (
        <div className='flex items-center mb-5'>
            <Link
                href={PUBLIC_URL.product(item.product.id)}
                className='relative h-28 w-28 rounded-md overflow-hidden'
            >
                <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    fill
                    className='object-cover'
                />
            </Link>

            <div className='ml-6'>
                <h2 className='font-medium line-clamp-1'>
                    {item.product.title}
                </h2>

                <p className='text-sm text-muted-foreground mt-1'>
                    {formatPrice(item.product.price)}
                </p>

                <CartActions item={item} />
            </div>
        </div>
    );
};
