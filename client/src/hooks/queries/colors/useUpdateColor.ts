import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

import { colorService } from '@/services/color.service';

import { IColorInput } from '@/shared/types/color.interface';

import { STORE_URL } from '@/config/url.config';

export const useUpdateColor = () => {
    const params = useParams<{ storeId: string; colorId: string }>();
    const { push } = useRouter();
    const queryClient = useQueryClient();

    const { mutate: updateColor, isPending: isLoadingUpdate } = useMutation({
        mutationKey: ['update color'],
        mutationFn: (data: IColorInput) =>
            colorService.update(data, params.colorId),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['get colors for store dashboard'],
            });

            toast.success('Color updated');

            push(STORE_URL.colors(params.storeId));
        },
        onError() {
            toast.error('Error updating color');
        },
    });

    return useMemo(
        () => ({
            updateColor,
            isLoadingUpdate,
        }),
        [updateColor, isLoadingUpdate],
    );
};
