export interface ICategory {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    storeId: string;
}

export type ICategoryInput = Pick<ICategory, 'title' | 'description'>;
