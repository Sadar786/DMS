import fs from "fs";
import path from "path";

export const ensureDirectory = (dir) => {

    if (!fs.existsSync(dir)) {

        fs.mkdirSync(dir, {
            recursive: true,
        });

    }

};

export const getInvoicePath = (invoiceNumber) => {

    const folder = path.join(
        process.cwd(),
        "uploads",
        "invoices"
    );

    ensureDirectory(folder);

    return path.join(
        folder,
        `${invoiceNumber}.pdf`
    );

};