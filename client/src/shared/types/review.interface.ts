import { IUser } from './user.interface';

export interface IReview {
    id: string;
    text: string;
    rating: number;
    createdAt: string;
    user: IUser;
}

export type IReviewInput = Pick<IReview, 'rating' | 'text'>;
