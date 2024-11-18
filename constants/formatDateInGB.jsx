export function formatDateInGB(date) {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
        console.error("Invalid date:", date);
        return "Invalid date";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}