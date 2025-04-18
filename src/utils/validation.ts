export const validateEmailInput = (
    email: string,
    maxLength: number = 254
): boolean => {

    // Check if the input exceeds the maximum length.
    if (email.length > maxLength) {
        return false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
};