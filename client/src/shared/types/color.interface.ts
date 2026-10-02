export interface IColor {
    id: string;
    name: string;
    value: string;
    createdAt: string;
    storeId: string;
}

export type IColorInput = Pick<IColor, 'name' | 'value'>;
