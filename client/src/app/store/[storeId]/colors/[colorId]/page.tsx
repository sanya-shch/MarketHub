import { Metadata } from 'next';

import { NO_INDEX_PAGE } from '@/constants/seo.constants';

import { ColorSettings } from './ColorSettings';

export const metadata: Metadata = {
    title: 'Color settings',
    ...NO_INDEX_PAGE,
};

export default function Page() {
    return <ColorSettings />;
}
