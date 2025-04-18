export const formatDate = (dateString?: string | number | null) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options);
};
