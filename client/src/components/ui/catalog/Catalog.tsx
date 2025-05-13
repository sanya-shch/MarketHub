import Link from 'next/link';

import { ProductCard } from './ProductCard';
import { ICatalog } from './catalog.interface';

export function Catalog({
    title,
    description,
    linkTitle,
    link,
    products,
}: ICatalog) {
    return (
        <div>
            <div className='md:flex md:items-center md:justify-between mb-4'>
                <div className='max-w-2xl px-4 lg:max-w-full lg:px-0'>
                    <h1 className='text-2xl font-bold'>{title}</h1>

                    {description && (
                        <p className='mt-2 text-sm text-muted-foreground'>
                            {description}
                        </p>
                    )}
                </div>

                {link && linkTitle && (
                    <Link
                        href={link}
                        className='hidden text-sm font-medium text-blue-600 hover:text-blue-600/90 md:flex'
                    >
                        {linkTitle}
                    </Link>
                )}
            </div>

            <div className='flex items-center w-full'>
                <div className='mt-2 w-full grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-8'>
                    {products.length ? (
                        products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div>Nothing found</div>
                    )}
                </div>
            </div>
        </div>
    );
}
