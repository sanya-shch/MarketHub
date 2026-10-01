'use client';

import { useMutation } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/DataTable';

import { useProfile } from '@/hooks/useProfile';

import { authService } from '@/services/auth/auth.service';

import { OrderStatus } from '@/shared/types/order.interface';

import { IOrderColumn, orderColumns } from './OrderColumns';
import { formatDate } from '@/utils/formatDate';
import { formatPrice } from '@/utils/formatPrice';

export function Dashboard() {
    const router = useRouter();
    // After Google login there is no access token in the URL anymore: the first
    // request gets a 401 and the axios interceptor obtains a token through the
    // refresh-token cookie.
    const { profile } = useProfile();

    const { mutate: logout } = useMutation({
        mutationKey: ['logout'],
        mutationFn: () => authService.logout(),
        onSuccess: () => router.push('/auth'),
    });

    if (!profile) return null;

    const formattedOrders: IOrderColumn[] = profile.orders.map(order => ({
        createdAt: formatDate(order.createdAt),
        status: order.status === OrderStatus.PENDING ? 'Pending' : 'Payed',
        total: formatPrice(order.total),
    }));

    return (
        <div className='my-6'>
            <div className='flex items-center justify-between mb-4'>
                <h1 className='text-2xl font-bold'>Your orders</h1>
                <Button variant='ghost' onClick={() => logout()}>
                    <LogOut className='size-4 mr-2' />
                    LogOut
                </Button>
            </div>

            <DataTable columns={orderColumns} data={formattedOrders} />
        </div>
    );
}
