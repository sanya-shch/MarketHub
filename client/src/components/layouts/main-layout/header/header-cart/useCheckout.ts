import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

import { useActions } from '@/hooks/useActions';
import { useCart } from '@/hooks/useCart';

import { orderService } from '@/services/order.service';

import { PUBLIC_URL } from '@/config/url.config';

export const useCheckout = () => {
    const { items } = useCart();
    const { reset } = useActions();
    const { push } = useRouter();

    const { mutate: createPayment, isPending: isLoadingCreate } = useMutation({
        mutationKey: ['create order and payment'],
        mutationFn: () =>
            orderService.place({
                items: items.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
            }),
        onSuccess() {
            reset();
            push(PUBLIC_URL.thanks());
        },
        onError() {
            toast.error('Error creating payment');
        },
    });

    return useMemo(
        () => ({
            createPayment,
            isLoadingCreate,
        }),
        [createPayment, isLoadingCreate],
    );
};
