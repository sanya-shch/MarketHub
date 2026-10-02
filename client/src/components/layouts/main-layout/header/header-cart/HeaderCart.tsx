import { useRouter } from 'next/navigation';

import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { useCart } from '@/hooks/useCart';
import { useProfile } from '@/hooks/useProfile';

import { PUBLIC_URL } from '@/config/url.config';

import { CartItem } from './CartItem';
import { useCheckout } from './useCheckout';
import { formatPrice } from '@/utils/formatPrice';

export function HeaderCart() {
    const { total, items } = useCart();
    const { push } = useRouter();
    const { createPayment, isLoadingCreate } = useCheckout();
    const { profile } = useProfile();

    const handleClick = () => {
        if (profile) createPayment();
        else push(PUBLIC_URL.auth());
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='ghost'>Cart</Button>
            </SheetTrigger>

            <SheetContent className='p-4'>
                <Heading title='Products cart' className='text-xl' />

                <div className='flex flex-col w-full flex-1'>
                    {items.length ? (
                        items.map(item => (
                            <CartItem key={item.id} item={item} />
                        ))
                    ) : (
                        <div className='text-sm text-muted-foreground'>
                            Cart is empty
                        </div>
                    )}
                </div>

                {items.length && (
                    <>
                        <div className='text-lg font-medium'>
                            Total: {formatPrice(total)}
                        </div>

                        <Button
                            variant='primary'
                            onClick={handleClick}
                            disabled={isLoadingCreate}
                            className='w-full'
                        >
                            Go to payment
                        </Button>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
