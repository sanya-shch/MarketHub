export interface IColor {
    id: string;
    name: string;
    value: string;
    createdAt: string;
    storeId: string;
}

export interface IColorInput extends Pick<IColor, 'name' | 'value'> {}
