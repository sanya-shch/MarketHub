import type { ICartItem } from '@/shared/types/cart.interface';

export interface ICartInitialState {
    items: ICartItem[];
}

export type IAddToCartPayload = Omit<ICartItem, 'id'>;

export interface IChangeQuantityPayload extends Pick<ICartItem, 'id'> {
    type: 'minus' | 'plus';
}
