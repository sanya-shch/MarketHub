import {
    IMainStatistics,
    IMiddleStatistics,
} from '@/shared/types/statistics.interface';

import { API_URL } from '@/config/api.config';

import { axiosWithAuth } from '@/api/api.interceptors';

class StatisticsService {
    async getMain(storeId: string) {
        const { data } = await axiosWithAuth<IMainStatistics[]>({
            url: API_URL.statistics(`/main/${storeId}`),
            method: 'GET',
        });

        return data;
    }

    async getMiddle(storeId: string) {
        const { data: createdStore } = await axiosWithAuth<IMiddleStatistics>({
            url: API_URL.statistics(`/middle/${storeId}`),
            method: 'GET',
        });

        return createdStore;
    }
}

export const statisticsService = new StatisticsService();
