import { IUser } from '@/shared/types/user.interface';

import { API_URL } from '@/config/api.config';

import { axiosWithAuth } from '@/api/api.interceptors';

class UserService {
    async getProfile() {
        const { data } = await axiosWithAuth<IUser>({
            url: API_URL.users('/profile'),
            method: 'GET',
        });

        return data;
    }

    async toggleFavorite(id: string) {
        return axiosWithAuth<IUser>({
            url: API_URL.users(`/profile/favorites/${id}`),
            method: 'PATCH',
        });
    }
}

export const userService = new UserService();
