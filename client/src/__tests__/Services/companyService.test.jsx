import { describe, it, expect, vi, beforeEach } from "vitest";
import API from "../../services/api";
import {
  fetchCompanySelf,
  updateCompanySelf,
} from "../../services/companyService";

vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("companyService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchCompanySelf", () => {
    it("should fetch company details successfully", async () => {
      const mockResponse = {
        id: 1,
        company_name: "ABC Company",
        email: "abc@test.com",
      };

      API.get.mockResolvedValue({
        data: mockResponse,
      });

      const result = await fetchCompanySelf();

      expect(API.get).toHaveBeenCalledTimes(1);
      expect(API.get).toHaveBeenCalledWith("/company/self/");
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if API fails", async () => {
      const error = new Error("Network Error");

      API.get.mockRejectedValue(error);

      await expect(fetchCompanySelf()).rejects.toThrow("Network Error");

      expect(API.get).toHaveBeenCalledWith("/company/self/");
    });
  });

  describe("updateCompanySelf", () => {
    it("should update company successfully", async () => {
      const companyData = {
        company_name: "New Company",
        email: "new@test.com",
      };

      const response = {
        success: true,
      };

      API.patch.mockResolvedValue({
        data: response,
      });

      const result = await updateCompanySelf(companyData);

      expect(API.patch).toHaveBeenCalledTimes(1);

      expect(API.patch).toHaveBeenCalledWith(
        "/company/self/",
        expect.any(FormData),
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      expect(result).toEqual(response);
    });

    it("should ignore undefined and null values", async () => {
      const companyData = {
        company_name: "ABC",
        email: undefined,
        phone: null,
        address: "Kerala",
      };

      API.patch.mockResolvedValue({
        data: {
          success: true,
        },
      });

      await updateCompanySelf(companyData);

      const formData = API.patch.mock.calls[0][1];

      expect(formData.get("company_name")).toBe("ABC");
      expect(formData.get("address")).toBe("Kerala");

      expect(formData.get("email")).toBeNull();
      expect(formData.get("phone")).toBeNull();
    });

    it("should upload file when logo is provided", async () => {
      const file = new File(["dummy"], "logo.png", {
        type: "image/png",
      });

      API.patch.mockResolvedValue({
        data: {
          success: true,
        },
      });

      await updateCompanySelf({
        logo: file,
      });

      const formData = API.patch.mock.calls[0][1];

      expect(formData.get("logo")).toBe(file);
    });

    it("should throw an error if update fails", async () => {
      const error = new Error("Update Failed");

      API.patch.mockRejectedValue(error);

      await expect(
        updateCompanySelf({
          company_name: "ABC",
        })
      ).rejects.toThrow("Update Failed");

      expect(API.patch).toHaveBeenCalled();
    });
  });
});