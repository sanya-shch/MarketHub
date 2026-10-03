import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { Pagination } from '@/components/ui/Pagination';
import { Catalog } from '@/components/ui/catalog/Catalog';
import { SortSelect } from '@/components/ui/catalog/SortSelect';

import { categoryService } from '@/services/category.service';
import { productService } from '@/services/product.service';

import { PUBLIC_URL } from '@/config/url.config';

import { buildQuery, parseCatalogParams } from '@/utils/catalogQuery';

type PageProps = {
    params: Promise<{ id: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// `cache` dedupes the calls from generateMetadata and the page (one request)
const getCategory = cache((id: string) => categoryService.getById(id));

export async function generateMetadata({
    params,
}: Pick<PageProps, 'params'>): Promise<Metadata> {
    const { id } = await params;
    const category = await getCategory(id);

    return {
        title: category.title,
        description: category.description,
    };
}

export default async function CategoryPage({
    params,
    searchParams,
}: PageProps) {
    const { id } = await params;
    const { sort, page } = parseCatalogParams(await searchParams);

    const [category, { items, meta }] = await Promise.all([
        getCategory(id),
        productService.getAll({ categoryId: id, sort, page }),
    ]);

    const getHref = (target: number) =>
        PUBLIC_URL.category(
            `${id}${buildQuery({
                sort: sort === 'newest' ? undefined : sort,
                page: target > 1 ? target : undefined,
            })}`,
        );

    if (meta.totalPages > 0 && page > meta.totalPages) {
        redirect(getHref(meta.totalPages));
    }

    return (
        <div className='my-6'>
            <div className='mb-4 flex justify-end'>
                <SortSelect value={sort} />
            </div>

            <Catalog
                title={category.title}
                description={category.description}
                products={items}
            />

            <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                getHref={getHref}
            />
        </div>
    );
}
