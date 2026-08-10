import { describe, it, expect, vi, beforeEach } from "vitest";
import API from "../../services/api";
import {
  fetchCompany,
  createCompany,
  fetchCompanyById,
  updateCompany,
  deleteCompany,
  fetchCompanyOverview,
  updateCompanyStatus,
} from "../../services/superAdminService";

vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("superAdminService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchCompany", () => {
    it("should fetch companies without search", async () => {
      const response = {
        data: {
          results: [{ id: 1, name: "ABC Company" }],
        },
      };

      API.get.mockResolvedValue(response);

      const result = await fetchCompany();

      expect(API.get).toHaveBeenCalledWith("/companies/list/?page=1");
      expect(result).toEqual(response.data);
    });

    it("should fetch companies with search", async () => {
      const response = {
        data: {
          results: [{ id: 2, name: "Tech Company" }],
        },
      };

      API.get.mockResolvedValue(response);

      const result = await fetchCompany(2, "tech");

      expect(API.get).toHaveBeenCalledWith(
        "/companies/list/?page=2&search=tech"
      );
      expect(result).toEqual(response.data);
    });
  });

  describe("createCompany", () => {
    it("should create company", async () => {
      const payload = {
        company_name: "ABC",
      };

      const response = {
        data: {
          id: 1,
          ...payload,
        },
      };

      API.post.mockResolvedValue(response);

      const result = await createCompany(payload);

      expect(API.post).toHaveBeenCalledWith(
        "/create-company/",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      expect(result).toEqual(response.data);
    });
  });

  describe("fetchCompanyById", () => {
    it("should fetch company by id", async () => {
      const response = {
        data: {
          id: 5,
          company_name: "Demo",
        },
      };

      API.get.mockResolvedValue(response);

      const result = await fetchCompanyById(5);

      expect(API.get).toHaveBeenCalledWith("/companies/5/");
      expect(result).toEqual(response.data);
    });
  });

  describe("updateCompany", () => {
    it("should update company", async () => {
      const payload = {
        company_name: "Updated Company",
      };

      const response = {
        data: {
          id: 4,
          ...payload,
        },
      };

      API.put.mockResolvedValue(response);

      const result = await updateCompany(4, payload);

      expect(API.put).toHaveBeenCalledWith(
        "/companies/4/",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      expect(result).toEqual(response.data);
    });
  });

  describe("deleteCompany", () => {
    it("should delete company", async () => {
      const response = {
        data: {
          success: true,
        },
      };

      API.delete.mockResolvedValue(response);

      const result = await deleteCompany(6);

      expect(API.delete).toHaveBeenCalledWith("/companies/6/");
      expect(result).toEqual(response.data);
    });
  });

  describe("fetchCompanyOverview", () => {
    it("should fetch company overview", async () => {
      const response = {
        data: {
          totalCompanies: 20,
          activeCompanies: 18,
        },
      };

      API.get.mockResolvedValue(response);

      const result = await fetchCompanyOverview();

      expect(API.get).toHaveBeenCalledWith("/companies/overview/");
      expect(result).toEqual(response.data);
    });
  });

  describe("updateCompanyStatus", () => {
    it("should update company status", async () => {
      const response = {
        data: {
          success: true,
        },
      };

      API.post.mockResolvedValue(response);

      const result = await updateCompanyStatus(10, "freeze");

      expect(API.post).toHaveBeenCalledWith(
        "/subscription/company-status/",
        {
          company_id: 10,
          action: "freeze",
        }
      );

      expect(result).toEqual(response.data);
    });

    it("should activate company", async () => {
      const response = {
        data: {
          success: true,
        },
      };

      API.post.mockResolvedValue(response);

      await updateCompanyStatus(10, "activate");

      expect(API.post).toHaveBeenCalledWith(
        "/subscription/company-status/",
        {
          company_id: 10,
          action: "activate",
        }
      );
    });
  });

  describe("API failures", () => {
    it("should reject when fetchCompany fails", async () => {
      API.get.mockRejectedValue(new Error("API Error"));

      await expect(fetchCompany()).rejects.toThrow("API Error");
    });

    it("should reject when createCompany fails", async () => {
      API.post.mockRejectedValue(new Error("Create Error"));

      await expect(createCompany({})).rejects.toThrow("Create Error");
    });

    it("should reject when fetchCompanyById fails", async () => {
      API.get.mockRejectedValue(new Error("Fetch Error"));

      await expect(fetchCompanyById(1)).rejects.toThrow("Fetch Error");
    });

    it("should reject when updateCompany fails", async () => {
      API.put.mockRejectedValue(new Error("Update Error"));

      await expect(updateCompany(1, {})).rejects.toThrow("Update Error");
    });

    it("should reject when deleteCompany fails", async () => {
      API.delete.mockRejectedValue(new Error("Delete Error"));

      await expect(deleteCompany(1)).rejects.toThrow("Delete Error");
    });

    it("should reject when fetchCompanyOverview fails", async () => {
      API.get.mockRejectedValue(new Error("Overview Error"));

      await expect(fetchCompanyOverview()).rejects.toThrow("Overview Error");
    });

    it("should reject when updateCompanyStatus fails", async () => {
      API.post.mockRejectedValue(new Error("Status Error"));

      await expect(
        updateCompanyStatus(1, "freeze")
      ).rejects.toThrow("Status Error");
    });
  });
});