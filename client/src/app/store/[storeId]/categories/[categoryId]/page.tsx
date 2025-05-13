import { Metadata } from 'next';

import { NO_INDEX_PAGE } from '@/constants/seo.constants';

import { CategorySettings } from './CategorySettings';

export const metadata: Metadata = {
    title: 'Category settings',
    ...NO_INDEX_PAGE,
};

export default function Page() {
    return <CategorySettings />;
}
