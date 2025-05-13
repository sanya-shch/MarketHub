import { Metadata } from 'next';

import { productService } from '@/services/product.service';

import { Home } from './Home';

export const metadata: Metadata = {
    title: 'Your shopping is your pleasure all in one place',
};

export const revalidate = 60;

async function getProducts() {
    const data = (await productService.getMostPopular()).slice(0, 6);

    return data;
}

export default async function Page() {
    const data = await getProducts();

    return <Home products={data} />;
}
