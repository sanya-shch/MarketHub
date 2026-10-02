import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

import { Button } from '@/components/ui/button';

import { useProfile } from '@/hooks/useProfile';

import { userService } from '@/services/user.service';

import { IProduct } from '@/shared/types/product.interface';

interface FavoriteButtonProps {
    product: IProduct;
}

export function FavoriteButton({ product }: FavoriteButtonProps) {
    const { profile } = useProfile();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationKey: ['toggle favorite'],
        mutationFn: () => userService.toggleFavorite(product.id),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['profile'],
            });
        },
    });

    if (!profile) return null;

    const isExist = profile.favorites.some(
        favorite => favorite.id === product.id,
    );

    return (
        <Button
            variant='secondary'
            size='icon'
            onClick={() => mutate()}
            disabled={isPending}
        >
            {isExist ? (
                <AiFillHeart color='#f43f5e' className='size-5' />
            ) : (
                <AiOutlineHeart className='size-5' />
            )}
        </Button>
    );
}
