import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { printElement } from "../../services/utlis/printPayroll";

describe("printElement", () => {
    let mockPrintWindow;
    let mockDocument;
    let originalOpen;
    let originalSetTimeout;
    let originalToLocaleDateString;

    beforeEach(() => {
        vi.clearAllMocks();

        originalOpen = window.open;
        originalSetTimeout = window.setTimeout;
        originalToLocaleDateString =
            Date.prototype.toLocaleDateString;

        mockDocument = {
            write: vi.fn(),
            close: vi.fn(),
        };

        mockPrintWindow = {
            document: mockDocument,
            focus: vi.fn(),
            print: vi.fn(),
            close: vi.fn(),
        };

        window.open = vi.fn(() => mockPrintWindow);

        window.setTimeout = vi.fn((callback) => {
            callback();
            return 1;
        });

        Date.prototype.toLocaleDateString = vi.fn(() => "8/18/2026");

        document.head.innerHTML = "";
        document.body.innerHTML = "";
    });

    afterEach(() => {
        window.open = originalOpen;
        window.setTimeout = originalSetTimeout;
        Date.prototype.toLocaleDateString =
            originalToLocaleDateString;

        document.head.innerHTML = "";
        document.body.innerHTML = "";

        vi.restoreAllMocks();
    });

    it("returns immediately when element is not provided", () => {
        printElement(null);

        expect(window.open).not.toHaveBeenCalled();
    });

    it("returns immediately when element is undefined", () => {
        printElement();

        expect(window.open).not.toHaveBeenCalled();
    });

    it("opens print window and writes the printable HTML", () => {
        const element = document.createElement("div");
        element.innerHTML = "<h1>Payroll</h1>";

        printElement(element);

        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith(
            "",
            "",
            "width=1400,height=1000"
        );

        expect(mockDocument.write).toHaveBeenCalledTimes(1);

        const writtenHTML =
            mockDocument.write.mock.calls[0][0];

        expect(writtenHTML).toContain("<html>");
        expect(writtenHTML).toContain("<head>");
        expect(writtenHTML).toContain("<title>Payroll</title>");
        expect(writtenHTML).toContain("<body>");
        expect(writtenHTML).toContain("<h1>Payroll</h1>");
        expect(writtenHTML).toContain("</html>");
    });

    it("clones the element instead of modifying the original element", () => {
        const element = document.createElement("div");
        element.innerHTML = "<h1>Payroll</h1>";

        const cloneNodeSpy = vi.spyOn(
            element,
            "cloneNode"
        );

        printElement(element);

        expect(cloneNodeSpy).toHaveBeenCalledWith(true);

        expect(element.innerHTML.trim()).toBe(
            "<h1>Payroll</h1>"
        );
    });

    it("converts relative image paths to absolute URLs", () => {
        const element = document.createElement("div");

        const clonedElement = document.createElement("div");

        const image = {
            src: "/images/logo.png",
            getAttribute: vi.fn(() => "/images/logo.png"),
        };

        const querySelectorAllMock = vi.fn(() => [image]);

        clonedElement.querySelectorAll =
            querySelectorAllMock;

        Object.defineProperty(clonedElement, "outerHTML", {
            get: () =>
                `<div><img src="${image.src}" alt="Logo"></div>`,
        });

        vi.spyOn(element, "cloneNode").mockReturnValue(
            clonedElement
        );

        printElement(element);

        expect(querySelectorAllMock).toHaveBeenCalledWith(
            "img"
        );

        expect(image.src).toBe(
            `${window.location.origin}/images/logo.png`
        );

        const writtenHTML =
            mockDocument.write.mock.calls[0][0];

        expect(writtenHTML).toContain(
            `${window.location.origin}/images/logo.png`
        );
    });

    it("keeps absolute image URLs unchanged", () => {
        const element = document.createElement("div");

        const clonedElement = document.createElement("div");

        const image = {
            src: "https://example.com/logo.png",
            getAttribute: vi.fn(() => "https://example.com/logo.png"),
        };

        clonedElement.querySelectorAll = vi.fn(() => [image]);

        Object.defineProperty(clonedElement, "outerHTML", {
            get: () =>
                `<div><img src="${image.src}" alt="Logo"></div>`,
        });

        vi.spyOn(element, "cloneNode").mockReturnValue(
            clonedElement
        );

        printElement(element);

        expect(image.src).toBe(
            "https://example.com/logo.png"
        );
    });

    it("handles images without src attributes", () => {
        const element = document.createElement("div");

        const clonedElement = document.createElement("div");

        const image = {
            src: "",
            getAttribute: vi.fn(() => null),
        };

        clonedElement.querySelectorAll = vi.fn(() => [image]);

        Object.defineProperty(clonedElement, "outerHTML", {
            get: () =>
                `<div><img alt="Logo"></div>`,
        });

        vi.spyOn(element, "cloneNode").mockReturnValue(
            clonedElement
        );

        expect(() => printElement(element)).not.toThrow();

        expect(image.src).toBe("");
    });

    it("includes document styles and stylesheet links", () => {
        const style = document.createElement("style");
        style.textContent = "body { color: red; }";

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/styles.css";

        document.head.appendChild(style);
        document.head.appendChild(link);

        const element = document.createElement("div");
        element.innerHTML = "<p>Payroll</p>";

        printElement(element);

        const writtenHTML =
            mockDocument.write.mock.calls[0][0];

        expect(writtenHTML).toContain(
            "body { color: red; }"
        );

        expect(writtenHTML).toContain(
            '<link rel="stylesheet" href="/styles.css">'
        );
    });

    it("calls document.close after writing HTML", () => {
        const element = document.createElement("div");
        element.innerHTML = "<p>Payroll</p>";

        printElement(element);

        expect(mockDocument.write).toHaveBeenCalledTimes(1);
        expect(mockDocument.close).toHaveBeenCalledTimes(1);
    });

    it("focuses the print window", () => {
        const element = document.createElement("div");
        element.innerHTML = "<p>Payroll</p>";

        printElement(element);

        expect(mockPrintWindow.focus).toHaveBeenCalledTimes(
            1
        );
    });

    it("prints and closes the window after 500 milliseconds", () => {
        const element = document.createElement("div");
        element.innerHTML = "<p>Payroll</p>";

        const setTimeoutSpy = vi.spyOn(
            window,
            "setTimeout"
        );

        printElement(element);

        expect(setTimeoutSpy).toHaveBeenCalledWith(
            expect.any(Function),
            500
        );

        expect(mockPrintWindow.print).toHaveBeenCalledTimes(
            1
        );

        expect(mockPrintWindow.close).toHaveBeenCalledTimes(
            1
        );
    });

    it("generates the correct print footer", () => {
        const element = document.createElement("div");
        element.innerHTML = "<p>Payroll</p>";

        printElement(element);

        const writtenHTML =
            mockDocument.write.mock.calls[0][0];

        expect(writtenHTML).toContain(
            "Generated on: 8/18/2026"
        );

        expect(writtenHTML).toContain(
            "Authorized Signature"
        );
    });

    it("includes payroll print-specific CSS", () => {
        const element = document.createElement("div");
        element.innerHTML = "<p>Payroll</p>";

        printElement(element);

        const writtenHTML =
            mockDocument.write.mock.calls[0][0];

        expect(writtenHTML).toContain(
            "@media print"
        );

        expect(writtenHTML).toContain(
            "-webkit-print-color-adjust: exact"
        );

        expect(writtenHTML).toContain(
            "print-color-adjust: exact"
        );

        expect(writtenHTML).toContain(
            ".no-print"
        );

        expect(writtenHTML).toContain(
            "page-break-inside: avoid"
        );

        expect(writtenHTML).toContain(
            ".net-pay td"
        );

        expect(writtenHTML).toContain(
            "table-layout: fixed !important"
        );
    });

    it("includes the base URL using the current window origin", () => {
        const element = document.createElement("div");
        element.innerHTML = "<p>Payroll</p>";

        printElement(element);

        const writtenHTML =
            mockDocument.write.mock.calls[0][0];

        expect(writtenHTML).toContain(
            `<base href="${window.location.origin}/" />`
        );
    });
});