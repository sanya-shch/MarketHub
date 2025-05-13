import { Metadata } from 'next';

import { NO_INDEX_PAGE } from '@/constants/seo.constants';

import { CreateCategory } from './CreateCategory';

export const metadata: Metadata = {
    title: 'Category creation',
    ...NO_INDEX_PAGE,
};

export default function Page() {
    return <CreateCategory />;
}
