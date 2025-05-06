import { Metadata } from 'next';

import { Home } from './Home';

export const metadata: Metadata = {
    title: 'Your shopping is your pleasure all in one place',
};

export default function Page() {
    return <Home />;
}
