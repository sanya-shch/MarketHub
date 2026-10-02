export const getContentType = () => ({
    'Content-type': 'application/json',
});

type ErrorWithResponse = {
    message?: string;
    response?: { data?: { message?: string | string[] } };
};

export const errorCatch = (error: unknown): string => {
    const err = error as ErrorWithResponse;
    const message = err?.response?.data?.message;

    return message
        ? typeof message === 'object'
            ? message[0]
            : message
        : (err?.message ?? 'Unknown error');
};
