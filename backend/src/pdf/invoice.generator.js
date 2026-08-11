import PDFDocument from "pdfkit";
import COMPANY from "../config/company.js";
import {
    drawLine,
    drawBox,
    money,
    formatDate,
} from "../helpers/pdf.helper.js";


const drawHeader = (doc) => {

    doc
        .fontSize(22)
        .font("Helvetica-Bold")
        .text(COMPANY.name, 50, 40, {
            align: "center",
        });

    doc
        .fontSize(13)
        .font("Helvetica")
        .text(COMPANY.address, {
            align: "center",
        });

    doc.text(COMPANY.phone, {
        align: "center",
    });

    doc.text(COMPANY.email, {
        align: "center",
    });

    doc.moveDown();

    drawLine(doc, doc.y);

    doc.moveDown();

    doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("SALES INVOICE", {
            align: "center",
        });

    doc.moveDown();

};

const drawInvoiceInfo = (doc, sale) => {

    const y = doc.y;

    drawBox(doc, 50, y, 230, 90);

    doc
        .font("Helvetica-Bold")
        .fontSize(11);

    doc.text("Invoice Details", 60, y + 10);

    doc.font("Helvetica");

    doc.text(
        `Invoice No : ${sale.invoiceNumber}`,
        60,
        y + 30
    );

    doc.text(
        `Date : ${formatDate(sale.saleDate)}`,
        60
    );

    doc.text(
        `Payment : ${sale.paymentMethod}`,
        60
    );

    doc.text(
        `Status : ${sale.paymentStatus}`,
        60
    );

};


const drawCustomerBox = (doc, sale) => {

    const y = doc.y - 90;

    drawBox(doc, 310, y, 235, 90);

    doc
        .font("Helvetica-Bold")
        .text("Customer Details", 320, y + 10);

    doc
        .font("Helvetica")
        .text(
            `Customer : ${sale.customer.name}`,
            320,
            y + 30
        );

    doc.text(
        `Shop : ${sale.customer.shopName}`,
        320
    );

    doc.text(
        `Phone : ${sale.customer.phone}`,
        320
    );

    doc.text(
        `Address : ${sale.customer.address || "-"}`,
        320
    );

    doc.moveDown(5);

};


const drawTableHeader = (doc) => {

    const y = doc.y;

    doc
        .rect(50, y, 495, 25)
        .fillAndStroke("#E5E7EB", "#000");

    doc
        .fillColor("black")
        .font("Helvetica-Bold");

    doc.text("Product", 60, y + 8);

    doc.text("Qty", 290, y + 8);

    doc.text("Unit Price", 350, y + 8);

    doc.text("Total", 465, y + 8);

    doc.y = y + 30;

};


const drawProductsTable = (doc, sale) => {

    let y = doc.y;

    const startX = 50;

    const productWidth = 220;
    const qtyWidth = 60;
    const priceWidth = 100;
    const totalWidth = 115;

    sale.items.forEach((item, index) => {

        // Auto Page Break
        if (y > 700) {

            doc.addPage();

            drawHeader(doc);

            drawTableHeader(doc);

            y = doc.y;

        }

        // Zebra Row Color
        if (index % 2 === 0) {

            doc
                .rect(startX, y, 495, 28)
                .fill("#F9FAFB");

        }

        // Border
        doc
            .rect(startX, y, 495, 28)
            .stroke();

        doc.fillColor("black");

        // Vertical Lines
        doc.moveTo(270, y).lineTo(270, y + 28).stroke();

        doc.moveTo(330, y).lineTo(330, y + 28).stroke();

        doc.moveTo(430, y).lineTo(430, y + 28).stroke();

        // Product
        doc
            .font("Helvetica")
            .fontSize(10)
            .text(
                item.product.name,
                startX + 8,
                y + 8,
                {
                    width: productWidth - 10,
                }
            );

        // Qty
        doc.text(
            item.quantity.toString(),
            285,
            y + 8,
            {
                width: qtyWidth - 10,
                align: "center",
            }
        );

        // Unit Price
        doc.text(
            money(item.sellingPrice),
            340,
            y + 8,
            {
                width: priceWidth - 10,
                align: "right",
            }
        );

        // Total
        doc.text(
            money(item.total),
            440,
            y + 8,
            {
                width: totalWidth - 10,
                align: "right",
            }
        );

        y += 28;

    });

    doc.y = y + 15;

};



const drawTotals = (doc, sale) => {

    const x = 325;
    const y = doc.y;

    drawBox(doc, x, y, 220, 140);

    doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .text("Invoice Summary", x + 10, y + 10);

    doc.font("Helvetica");

    doc.text(
        `Subtotal`,
        x + 10,
        y + 35
    );

    doc.text(
        money(sale.subTotal),
        x + 110,
        y + 35,
        {
            width: 90,
            align: "right",
        }
    );

    doc.text(
        `Discount`,
        x + 10,
        y + 55
    );

    doc.text(
        money(sale.discount),
        x + 110,
        y + 55,
        {
            width: 90,
            align: "right",
        }
    );

    doc.text(
        `Tax`,
        x + 10,
        y + 75
    );

    doc.text(
        money(sale.tax),
        x + 110,
        y + 75,
        {
            width: 90,
            align: "right",
        }
    );

    drawLine(doc, y + 98);

    doc
        .font("Helvetica-Bold");

    doc.text(
        "Grand Total",
        x + 10,
        y + 108
    );

    doc.text(
        money(sale.grandTotal),
        x + 110,
        y + 108,
        {
            width: 90,
            align: "right",
        }
    );

    doc.font("Helvetica");

    doc.text(
        "Paid",
        x + 10,
        y + 128
    );

    doc.text(
        money(sale.paidAmount),
        x + 110,
        y + 128,
        {
            width: 90,
            align: "right",
        }
    );

    doc.text(
        "Remaining",
        x + 10,
        y + 148
    );

    doc.text(
        money(sale.remainingBalance),
        x + 110,
        y + 148,
        {
            width: 90,
            align: "right",
        }
    );

    doc.moveDown(9);

};

const drawFooter = (doc) => {

    drawLine(doc, doc.y);

    doc.moveDown();

    doc.text(
        "Prepared By",
        60
    );

    doc.text(
        "Received By",
        360
    );

    doc.moveDown(3);

    doc.text(
        "_____________________",
        50
    );

    doc.text(
        "_____________________",
        340
    );

    doc.moveDown(3);

    doc
        .fontSize(9)
        .fillColor("gray")
        .text(
            "Thank you for your business.",
            {
                align: "center",
            }
        );

    doc.text(
        "This is a computer-generated invoice.",
        {
            align: "center",
        }
    );

    doc.text(
        COMPANY.software,
        {
            align: "center",
        }
    );

    doc.text(
        `Developed by ${COMPANY.developedBy}`,
        {
            align: "center",
        }
    );

    doc.fillColor("black");

};




const generateInvoicePDF = (sale, res) => {

    const doc = new PDFDocument({
        margin: 50,
        size: "A4",
    });

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        `inline; filename=${sale.invoiceNumber}.pdf`
    );

    doc.pipe(res);

    drawHeader(doc);

    drawInvoiceInfo(doc, sale);

   drawCustomerBox(doc, sale);

    drawTableHeader(doc);

   drawProductsTable(doc, sale);

    drawTotals(doc, sale);

    drawFooter(doc);

    doc.end();

};

export default generateInvoicePDF;