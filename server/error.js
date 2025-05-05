export const throwError = (status, message) => {
    const error = new Error();
    error.status = status
    error.message = message
    return error
};