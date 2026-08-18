import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Hoisted mocks
const { sendMock, generateInvoiceHTMLMock } = vi.hoisted(() => ({
    sendMock: vi.fn(),
    generateInvoiceHTMLMock: vi.fn(),
}));

// Mock EmailJS
vi.mock("@emailjs/browser", () => ({
    default: {
        send: sendMock,
    },
}));

// Mock invoice generator
vi.mock("../../services/utlis/invoiceGenerator", () => ({
    generateInvoiceHTML: generateInvoiceHTMLMock,
}));

// Import the actual email service
import { sendInvoiceEmail } from "../../services/utlis/emailService";

describe("sendInvoiceEmail", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        generateInvoiceHTMLMock.mockReturnValue(
            "<html><body>Invoice</body></html>"
        );

        vi.spyOn(console, "log").mockImplementation(() => {});
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("generates invoice HTML and sends invoice email successfully", async () => {
        const entry = {
            month_display: "January",
            year: 2026,
            amount: 1500,
            status: "Paid",
            paid_date: "2026-01-31",
            currency: "USD",
        };

        const toEmail = "customer@example.com";
        const companyName = "Test Company";

        sendMock.mockResolvedValue({
            status: 200,
            text: "OK",
        });

        await sendInvoiceEmail(
            entry,
            toEmail,
            companyName
        );

        expect(generateInvoiceHTMLMock).toHaveBeenCalledTimes(1);

        expect(generateInvoiceHTMLMock).toHaveBeenCalledWith(
            entry,
            companyName
        );

        expect(sendMock).toHaveBeenCalledTimes(1);

        expect(sendMock).toHaveBeenCalledWith(
            "service_tfb6mdh",
            "template_xzlubi8",
            expect.objectContaining({
                to_email: toEmail,
                company_name: companyName,
                month: "January",
                year: 2026,
                amount: 1500,
                status: "Paid",
                paid_date: "2026-01-31",
                currency: "USD",
            }),
            "wJYPZOGHsxr8loRuC"
        );

        expect(console.log).toHaveBeenCalled();
    });

    it("uses the default company name when companyName is not provided", async () => {
        const entry = {
            month_display: "February",
            year: 2026,
            amount: 2000,
            status: "Pending",
            paid_date: null,
            currency: "INR",
        };

        sendMock.mockResolvedValue({
            status: 200,
            text: "OK",
        });

        await sendInvoiceEmail(
            entry,
            "user@example.com"
        );

        expect(generateInvoiceHTMLMock).toHaveBeenCalledWith(
            entry,
            "Your Company Name"
        );

        expect(sendMock).toHaveBeenCalledWith(
            "service_tfb6mdh",
            "template_xzlubi8",
            expect.objectContaining({
                to_email: "user@example.com",
                company_name: "Your Company Name",
                month: "February",
                year: 2026,
                amount: 2000,
                status: "Pending",
                paid_date: null,
                currency: "INR",
            }),
            "wJYPZOGHsxr8loRuC"
        );
    });

    it("handles EmailJS error without throwing", async () => {
        const entry = {
            month_display: "March",
            year: 2026,
            amount: 3000,
            status: "Failed",
            paid_date: null,
            currency: "EUR",
        };

        const error = new Error("Email sending failed");

        sendMock.mockRejectedValue(error);

        await expect(
            sendInvoiceEmail(
                entry,
                "failed@example.com",
                "Test Company"
            )
        ).resolves.toBeUndefined();

        expect(sendMock).toHaveBeenCalledTimes(1);

        expect(console.error).toHaveBeenCalledWith(
            "❌ Email sending error:",
            error
        );
    });

    it("creates the correct invoice date", async () => {
        const entry = {
            month_display: "April",
            year: 2026,
            amount: 4000,
            status: "Paid",
            paid_date: "2026-04-30",
            currency: "USD",
        };

        sendMock.mockResolvedValue({
            status: 200,
            text: "OK",
        });

        const dateSpy = vi
            .spyOn(Date.prototype, "toLocaleDateString")
            .mockReturnValue("4/30/2026");

        await sendInvoiceEmail(
            entry,
            "date@example.com",
            "Date Test Company"
        );

        expect(sendMock).toHaveBeenCalledWith(
            "service_tfb6mdh",
            "template_xzlubi8",
            expect.objectContaining({
                to_email: "date@example.com",
                company_name: "Date Test Company",
                invoice_date: "4/30/2026",
                month: "April",
                year: 2026,
                amount: 4000,
                status: "Paid",
                paid_date: "2026-04-30",
                currency: "USD",
            }),
            "wJYPZOGHsxr8loRuC"
        );

        expect(dateSpy).toHaveBeenCalledTimes(1);
    });
});