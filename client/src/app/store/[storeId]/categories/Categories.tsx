'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/DataTable';
import { DataTableLoading } from '@/components/ui/data-table/DataTableLoading';

import { useGetCategories } from '@/hooks/queries/categories/useGetCategories';

import { STORE_URL } from '@/config/url.config';

import { ICategoryColumn, categoryColumns } from './CategoryColumns';
import { formatDate } from '@/utils/formatDate';

export const Categories = () => {
    const params = useParams<{ storeId: string }>();
    const { categories, isLoading } = useGetCategories();

    const formattedCategories: ICategoryColumn[] = categories
        ? categories.map(category => ({
              id: category.id,
              title: category.title,
              createdAt: formatDate(category.createdAt),
              storeId: category.storeId,
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
                            title={`Categories (${categories?.length})`}
                            description='All categories of your store'
                        />

                        <div className='flex items-center gap-x-4'>
                            <Link
                                href={STORE_URL.categoryCreate(params.storeId)}
                            >
                                <Button variant='primary'>
                                    <Plus className='size-4 mr-2' />
                                    Create
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className='mt-3'>
                        <DataTable
                            columns={categoryColumns}
                            data={formattedCategories}
                            filterKey='name'
                        />
                    </div>
                </>
            )}
        </div>
    );
};
