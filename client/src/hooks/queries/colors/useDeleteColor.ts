import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

import { colorService } from '@/services/color.service';

import { STORE_URL } from '@/config/url.config';

export const useDeleteColor = () => {
    const params = useParams<{ storeId: string; colorId: string }>();
    const { push } = useRouter();
    const queryClient = useQueryClient();

    const { mutate: deleteColor, isPending: isLoadingDelete } = useMutation({
        mutationKey: ['delete color'],
        mutationFn: () => colorService.delete(params.colorId),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['get colors for store dashboard'],
            });

            toast.success('Color deleted');

            push(STORE_URL.colors(params.storeId));
        },
        onError() {
            toast.error('Error deleting color');
        },
    });

    return useMemo(
        () => ({
            deleteColor,
            isLoadingDelete,
        }),
        [deleteColor, isLoadingDelete],
    );
};
