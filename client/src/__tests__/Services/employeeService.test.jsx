
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock API BEFORE importing the service
vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import API from "../../services/api";

import {
  createEmployee,
  getMyDepartmentEmployees,
  updateEmployee,
  deleteEmployee,
  fetchAllEmployees,
  fetchUnpaginatedEmployees,
  fetchEmployeeById,
  fetchUpcomingExpiryEmployees,
  fetchBankPaymentsByEmployee,
  createBankPayment,
  updateBankPayment,
  deleteBankPayment,
  fetchAllBankPaymentsByEmployee,
  uploadTempImage,
  saveEmployeeDocuments,
  fetchEmployeeDocuments,
  deleteEmployeeDocument,
  updateEmployeeDocument,
  updateEmployeeDocuments,
  listEmployeeDash,
  fetchEmployeeDashboard,
  sendEmail,
} from "../../services/employeeService";

describe("employeeService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================
  // createEmployee
  // =========================================================

  describe("createEmployee", () => {
    it("should create employee successfully", async () => {
      const formData = new FormData();

      formData.append("name", "John");
      formData.append("email", "john@example.com");

      const response = {
        id: 1,
        name: "John",
        email: "john@example.com",
      };

      API.post.mockResolvedValue({
        data: response,
      });

      const result = await createEmployee(formData);

      expect(API.post).toHaveBeenCalledWith(
        "/employees/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      expect(result).toEqual(response);
    });

    it("should throw error when createEmployee fails", async () => {
      const formData = new FormData();
      formData.append("name", "John");

      const error = {
        response: {
          data: {
            detail: "Employee creation failed",
          },
        },
        message: "Request failed",
      };

      API.post.mockRejectedValue(error);

      await expect(createEmployee(formData)).rejects.toEqual(error);
    });

    it("should handle createEmployee error without response data", async () => {
      const formData = new FormData();
      formData.append("name", "John");

      const error = new Error("Network error");

      API.post.mockRejectedValue(error);

      await expect(createEmployee(formData)).rejects.toThrow(
        "Network error"
      );
    });
  });

  // =========================================================
  // getMyDepartmentEmployees
  // =========================================================

  describe("getMyDepartmentEmployees", () => {
    it("should get department employees", async () => {
      const response = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];

      API.get.mockResolvedValue({
        data: response,
      });

      const result = await getMyDepartmentEmployees();

      expect(API.get).toHaveBeenCalledWith(
        "/employees/my-department/"
      );

      expect(result).toEqual(response);
    });

    it("should reject when API fails", async () => {
      const error = new Error("Failed");

      API.get.mockRejectedValue(error);

      await expect(
        getMyDepartmentEmployees()
      ).rejects.toThrow("Failed");
    });
  });

  // =========================================================
  // updateEmployee
  // =========================================================

  describe("updateEmployee", () => {
    it("should update employee successfully", async () => {
      const data = {
        name: "Updated John",
      };

      const response = {
        id: 10,
        name: "Updated John",
      };

      API.patch.mockResolvedValue({
        data: response,
      });

      const result = await updateEmployee(10, data);

      expect(API.patch).toHaveBeenCalledWith(
        "/employees/10/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      expect(result).toEqual(response);
    });

    it("should throw error when updateEmployee fails", async () => {
      const error = {
        response: {
          data: {
            detail: "Update failed",
          },
        },
        message: "Request failed",
      };

      API.patch.mockRejectedValue(error);

      await expect(
        updateEmployee(10, { name: "John" })
      ).rejects.toEqual(error);
    });

    it("should handle updateEmployee error without response", async () => {
      const error = new Error("Network error");

      API.patch.mockRejectedValue(error);

      await expect(
        updateEmployee(10, { name: "John" })
      ).rejects.toThrow("Network error");
    });
  });

  // =========================================================
  // deleteEmployee
  // =========================================================

  describe("deleteEmployee", () => {
    it("should delete employee successfully", async () => {
      const response = {
        message: "Employee deleted",
      };

      API.delete.mockResolvedValue({
        data: response,
      });

      const result = await deleteEmployee(10);

      expect(API.delete).toHaveBeenCalledWith(
        "/employees/10/"
      );

      expect(result).toEqual(response);
    });

    it("should reject when deleteEmployee fails", async () => {
      const error = new Error("Delete failed");

      API.delete.mockRejectedValue(error);

      await expect(
        deleteEmployee(10)
      ).rejects.toThrow("Delete failed");
    });
  });

  // =========================================================
  // fetchAllEmployees
  // =========================================================

  describe("fetchAllEmployees", () => {
    it("should fetch employees without department", async () => {
      const response = {
        results: [{ id: 1 }],
      };

      API.get.mockResolvedValue({
        data: response,
      });

      const result = await fetchAllEmployees();

      expect(API.get).toHaveBeenCalledWith(
        "/employees/?page=1&search="
      );

      expect(result).toEqual(response);
    });

    it("should fetch employees with page and search", async () => {
      const response = {
        results: [{ id: 1 }],
      };

      API.get.mockResolvedValue({
        data: response,
      });

      const result = await fetchAllEmployees(
        2,
        "John"
      );

      expect(API.get).toHaveBeenCalledWith(
        "/employees/?page=2&search=John"
      );

      expect(result).toEqual(response);
    });

    it("should fetch employees with department ID", async () => {
      const response = {
        results: [{ id: 1 }],
      };

      API.get.mockResolvedValue({
        data: response,
      });

      const result = await fetchAllEmployees(
        3,
        "John",
        "17"
      );

      expect(API.get).toHaveBeenCalledWith(
        "/employees/?page=3&search=John&department_id=17"
      );

      expect(result).toEqual(response);
    });

    it("should reject when fetchAllEmployees fails", async () => {
      const error = new Error("Fetch failed");

      API.get.mockRejectedValue(error);

      await expect(
        fetchAllEmployees()
      ).rejects.toThrow("Fetch failed");
    });
  });

  // =========================================================
  // fetchUnpaginatedEmployees
  // =========================================================

  describe("fetchUnpaginatedEmployees", () => {
    it("should fetch unpaginated employees without department", async () => {
      const response = [{ id: 1 }];

      API.get.mockResolvedValue({
        data: response,
      });

      const result = await fetchUnpaginatedEmployees();

      expect(API.get).toHaveBeenCalledWith(
        "/employeelist/?search="
      );

      expect(result).toEqual(response);
    });

    it("should fetch unpaginated employees with search", async () => {
      const response = [{ id: 1 }];

      API.get.mockResolvedValue({
        data: response,
      });

      await fetchUnpaginatedEmployees("John");

      expect(API.get).toHaveBeenCalledWith(
        "/employeelist/?search=John"
      );
    });

    it("should fetch unpaginated employees with department", async () => {
      const response = [{ id: 1 }];

      API.get.mockResolvedValue({
        data: response,
      });

      const result = await fetchUnpaginatedEmployees(
        "John",
        "17"
      );

      expect(API.get).toHaveBeenCalledWith(
        "/employeelist/?search=John&department_id=17"
      );

      expect(result).toEqual(response);
    });

    it("should reject when API fails", async () => {
      const error = new Error("Fetch failed");

      API.get.mockRejectedValue(error);

      await expect(
        fetchUnpaginatedEmployees()
      ).rejects.toThrow("Fetch failed");
    });
  });

  // =========================================================
  // fetchEmployeeById
  // =========================================================

  describe("fetchEmployeeById", () => {
    it("should fetch employee by ID", async () => {
      const response = {
        id: 10,
        name: "John",
      };

      API.get.mockResolvedValue({
        data: response,
      });

      const result = await fetchEmployeeById(10);

      expect(API.get).toHaveBeenCalledWith(
        "/employees/10/"
      );

      expect(result).toEqual(response);
    });

    it("should reject when API fails", async () => {
      API.get.mockRejectedValue(
        new Error("Employee not found")
      );

      await expect(
        fetchEmployeeById(10)
      ).rejects.toThrow("Employee not found");
    });
  });

  // =========================================================
  // fetchUpcomingExpiryEmployees
  // =========================================================

  describe("fetchUpcomingExpiryEmployees", () => {
    it("should fetch upcoming expiry employees", async () => {
      const response = [{ id: 1 }];

      API.get.mockResolvedValue({
        data: response,
      });

      const result =
        await fetchUpcomingExpiryEmployees("passport");

      expect(API.get).toHaveBeenCalledWith(
        "/employees/upcoming-expiry/?type=passport"
      );

      expect(result).toEqual(response);
    });

    it("should reject when API fails", async () => {
      API.get.mockRejectedValue(
        new Error("Expiry fetch failed")
      );

      await expect(
        fetchUpcomingExpiryEmployees("visa")
      ).rejects.toThrow("Expiry fetch failed");
    });
  });

  // =========================================================
  // fetchBankPaymentsByEmployee
  // =========================================================

  describe("fetchBankPaymentsByEmployee", () => {
    it("should fetch bank payments successfully", async () => {
      const response = [
        { id: 1, amount: 5000 },
      ];

      API.get.mockResolvedValue({
        data: response,
      });

      const result =
        await fetchBankPaymentsByEmployee(10);

      expect(API.get).toHaveBeenCalledWith(
        "/employees/10/bank-payments/"
      );

      expect(result).toEqual(response);
    });

    it("should throw error when fetching bank payments fails", async () => {
      const error = {
        response: {
          data: {
            detail: "Bank payment fetch failed",
          },
        },
        message: "Request failed",
      };

      API.get.mockRejectedValue(error);

      await expect(
        fetchBankPaymentsByEmployee(10)
      ).rejects.toEqual(error);
    });

    it("should handle bank payment error without response", async () => {
      const error = new Error("Network error");

      API.get.mockRejectedValue(error);

      await expect(
        fetchBankPaymentsByEmployee(10)
      ).rejects.toThrow("Network error");
    });
  });

  // =========================================================
  // createBankPayment
  // =========================================================

  describe("createBankPayment", () => {
    it("should create bank payment", async () => {
      const formData = new FormData();

      formData.append("amount", "5000");

      const response = {
        data: {
          id: 1,
        },
      };

      API.post.mockResolvedValue(response);

      const result =
        await createBankPayment(10, formData);

      expect(API.post).toHaveBeenCalledWith(
        "/employees/10/bank-payments/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      expect(result).toEqual(response);
    });

    it("should reject when createBankPayment fails", async () => {
      API.post.mockRejectedValue(
        new Error("Payment creation failed")
      );

      await expect(
        createBankPayment(10, new FormData())
      ).rejects.toThrow("Payment creation failed");
    });
  });

  // =========================================================
  // updateBankPayment
  // =========================================================

  describe("updateBankPayment", () => {
    it("should update bank payment", async () => {
      const formData = new FormData();

      formData.append("amount", "7000");

      const response = {
        data: {
          id: 20,
          amount: 7000,
        },
      };

      API.put.mockResolvedValue(response);

      const result =
        await updateBankPayment(
          10,
          20,
          formData
        );

      expect(API.put).toHaveBeenCalledWith(
        "/employees/10/bank-payments/20/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      expect(result).toEqual(response);
    });

    it("should reject when updateBankPayment fails", async () => {
      API.put.mockRejectedValue(
        new Error("Payment update failed")
      );

      await expect(
        updateBankPayment(
          10,
          20,
          new FormData()
        )
      ).rejects.toThrow("Payment update failed");
    });
  });

  // =========================================================
  // deleteBankPayment
  // =========================================================

  describe("deleteBankPayment", () => {
    it("should delete bank payment", async () => {
      const response = {
        message: "Deleted",
      };

      API.delete.mockResolvedValue({
        data: response,
      });

      const result =
        await deleteBankPayment(10, 20);

      expect(API.delete).toHaveBeenCalledWith(
        "/employees/10/bank-payments/20/"
      );

      expect(result).toEqual(response);
    });

    it("should throw error when deleteBankPayment fails", async () => {
      const error = {
        response: {
          data: {
            detail: "Delete failed",
          },
        },
        message: "Request failed",
      };

      API.delete.mockRejectedValue(error);

      await expect(
        deleteBankPayment(10, 20)
      ).rejects.toEqual(error);
    });

    it("should handle deleteBankPayment error without response", async () => {
      const error = new Error("Network error");

      API.delete.mockRejectedValue(error);

      await expect(
        deleteBankPayment(10, 20)
      ).rejects.toThrow("Network error");
    });
  });

  // =========================================================
  // fetchAllBankPaymentsByEmployee
  // =========================================================

  describe("fetchAllBankPaymentsByEmployee", () => {
    it("should fetch all bank payments", async () => {
      const response = [
        { id: 1 },
        { id: 2 },
      ];

      API.get.mockResolvedValue({
        data: response,
      });

      const result =
        await fetchAllBankPaymentsByEmployee(10);

      expect(API.get).toHaveBeenCalledWith(
        "/employees/10/bank-payments/"
      );

      expect(result).toEqual(response);
    });

    it("should reject when API fails", async () => {
      API.get.mockRejectedValue(
        new Error("Bank payments failed")
      );

      await expect(
        fetchAllBankPaymentsByEmployee(10)
      ).rejects.toThrow("Bank payments failed");
    });
  });

  // =========================================================
  // uploadTempImage
  // =========================================================

  describe("uploadTempImage", () => {
    it("should upload temporary image", async () => {
      const file = new File(
        ["image content"],
        "profile.jpg",
        {
          type: "image/jpeg",
        }
      );

      const response = {
        url: "http://example.com/profile.jpg",
      };

      API.post.mockResolvedValue({
        data: response,
      });

      const result = await uploadTempImage(file);

      expect(API.post).toHaveBeenCalledTimes(1);

      const [url, formData, config] =
        API.post.mock.calls[0];

      expect(url).toBe("/upload-image/");

      expect(formData).toBeInstanceOf(FormData);

      expect(formData.get("file")).toBe(file);

      expect(config).toEqual({
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      expect(result).toEqual(response);
    });

    it("should reject when image upload fails", async () => {
      API.post.mockRejectedValue(
        new Error("Upload failed")
      );

      const file = new File(
        ["image"],
        "test.jpg",
        {
          type: "image/jpeg",
        }
      );

      await expect(
        uploadTempImage(file)
      ).rejects.toThrow("Upload failed");
    });
  });

  // =========================================================
  // saveEmployeeDocuments
  // =========================================================

  describe("saveEmployeeDocuments", () => {
    it("should save employee documents", async () => {
      const data = {
        passport: "passport.pdf",
      };

      const response = {
        id: 1,
        message: "Documents saved",
      };

      API.post.mockResolvedValue({
        data: response,
      });

      const result =
        await saveEmployeeDocuments(10, data);

      expect(API.post).toHaveBeenCalledWith(
        "/employees/10/documents/",
        data
      );

      expect(result).toEqual(response);
    });

    it("should reject when saving documents fails", async () => {
      API.post.mockRejectedValue(
        new Error("Document save failed")
      );

      await expect(
        saveEmployeeDocuments(10, {})
      ).rejects.toThrow("Document save failed");
    });
  });

  // =========================================================
  // fetchEmployeeDocuments
  // =========================================================

  describe("fetchEmployeeDocuments", () => {
    it("should fetch employee documents", async () => {
      const response = {
        passport: "passport.pdf",
      };

      API.get.mockResolvedValue({
        data: response,
      });

      const result =
        await fetchEmployeeDocuments(10);

      expect(API.get).toHaveBeenCalledWith(
        "/employees/10/documents/"
      );

      expect(result).toEqual(response);
    });

    it("should reject when fetching documents fails", async () => {
      API.get.mockRejectedValue(
        new Error("Document fetch failed")
      );

      await expect(
        fetchEmployeeDocuments(10)
      ).rejects.toThrow("Document fetch failed");
    });
  });

  // =========================================================
  // deleteEmployeeDocument
  // =========================================================

  describe("deleteEmployeeDocument", () => {
    it("should delete employee document", async () => {
      const response = {
        message: "Document deleted",
      };

      API.delete.mockResolvedValue({
        data: response,
      });

      const result =
        await deleteEmployeeDocument(50);

      expect(API.delete).toHaveBeenCalledWith(
        "/documents/50/"
      );

      expect(result).toEqual(response);
    });

    it("should reject when deleting document fails", async () => {
      API.delete.mockRejectedValue(
        new Error("Document delete failed")
      );

      await expect(
        deleteEmployeeDocument(50)
      ).rejects.toThrow(
        "Document delete failed"
      );
    });
  });

  // =========================================================
  // updateEmployeeDocument
  // =========================================================

  describe("updateEmployeeDocument", () => {
    it("should update employee document", async () => {
      const data = {
        document_name: "updated.pdf",
      };

      const response = {
        id: 50,
        document_name: "updated.pdf",
      };

      API.put.mockResolvedValue({
        data: response,
      });

      const result =
        await updateEmployeeDocument(
          50,
          data
        );

      expect(API.put).toHaveBeenCalledWith(
        "/documents/50/",
        data
      );

      expect(result).toEqual(response);
    });

    it("should reject when updating document fails", async () => {
      API.put.mockRejectedValue(
        new Error("Document update failed")
      );

      await expect(
        updateEmployeeDocument(
          50,
          {}
        )
      ).rejects.toThrow(
        "Document update failed"
      );
    });
  });

  // =========================================================
  // updateEmployeeDocuments
  // =========================================================

  describe("updateEmployeeDocuments", () => {
    it("should update employee documents", async () => {
      const formData = new FormData();

      formData.append(
        "document",
        "document.pdf"
      );

      const response = {
        message: "Documents updated",
      };

      API.patch.mockResolvedValue({
        data: response,
      });

      const result =
        await updateEmployeeDocuments(
          10,
          formData
        );

      expect(API.patch).toHaveBeenCalledWith(
        "/employees/10/documents/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      expect(result).toEqual(response);
    });

    it("should reject when updating employee documents fails", async () => {
      API.patch.mockRejectedValue(
        new Error("Documents update failed")
      );

      await expect(
        updateEmployeeDocuments(
          10,
          new FormData()
        )
      ).rejects.toThrow(
        "Documents update failed"
      );
    });
  });

  // =========================================================
  // listEmployeeDash
  // =========================================================

  describe("listEmployeeDash", () => {
    it("should fetch employee dashboard list", async () => {
      const response = {
        employees: [
          { id: 1 },
        ],
      };

      API.get.mockResolvedValue({
        data: response,
      });

      const result =
        await listEmployeeDash(10);

      expect(API.get).toHaveBeenCalledWith(
        "/dashboard/employee/10/"
      );

      expect(result).toEqual(response);
    });

    it("should reject when listEmployeeDash fails", async () => {
      API.get.mockRejectedValue(
        new Error("Dashboard fetch failed")
      );

      await expect(
        listEmployeeDash(10)
      ).rejects.toThrow(
        "Dashboard fetch failed"
      );
    });
  });

  // =========================================================
  // fetchEmployeeDashboard
  // =========================================================

  describe("fetchEmployeeDashboard", () => {
    it("should fetch employee dashboard", async () => {
      const response = {
        attendance: 20,
        leave: 2,
      };

      API.get.mockResolvedValue({
        data: response,
      });

      const result =
        await fetchEmployeeDashboard(10);

      expect(API.get).toHaveBeenCalledWith(
        "/dashboard/employee/10/"
      );

      expect(result).toEqual(response);
    });

    it("should reject when fetchEmployeeDashboard fails", async () => {
      API.get.mockRejectedValue(
        new Error("Dashboard failed")
      );

      await expect(
        fetchEmployeeDashboard(10)
      ).rejects.toThrow(
        "Dashboard failed"
      );
    });
  });

  // =========================================================
  // sendEmail
  // =========================================================

  describe("sendEmail", () => {
    it("should send email successfully", async () => {
      const data = {
        to: "test@example.com",
        subject: "Test",
        message: "Hello",
      };

      const response = {
        message: "Email sent successfully",
      };

      API.post.mockResolvedValue({
        data: response,
      });

      const result = await sendEmail(data);

      expect(API.post).toHaveBeenCalledWith(
        "/email/send/",
        data
      );

      expect(result).toEqual(response);
    });

    it("should reject when sending email fails", async () => {
      API.post.mockRejectedValue(
        new Error("Email failed")
      );

      await expect(
        sendEmail({
          to: "test@example.com",
        })
      ).rejects.toThrow("Email failed");
    });
  });
});

