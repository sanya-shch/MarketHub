import { IColor, IColorInput } from '@/shared/types/color.interface';

import { API_URL } from '@/config/api.config';

import { axiosClassic, axiosWithAuth } from '@/api/api.interceptors';

class ColorService {
    async getByStoreId(id: string) {
        const { data } = await axiosWithAuth<IColor[]>({
            url: API_URL.colors(`/by-storeId/${id}`),
            method: 'GET',
        });

        return data || [];
    }

    async getById(id: string) {
        const { data } = await axiosClassic<IColor[]>({
            url: API_URL.colors(`/by-id/${id}`),
            method: 'GET',
        });

        return data || [];
    }

    async create(data: IColorInput, storeId: string) {
        const { data: createdColor } = await axiosWithAuth<IColor[]>({
            url: API_URL.colors(`/${storeId}`),
            method: 'POST',
            data,
        });

        return createdColor;
    }

    async update(data: IColorInput, storeId: string) {
        const { data: updatedColor } = await axiosWithAuth<IColor[]>({
            url: API_URL.colors(`/${storeId}`),
            method: 'PUT',
            data,
        });

        return updatedColor;
    }

    async delete(storeId: string) {
        const { data: deletedColor } = await axiosWithAuth<IColor[]>({
            url: API_URL.colors(`/${storeId}`),
            method: 'DELETE',
        });

        return deletedColor;
    }
}

export const colorService = new ColorService();
