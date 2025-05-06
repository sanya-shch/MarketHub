import { Metadata } from 'next';

import { Auth } from './Auth';

export const metadata: Metadata = {
    title: 'Authorization',
};

export default function Page() {
    return <Auth />;
}
