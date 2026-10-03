'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import {
    PRODUCT_SORT_OPTIONS,
    ProductSort,
} from '@/shared/types/pagination.interface';

export function SortSelect({ value }: { value: ProductSort }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const onChange = (sort: string) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set('sort', sort);
        params.delete('page'); // a new order starts from the first page

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className='w-[220px]' aria-label='Sort products'>
                <SelectValue />
            </SelectTrigger>

            <SelectContent>
                {PRODUCT_SORT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
