export const getReviewWordWithEnding = (reviewCount: number): string => {
    return `${reviewCount} review${reviewCount === 1 ? '' : 's'}`;
};
