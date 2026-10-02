import type { Metadata } from 'next';
import { cache } from 'react';

import { Catalog } from '@/components/ui/catalog/Catalog';

import { categoryService } from '@/services/category.service';
import { productService } from '@/services/product.service';

export const revalidate = 60;

type PageProps = { params: Promise<{ id: string }> };

// `cache` dedupes the calls from generateMetadata and the page (one request)
const getProducts = cache(async (id: string) => {
    const [products, category] = await Promise.all([
        productService.getByCategory(id),
        categoryService.getById(id),
    ]);

    return { products, category };
});

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { id } = await params;
    const { category, products } = await getProducts(id);

    return {
        title: category.title,
        description: category.description,
        openGraph: {
            images: products[0]?.images[0]
                ? [
                      {
                          url: products[0].images[0],
                          width: 1000,
                          height: 1000,
                          alt: category.title,
                      },
                  ]
                : [],
        },
    };
}

export default async function CategoryPage({ params }: PageProps) {
    const { id } = await params;
    const { category, products } = await getProducts(id);

    return (
        <div className='my-6'>
            <Catalog
                title={category.title}
                description={category.description}
                products={products}
            />
        </div>
    );
}
