import {
    PRODUCT_SORT_OPTIONS,
    ProductSort,
} from '@/shared/types/pagination.interface';

type RawSearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

/** Reads `?searchTerm=&sort=&page=` from Next's `searchParams`, never throws. */
export function parseCatalogParams(raw: RawSearchParams) {
    const page = Number.parseInt(first(raw.page) ?? '', 10);
    const sort = first(raw.sort);

    return {
        searchTerm: first(raw.searchTerm)?.trim().slice(0, 100) || undefined,
        sort: (PRODUCT_SORT_OPTIONS.some(option => option.value === sort)
            ? sort
            : 'newest') as ProductSort,
        page: Number.isFinite(page) && page > 0 ? Math.min(page, 10_000) : 1,
    };
}

/** `?a=1&b=2` (or an empty string); undefined / empty values are dropped. */
export function buildQuery(
    params: Record<string, string | number | undefined>,
) {
    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== '') query.set(key, String(value));
    }

    const result = query.toString();

    return result ? `?${result}` : '';
}
