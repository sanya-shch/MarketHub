import { OrderStatus } from '@/shared/types/order.interface';

import { API_URL } from '@/config/api.config';

import { axiosWithAuth } from '@/api/api.interceptors';

type TypeData = {
    status?: OrderStatus;
    items: {
        quantity: number;
        price: number;
        productId: string;
        storeId: string;
    }[];
};

class OrderService {
    async place(data: TypeData) {
        return axiosWithAuth({
            url: API_URL.orders('/place'),
            method: 'POST',
            data,
        });
    }
}

export const orderService = new OrderService();
