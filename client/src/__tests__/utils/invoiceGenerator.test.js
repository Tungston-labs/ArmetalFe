import { describe, it, expect } from "vitest";
import {
    generateInvoiceHTML,
    invoiceStyles,
} from "../../services/utlis/invoiceGenerator";

describe("invoiceGenerator", () => {
    describe("generateInvoiceHTML", () => {
        it("generates invoice HTML with default company name", () => {
            const entry = {
                id: 101,
                company_address: "Kakkanad, Kochi",
                company_phone: "9876543210",
                paid_date: "2026-08-18",
                year: 2026,
                month_display: "August",
                currency: "INR",
                amount: 5000,
            };

            const html = generateInvoiceHTML(entry);

            expect(html).toContain(
                '<div class="invoice-container" id="invoice-render">'
            );

            expect(html).toContain(
                '<span class="brand-name">Company</span>'
            );

            expect(html).toContain(
                '<span class="brand-sub">Payroll & Payments</span>'
            );

            expect(html).toContain("INVOICE");

            expect(html).toContain("Company");

            expect(html).toContain(
                "Kakkanad, Kochi"
            );

            expect(html).toContain(
                "Phone number: 9876543210"
            );

            expect(html).toContain(
                "Invoice no: INV-101"
            );

            expect(html).toContain(
                "Date: 2026-08-18"
            );

            expect(html).toContain(
                "Year: 2026"
            );
        });

        it("generates invoice HTML with custom company name", () => {
            const entry = {
                id: 200,
                company_address: "Dubai",
                company_phone: "123456789",
                paid_date: "2026-08-01",
                year: 2026,
                month_display: "August",
                currency: "AED",
                amount: 1500,
            };

            const html = generateInvoiceHTML(
                entry,
                "Tungston Labs"
            );

            expect(html).toContain(
                '<span class="brand-name">Tungston Labs</span>'
            );

            expect(html).toContain(
                '<p class="bold">Tungston Labs</p>'
            );

            expect(html).toContain(
                "Tungston Labs"
            );

            expect(html).toContain(
                "Dubai"
            );

            expect(html).toContain(
                "Phone number: 123456789"
            );
        });

        it("generates the invoice description table correctly", () => {
            const entry = {
                id: 1,
                company_address: "Kochi",
                company_phone: "9999999999",
                paid_date: "2026-08-18",
                year: 2026,
                month_display: "August",
                currency: "INR",
                amount: 2500,
            };

            const html = generateInvoiceHTML(
                entry,
                "Test Company"
            );

            expect(html).toContain(
                "SL.NO"
            );

            expect(html).toContain(
                "DESCRIPTION"
            );

            expect(html).toContain(
                "MONTH"
            );

            expect(html).toContain(
                "TOTAL"
            );

            expect(html).toContain(
                "HR App monthly subscription charge"
            );

            expect(html).toContain(
                "August"
            );

            expect(html).toContain(
                "INR 2500"
            );

            expect(html).toContain(
                "GRAND TOTAL"
            );

            expect(html).toContain(
                "<strong>INR 2500</strong>"
            );
        });

        it("generates notes section", () => {
            const entry = {
                id: 10,
                year: 2026,
                month_display: "January",
                currency: "INR",
                amount: 1000,
            };

            const html = generateInvoiceHTML(entry);

            expect(html).toContain(
                '<div class="notes">'
            );

            expect(html).toContain(
                '<div class="section-heading">NOTES</div>'
            );

            expect(html).toContain(
                "Subscription charges are non-refundable."
            );

            expect(html).toContain(
                "Payment confirms acceptance of our terms."
            );

            expect(html).toContain(
                "Thank you for choosing our services."
            );
        });

        it("generates bank details section", () => {
            const entry = {
                id: 11,
                year: 2026,
                month_display: "February",
                currency: "INR",
                amount: 2000,
            };

            const html = generateInvoiceHTML(entry);

            expect(html).toContain(
                '<div class="bank-details">'
            );

            expect(html).toContain(
                "BANK DETAILS"
            );

            expect(html).toContain(
                "Account holder: TUNGSTON LABS"
            );

            expect(html).toContain(
                "Account number: XXXXXXXXXXXX"
            );

            expect(html).toContain(
                "IFSC: FDRL0000000"
            );

            expect(html).toContain(
                "Bank address: FEDERAL BANK KAKKANAD"
            );
        });

        it("generates invoice footer", () => {
            const entry = {
                id: 12,
                year: 2026,
                month_display: "March",
                currency: "INR",
                amount: 3000,
            };

            const html = generateInvoiceHTML(entry);

            expect(html).toContain(
                '<div class="invoice-footer">'
            );

            expect(html).toContain(
                "+91 9778377526"
            );

            expect(html).toContain(
                "info@tungstonlabs.com"
            );

            expect(html).toContain(
                "Kakkanad, Kochi"
            );
        });

        it("uses empty string when company address is missing", () => {
            const entry = {
                id: 20,
                year: 2026,
                month_display: "April",
                currency: "INR",
                amount: 4000,
            };

            const html = generateInvoiceHTML(
                entry,
                "Test Company"
            );

            expect(html).toContain(
                '<p></p>'
            );
        });

        it("uses empty string when company phone is missing", () => {
            const entry = {
                id: 21,
                year: 2026,
                month_display: "May",
                currency: "INR",
                amount: 5000,
            };

            const html = generateInvoiceHTML(
                entry,
                "Test Company"
            );

            expect(html).toContain(
                "<p></p>"
            );

            expect(html).not.toContain(
                "Phone number:"
            );
        });

        it("uses hyphen when paid date is missing", () => {
            const entry = {
                id: 22,
                year: 2026,
                month_display: "June",
                currency: "INR",
                amount: 6000,
            };

            const html = generateInvoiceHTML(
                entry,
                "Test Company"
            );

            expect(html).toContain(
                "Date: -"
            );
        });

        it("generates invoice with zero amount", () => {
            const entry = {
                id: 23,
                year: 2026,
                month_display: "July",
                currency: "INR",
                amount: 0,
            };

            const html = generateInvoiceHTML(
                entry,
                "Test Company"
            );

            expect(html).toContain(
                "INR 0"
            );

            expect(html).toContain(
                "<strong>INR 0</strong>"
            );
        });

        it("generates invoice with different currency", () => {
            const entry = {
                id: 24,
                year: 2026,
                month_display: "August",
                currency: "AED",
                amount: 999,
            };

            const html = generateInvoiceHTML(
                entry,
                "Dubai Company"
            );

            expect(html).toContain(
                "AED 999"
            );

            expect(html).toContain(
                "<strong>AED 999</strong>"
            );
        });
    });

    describe("invoiceStyles", () => {
        it("exports invoice styles as a string", () => {
            expect(typeof invoiceStyles).toBe(
                "string"
            );

            expect(invoiceStyles.length).toBeGreaterThan(
                0
            );
        });

        it("contains global styles", () => {
            expect(invoiceStyles).toContain(
                "* { box-sizing: border-box; }"
            );

            expect(invoiceStyles).toContain(
                "font-family: 'Satoshi', Arial, sans-serif"
            );

            expect(invoiceStyles).toContain(
                "background: #fff"
            );
        });

        it("contains invoice container styles", () => {
            expect(invoiceStyles).toContain(
                ".invoice-container"
            );

            expect(invoiceStyles).toContain(
                "width: 700px"
            );

            expect(invoiceStyles).toContain(
                "padding: 40px"
            );

            expect(invoiceStyles).toContain(
                "border: 2px solid #1e3a8a"
            );

            expect(invoiceStyles).toContain(
                "border-radius: 10px"
            );
        });

        it("contains invoice header and brand styles", () => {
            expect(invoiceStyles).toContain(
                ".invoice-header"
            );

            expect(invoiceStyles).toContain(
                ".brand-text"
            );

            expect(invoiceStyles).toContain(
                ".brand-name"
            );

            expect(invoiceStyles).toContain(
                ".brand-sub"
            );

            expect(invoiceStyles).toContain(
                "font-weight: 700"
            );
        });

        it("contains invoice title styles", () => {
            expect(invoiceStyles).toContain(
                ".invoice-title"
            );

            expect(invoiceStyles).toContain(
                "font-size: 26px"
            );

            expect(invoiceStyles).toContain(
                "letter-spacing: 2px"
            );

            expect(invoiceStyles).toContain(
                "text-align: center"
            );
        });

        it("contains invoice layout styles", () => {
            expect(invoiceStyles).toContain(
                ".invoice-top"
            );

            expect(invoiceStyles).toContain(
                ".invoice-left, .invoice-right"
            );

            expect(invoiceStyles).toContain(
                ".invoice-right"
            );

            expect(invoiceStyles).toContain(
                "justify-content: space-between"
            );
        });

        it("contains table styles", () => {
            expect(invoiceStyles).toContain(
                "table"
            );

            expect(invoiceStyles).toContain(
                "border-collapse: collapse"
            );

            expect(invoiceStyles).toContain(
                "table-layout: fixed"
            );

            expect(invoiceStyles).toContain(
                "th"
            );

            expect(invoiceStyles).toContain(
                "td"
            );

            expect(invoiceStyles).toContain(
                "background: #1e3a8a"
            );

            expect(invoiceStyles).toContain(
                "color: #fff"
            );
        });

        it("contains total row styles", () => {
            expect(invoiceStyles).toContain(
                ".grand-total-label"
            );

            expect(invoiceStyles).toContain(
                ".total-row td"
            );

            expect(invoiceStyles).toContain(
                "border-top: 2px solid #1e3a8a"
            );
        });

        it("contains notes and bank detail styles", () => {
            expect(invoiceStyles).toContain(
                ".notes"
            );

            expect(invoiceStyles).toContain(
                ".bank-details"
            );

            expect(invoiceStyles).toContain(
                ".notes ol"
            );

            expect(invoiceStyles).toContain(
                ".notes li"
            );

            expect(invoiceStyles).toContain(
                ".bank-details p"
            );
        });

        it("contains footer styles", () => {
            expect(invoiceStyles).toContain(
                ".invoice-footer"
            );

            expect(invoiceStyles).toContain(
                "background: #182657"
            );

            expect(invoiceStyles).toContain(
                "color: #fff"
            );

            expect(invoiceStyles).toContain(
                "border-radius: 8px"
            );

            expect(invoiceStyles).toContain(
                "justify-content: space-between"
            );
        });
    });
});