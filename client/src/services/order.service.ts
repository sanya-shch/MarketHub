import { API_URL } from '@/config/api.config';

import { axiosWithAuth } from '@/api/api.interceptors';

// Price, store and status are not sent: the server takes them from the DB.
type TypeData = {
    items: {
        productId: string;
        quantity: number;
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
