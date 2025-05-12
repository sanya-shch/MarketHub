'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/DataTable';
import { DataTableLoading } from '@/components/ui/data-table/DataTableLoading';

import { useGetProducts } from '@/hooks/queries/products/useGetProducts';

import { STORE_URL } from '@/config/url.config';

import { IProductColumn, productColumns } from './ProductColumns';
import { formatPrice } from '@/utils/formatPrice';

export const Products = () => {
    const params = useParams<{ storeId: string }>();
    const { products, isLoading } = useGetProducts();

    const formattedProducts: IProductColumn[] = products
        ? products.map(product => ({
              id: product.id,
              title: product.title,
              price: formatPrice(product.price),
              category: product.category.title,
              color: product.color.value,
              storeId: product.storeId,
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
                            title={`Products (${products?.length})`}
                            description='All products of your store'
                        />

                        <div className='flex items-center gap-x-4'>
                            <Link
                                href={STORE_URL.productsCreate(params.storeId)}
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
                            columns={productColumns}
                            data={formattedProducts}
                            filterKey='title'
                        />
                    </div>
                </>
            )}
        </div>
    );
};
