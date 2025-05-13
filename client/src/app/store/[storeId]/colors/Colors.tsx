'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/DataTable';
import { DataTableLoading } from '@/components/ui/data-table/DataTableLoading';

import { useGetColors } from '@/hooks/queries/colors/useGetColors';

import { IColor } from '@/shared/types/color.interface';

import { STORE_URL } from '@/config/url.config';

import { colorColumns } from './ColorColumns';
import { formatDate } from '@/utils/formatDate';

export const Colors = () => {
    const params = useParams<{ storeId: string }>();
    const { colors, isLoading } = useGetColors();

    const formattedColors: IColor[] = colors
        ? colors.map(color => ({
              id: color.id,
              name: color.name,
              createdAt: formatDate(color.createdAt),
              value: color.value,
              storeId: color.storeId,
          }))
        : [];

    return (
        <div className='p-6'>
            {isLoading ? (
                <DataTableLoading />
            ) : (
                <>
                    <div className='flex items-center justify-between'>
                        <Heading
                            title={`Colors (${colors?.length})`}
                            description='All colors of your store'
                        />

                        <div className='flex items-center gap-x-4'>
                            <Link href={STORE_URL.colorCreate(params.storeId)}>
                                <Button variant='primary'>
                                    <Plus className='size-4 mr-2' />
                                    Create
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className='mt-3'>
                        <DataTable
                            columns={colorColumns}
                            data={formattedColors}
                            filterKey='name'
                        />
                    </div>
                </>
            )}
        </div>
    );
};
