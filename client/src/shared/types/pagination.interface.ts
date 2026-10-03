export interface IPaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface IPaginated<T> {
    items: T[];
    meta: IPaginationMeta;
}

export const PRODUCT_SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: low to high' },
    { value: 'price_desc', label: 'Price: high to low' },
] as const;

export type ProductSort = (typeof PRODUCT_SORT_OPTIONS)[number]['value'];

export interface IProductsQuery {
    searchTerm?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: ProductSort;
    page?: number;
    limit?: number;
}
