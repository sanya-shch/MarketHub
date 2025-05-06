import { ICategory, ICategoryInput } from '@/shared/types/category.interface';

import { API_URL } from '@/config/api.config';

import { axiosClassic, axiosWithAuth } from '@/api/api.interceptors';

class CategoryService {
    async getByStoreId(id: string) {
        const { data } = await axiosWithAuth<ICategory[]>({
            url: API_URL.categories(`/by-storeId/${id}`),
            method: 'GET',
        });

        return data;
    }

    async getById(id: string) {
        const { data } = await axiosClassic<ICategory[]>({
            url: API_URL.categories(`/by-id/${id}`),
            method: 'GET',
        });

        return data;
    }

    async create(data: ICategoryInput, storeId: string) {
        const { data: createdCategory } = await axiosWithAuth<ICategory[]>({
            url: API_URL.categories(`/${storeId}`),
            method: 'POST',
            data,
        });

        return createdCategory;
    }

    async update(data: ICategoryInput, storeId: string) {
        const { data: updatedCategory } = await axiosWithAuth<ICategory[]>({
            url: API_URL.categories(`/${storeId}`),
            method: 'PUT',
            data,
        });

        return updatedCategory;
    }

    async delete(storeId: string) {
        const { data: deletedCategory } = await axiosWithAuth<ICategory[]>({
            url: API_URL.categories(`/${storeId}`),
            method: 'DELETE',
        });

        return deletedCategory;
    }
}

export const categoryService = new CategoryService();
