import { Metadata } from 'next';

import { NO_INDEX_PAGE } from '@/constants/seo.constants';

import { ProductSettings } from './ProductSettings';

export const metadata: Metadata = {
    title: 'Product settings',
    ...NO_INDEX_PAGE,
};

export default function Page() {
    return <ProductSettings />;
}
