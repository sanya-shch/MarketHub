import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { Pagination } from '@/components/ui/Pagination';
import { Catalog } from '@/components/ui/catalog/Catalog';
import { SortSelect } from '@/components/ui/catalog/SortSelect';

import { productService } from '@/services/product.service';

import { PUBLIC_URL } from '@/config/url.config';

import { buildQuery, parseCatalogParams } from '@/utils/catalogQuery';

export const metadata: Metadata = {
    title: 'Product catalog',
};

type PageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
    const { searchTerm, sort, page } = parseCatalogParams(await searchParams);

    const { items, meta } = await productService.getAll({
        searchTerm,
        sort,
        page,
    });

    const getHref = (target: number) =>
        PUBLIC_URL.explorer(
            buildQuery({
                searchTerm,
                sort: sort === 'newest' ? undefined : sort,
                page: target > 1 ? target : undefined,
            }),
        );

    // e.g. an old link to a page that no longer exists
    if (meta.totalPages > 0 && page > meta.totalPages) {
        redirect(getHref(meta.totalPages));
    }

    return (
        <div className='my-6'>
            <div className='mb-4 flex justify-end'>
                <SortSelect value={sort} />
            </div>

            <Catalog
                title={
                    searchTerm
                        ? `Search by request "${searchTerm}"`
                        : 'Product catalog'
                }
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
