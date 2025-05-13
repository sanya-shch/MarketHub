import { Metadata } from 'next';

import { productService } from '@/services/product.service';

import { Explorer } from './Explorer';

export const metadata: Metadata = {
    title: 'Product catalog',
};

export const revalidate = 60;

async function getProducts() {
    const data = await productService.getAll();

    return data;
}

export default async function Page() {
    const data = await getProducts();

    return <Explorer products={data} />;
}
