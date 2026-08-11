export const drawLine = (doc, y) => {
    doc
        .moveTo(50, y)
        .lineTo(545, y)
        .stroke();
};

export const drawBox = (doc, x, y, width, height) => {
    doc
        .rect(x, y, width, height)
        .stroke();
};

export const money = (amount) => {
    return `PKR ${Number(amount).toFixed(2)}`;
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};