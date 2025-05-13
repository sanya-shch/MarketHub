import { MainBanner } from '@/components/MainBanner';
import { Catalog } from '@/components/ui/catalog/Catalog';

import { IProduct } from '@/shared/types/product.interface';

import { PUBLIC_URL } from '@/config/url.config';

interface HomeProps {
    products: IProduct[];
}

export function Home({ products }: HomeProps) {
    return (
        <>
            <MainBanner />

            <Catalog
                title='Bestsellers'
                description='The most popular products in our store'
                link={PUBLIC_URL.explorer()}
                linkTitle='Learn more'
                products={products}
            />
        </>
    );
}
