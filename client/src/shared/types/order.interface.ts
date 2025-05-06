import { ICartItem } from './cart.interface';
import { IUser } from './user.interface';

export enum OrderStatus {
    PENDING = 'PENDING',
    PAYED = 'PAYED',
}

export interface IOrder {
    id: string;
    total: number;
    user: IUser;
    items: ICartItem[];
    status: OrderStatus;
    createdAt: string;
}
