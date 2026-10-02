import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { productService } from '@/services/product.service';

import { Product } from './Product';

export const revalidate = 60;

type PageProps = { params: Promise<{ id: string }> };

// `cache` dedupes the calls from generateMetadata and the page (one request)
const getProducts = cache(async (id: string) => {
    try {
        const product = await productService.getById(id);
        const similarProducts = await productService.getSimilar(id);

        return { product, similarProducts };
    } catch {
        return notFound();
    }
});

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { id } = await params;
    const { product } = await getProducts(id);

    return {
        title: product.title,
        description: product.description,
        openGraph: {
            images: [
                {
                    url: product.images[0],
                    width: 1000,
                    height: 1000,
                    alt: product.title,
                },
            ],
        },
    };
}

export async function generateStaticParams() {
    const products = await productService.getAll();

    return products.map(product => ({ id: product.id }));
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    const { product, similarProducts } = await getProducts(id);

    return (
        <Product
            initialProduct={product}
            similarProducts={similarProducts}
            id={id}
        />
    );
}
