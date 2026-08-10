import { describe, it, expect, vi, beforeEach } from "vitest";

const {
  mockCreateEmployee,
  mockUpdateEmployee,
  mockCreateBankPayment,
  mockUpdateBankPayment,
  mockDeleteBankPaymentAPI,
  mockUploadTempImage,
  mockSaveEmployeeDocuments,
  mockFetchAllEmployees,
  mockFetchEmployeeById,
  mockFetchAllBankPaymentsByEmployee,
  mockFetchEmployeeDocuments,
  mockDeleteEmployeeDocument,
  mockUpdateEmployeeDocument,
  mockUpdateEmployeeDocuments,
  mockApiGet,
  mockApiDelete,
} = vi.hoisted(() => ({
  mockCreateEmployee: vi.fn(),
  mockUpdateEmployee: vi.fn(),
  mockCreateBankPayment: vi.fn(),
  mockUpdateBankPayment: vi.fn(),
  mockDeleteBankPaymentAPI: vi.fn(),
  mockUploadTempImage: vi.fn(),
  mockSaveEmployeeDocuments: vi.fn(),
  mockFetchAllEmployees: vi.fn(),
  mockFetchEmployeeById: vi.fn(),
  mockFetchAllBankPaymentsByEmployee: vi.fn(),
  mockFetchEmployeeDocuments: vi.fn(),
  mockDeleteEmployeeDocument: vi.fn(),
  mockUpdateEmployeeDocument: vi.fn(),
  mockUpdateEmployeeDocuments: vi.fn(),
  mockApiGet: vi.fn(),
  mockApiDelete: vi.fn(),
}));

vi.mock("../../services/employeeService", () => ({
  createEmployee: mockCreateEmployee,
  updateEmployee: mockUpdateEmployee,
  createBankPayment: mockCreateBankPayment,
  updateBankPayment: mockUpdateBankPayment,
  deleteBankPayment: mockDeleteBankPaymentAPI,
  uploadTempImage: mockUploadTempImage,
  saveEmployeeDocuments: mockSaveEmployeeDocuments,
  fetchAllEmployees: mockFetchAllEmployees,
  fetchEmployeeById: mockFetchEmployeeById,
  fetchAllBankPaymentsByEmployee: mockFetchAllBankPaymentsByEmployee,
  fetchEmployeeDocuments: mockFetchEmployeeDocuments,
  deleteEmployeeDocument: mockDeleteEmployeeDocument,
  updateEmployeeDocument: mockUpdateEmployeeDocument,
  updateEmployeeDocuments: mockUpdateEmployeeDocuments,
}));

vi.mock("../../services/api", () => ({
  default: {
    get: mockApiGet,
    delete: mockApiDelete,
  },
}));

import reducer, {
  submitEmployee,
  deleteEmployeeById,
  submitBankPayment,
  deleteBankPayment,
  getEmployeeById,
  getAllEmployees,
  getUpcomingExpiryEmployees,
  fetchAllBankPaymentsThunk,
  submitDocumentsThunk,
  getEmployeeDocumentsThunk,
  updateEmployeeDocumentThunk,
  updateEmployeeDocumentsThunk,
  deleteDocumentThunk,
  uploadImageThunk,
  setEmployeeId,
  setBankFormData,
  setBasicFormData,
  setBankPaymentId,
  addDocumentUrl,
  removeDocumentUrl,
  clearDocumentUrls,
  clearBankPayment,
} from "../../Redux/employeeSlice";

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

const getInitialState = () => reducer(undefined, { type: "@@INIT" });

const makeError = (data, message = "Something went wrong") => ({
  response: data !== undefined ? { data } : undefined,
  message,
});

beforeEach(() => {
  vi.clearAllMocks();
});

// =============================================================================
// INITIAL STATE
// =============================================================================

describe("employeeSlice - initial state", () => {
  it("returns the correct initial state", () => {
    const state = getInitialState();

    expect(state).toEqual({
      status: "idle",
      error: null,
      loading: false,
      employeeCreated: false,
      employeeId: null,
      bankPaymentId: null,
      formData: {},
      isDirty: false,
      documentUrls: {
        passport: [],
        workPermit: [],
        contract: [],
        insurance: [],
        certificate: [],
      },
      documentList: [],
      employeeDocuments: [],
      employeeBankPayments: [],
      employeeList: [],
      pagination: {
        count: 0,
        next: null,
        previous: null,
      },
    });
  });
});

// =============================================================================
// NORMAL REDUCERS
// =============================================================================

describe("employeeSlice - reducers", () => {
  it("setEmployeeId", () => {
    const state = reducer(getInitialState(), setEmployeeId(123));

    expect(state.employeeId).toBe(123);
  });

  it("setBankFormData", () => {
    const bankData = {
      bank_name: "ABC Bank",
      account_number: "123456",
    };

    const state = reducer(getInitialState(), setBankFormData(bankData));

    expect(state.formData.bank).toEqual(bankData);
    expect(state.isDirty).toBe(true);
  });

  it("setBasicFormData", () => {
    const basicData = {
      first_name: "John",
      last_name: "Doe",
    };

    const state = reducer(getInitialState(), setBasicFormData(basicData));

    expect(state.formData.basic).toEqual(basicData);
    expect(state.isDirty).toBe(true);
  });

  it("setBankPaymentId", () => {
    const state = reducer(getInitialState(), setBankPaymentId(55));

    expect(state.bankPaymentId).toBe(55);
  });

  it("clearBankPayment", () => {
    const previousState = {
      ...getInitialState(),
      bankPayment: {
        id: 1,
      },
      formData: {
        bank: {
          account_number: "123",
        },
      },
    };

    const state = reducer(previousState, clearBankPayment());

    expect(state.bankPayment).toBeNull();
    expect(state.formData.bank).toBeNull();
  });

  it("addDocumentUrl", () => {
    const state = reducer(
      getInitialState(),
      addDocumentUrl({
        type: "passport",
        url: "passport.pdf",
      }),
    );

    expect(state.documentUrls.passport).toEqual(["passport.pdf"]);
  });

  it("add multiple document URLs", () => {
    let state = getInitialState();

    state = reducer(
      state,
      addDocumentUrl({
        type: "passport",
        url: "passport1.pdf",
      }),
    );

    state = reducer(
      state,
      addDocumentUrl({
        type: "passport",
        url: "passport2.pdf",
      }),
    );

    expect(state.documentUrls.passport).toEqual([
      "passport1.pdf",
      "passport2.pdf",
    ]);
  });

  it("removeDocumentUrl", () => {
    const previousState = {
      ...getInitialState(),
      documentUrls: {
        passport: ["one.pdf", "two.pdf"],
        workPermit: [],
        contract: [],
        insurance: [],
        certificate: [],
      },
    };

    const state = reducer(
      previousState,
      removeDocumentUrl({
        type: "passport",
        index: 0,
      }),
    );

    expect(state.documentUrls.passport).toEqual(["two.pdf"]);
  });

  it("clearDocumentUrls", () => {
    const previousState = {
      ...getInitialState(),
      documentUrls: {
        passport: ["passport.pdf"],
        workPermit: ["permit.pdf"],
        contract: ["contract.pdf"],
        insurance: ["insurance.pdf"],
        certificate: ["certificate.pdf"],
      },
    };

    const state = reducer(previousState, clearDocumentUrls());

    expect(state.documentUrls).toEqual({
      passport: [],
      workPermit: [],
      contract: [],
      insurance: [],
      certificate: [],
    });
  });
});

// =============================================================================
// submitEmployee
// =============================================================================

describe("submitEmployee", () => {
  it("handles nested basic and bank data and creates employee", async () => {
    mockCreateEmployee.mockResolvedValue({
      id: 101,
    });

    const file = new File(["profile"], "profile.png", {
      type: "image/png",
    });

    const idCard = new File(["idcard"], "idcard.png", {
      type: "image/png",
    });

    const formData = {
      basic: {
        first_name: "John",
        last_name: "Doe",
        department: 5,
        profile_pic: file,
        idcard: idCard,

        // These should be skipped
        emptyValue: "",
        nullValue: null,
        undefinedValue: undefined,
      },

      bank: {
        bank_name: "ABC Bank",
        account_number: "12345",
      },
    };

    const result = await submitEmployee(formData)(vi.fn(), vi.fn(), {});

    expect(result.type).toContain("fulfilled");
    expect(mockCreateEmployee).toHaveBeenCalledTimes(1);

    const form = mockCreateEmployee.mock.calls[0][0];

    expect(form).toBeInstanceOf(FormData);
    expect(form.get("first_name")).toBe("John");
    expect(form.get("last_name")).toBe("Doe");
    expect(form.get("department_id")).toBe("5");
    expect(form.get("profile_pic")).toBe(file);
    expect(form.get("idcard")).toBe(idCard);
    expect(form.get("bank_name")).toBe("ABC Bank");
    expect(form.get("account_number")).toBe("12345");

    expect(form.get("emptyValue")).toBeNull();
    expect(form.get("nullValue")).toBeNull();
  });

  it("handles flat form data and creates employee", async () => {
    mockCreateEmployee.mockResolvedValue({
      id: 102,
    });

    const formData = {
      first_name: "Jane",
      department: 10,
      salary: 5000,
    };

    const result = await submitEmployee(formData)(vi.fn(), vi.fn(), {});

    expect(result.type).toContain("fulfilled");
    expect(mockCreateEmployee).toHaveBeenCalledTimes(1);

    const form = mockCreateEmployee.mock.calls[0][0];

    expect(form.get("first_name")).toBe("Jane");
    expect(form.get("department_id")).toBe("10");
    expect(form.get("salary")).toBe("5000");
  });

  it("updates employee when id exists", async () => {
    mockUpdateEmployee.mockResolvedValue({
      id: 200,
      first_name: "Updated",
    });

    const formData = {
      id: 200,
      basic: {
        first_name: "Updated",
      },
    };

    const result = await submitEmployee(formData)(vi.fn(), vi.fn(), {});

    expect(result.type).toContain("fulfilled");

    expect(mockUpdateEmployee).toHaveBeenCalledTimes(1);
    expect(mockUpdateEmployee).toHaveBeenCalledWith(200, expect.any(FormData));

    expect(mockCreateEmployee).not.toHaveBeenCalled();
  });

  it("handles non-file profile_pic and idcard values", async () => {
    mockCreateEmployee.mockResolvedValue({
      id: 300,
    });

    const formData = {
      profile_pic: "existing-profile-url",
      idcard: "existing-id-url",
      first_name: "Test",
    };

    await submitEmployee(formData)(vi.fn(), vi.fn(), {});

    const form = mockCreateEmployee.mock.calls[0][0];

    // Because the source only appends profile_pic/idcard
    // when the value is a File, they should not be appended.
    expect(form.get("profile_pic")).toBeNull();
    expect(form.get("idcard")).toBeNull();

    expect(form.get("first_name")).toBe("Test");
  });

  it("handles empty or missing nested objects", async () => {
    mockCreateEmployee.mockResolvedValue({
      id: 400,
    });

    await submitEmployee({
      basic: {},
      bank: {},
    })(vi.fn(), vi.fn(), {});

    expect(mockCreateEmployee).toHaveBeenCalledTimes(1);
    expect(mockCreateEmployee.mock.calls[0][0]).toBeInstanceOf(FormData);
  });

  it("handles null formData values", async () => {
    mockCreateEmployee.mockResolvedValue({
      id: 401,
    });

    await submitEmployee({
      name: null,
      age: undefined,
      empty: "",
    })(vi.fn(), vi.fn(), {});

    expect(mockCreateEmployee).toHaveBeenCalledTimes(1);
  });

  it("rejects when createEmployee fails with response data", async () => {
    mockCreateEmployee.mockRejectedValue(
      makeError(
        {
          detail: "Employee creation failed",
        },
        "Creation failed",
      ),
    );

    const result = await submitEmployee({
      first_name: "John",
    })(vi.fn(), vi.fn(), {});

    expect(result.type).toContain("rejected");
    expect(result.payload).toEqual({
      detail: "Employee creation failed",
    });
  });

  it("rejects when createEmployee fails without response", async () => {
    mockCreateEmployee.mockRejectedValue(new Error("Network error"));

    const result = await submitEmployee({
      first_name: "John",
    })(vi.fn(), vi.fn(), {});

    expect(result.type).toContain("rejected");
    expect(result.payload).toBe("Network error");
  });

  it("rejects when updateEmployee fails", async () => {
    mockUpdateEmployee.mockRejectedValue(
      makeError({
        detail: "Update failed",
      }),
    );

    const result = await submitEmployee({
      id: 500,
      first_name: "Updated",
    })(vi.fn(), vi.fn(), {});

    expect(result.type).toContain("rejected");
    expect(result.payload).toEqual({
      detail: "Update failed",
    });
  });
});

// =============================================================================
// deleteEmployeeById
// =============================================================================

describe("deleteEmployeeById", () => {
  it("deletes employee successfully", async () => {
    mockApiDelete.mockResolvedValue({
      data: {},
    });

    const result = await deleteEmployeeById(10)(vi.fn(), vi.fn(), {});

    expect(result.type).toContain("fulfilled");
    expect(result.payload).toBe(10);

    expect(mockApiDelete).toHaveBeenCalledWith("/employees/10/");
  });

  it("handles delete employee error with response", async () => {
    mockApiDelete.mockRejectedValue(
      makeError({
        detail: "Unable to delete employee",
      }),
    );

    const result = await deleteEmployeeById(10)(vi.fn(), vi.fn(), {});

    expect(result.type).toContain("rejected");

    expect(result.payload).toEqual({
      detail: "Unable to delete employee",
    });
  });

  it("handles delete employee error without response", async () => {
    mockApiDelete.mockRejectedValue(new Error("Delete failed"));

    const result = await deleteEmployeeById(11)(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe("Delete failed");
  });
});

// =============================================================================
// submitBankPayment
// =============================================================================

describe("submitBankPayment", () => {
  it("creates bank payment when paymentId is missing", async () => {
    mockCreateBankPayment.mockResolvedValue({
      data: {
        id: 1,
        amount: 500,
      },
    });

    const result = await submitBankPayment({
      employeeId: 10,
      data: {
        amount: 500,
      },
    })(vi.fn(), vi.fn(), {});

    expect(result.type).toContain("fulfilled");

    expect(mockCreateBankPayment).toHaveBeenCalledWith(10, {
      amount: 500,
    });

    expect(result.payload).toEqual({
      id: 1,
      amount: 500,
    });
  });

  it("updates bank payment when paymentId exists", async () => {
    mockUpdateBankPayment.mockResolvedValue({
      data: {
        id: 20,
        amount: 1000,
      },
    });

    const result = await submitBankPayment({
      employeeId: 10,
      paymentId: 20,
      data: {
        amount: 1000,
      },
    })(vi.fn(), vi.fn(), {});

    expect(mockUpdateBankPayment).toHaveBeenCalledWith(10, 20, {
      amount: 1000,
    });

    expect(result.payload).toEqual({
      id: 20,
      amount: 1000,
    });
  });

  it("handles bank payment error", async () => {
    mockCreateBankPayment.mockRejectedValue(
      makeError({
        detail: "Payment failed",
      }),
    );

    const result = await submitBankPayment({
      employeeId: 10,
      data: {},
    })(vi.fn(), vi.fn(), {});

    expect(result.type).toContain("rejected");

    expect(result.payload).toEqual({
      detail: "Payment failed",
    });
  });
});

// =============================================================================
// deleteBankPayment
// =============================================================================

describe("deleteBankPayment", () => {
  it("deletes bank payment successfully", async () => {
    mockDeleteBankPaymentAPI.mockResolvedValue({});

    const result = await deleteBankPayment({
      employeeId: 10,
      paymentId: 55,
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe(55);

    expect(mockDeleteBankPaymentAPI).toHaveBeenCalledWith(10, 55);
  });

  it("handles delete bank payment error with response", async () => {
    mockDeleteBankPaymentAPI.mockRejectedValue(
      makeError({
        detail: "Cannot delete payment",
      }),
    );

    const result = await deleteBankPayment({
      employeeId: 10,
      paymentId: 55,
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toEqual({
      detail: "Cannot delete payment",
    });
  });

  it("handles delete bank payment error without response", async () => {
    mockDeleteBankPaymentAPI.mockRejectedValue(new Error("Failed to delete"));

    const result = await deleteBankPayment({
      employeeId: 10,
      paymentId: 55,
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe("Failed to delete bank payment");
  });
});

// =============================================================================
// getEmployeeById
// =============================================================================

describe("getEmployeeById", () => {
  it("fetches employee successfully", async () => {
    const employee = {
      id: 1,
      name: "John",
    };

    mockFetchEmployeeById.mockResolvedValue(employee);

    const result = await getEmployeeById(1)(vi.fn(), vi.fn(), {});

    expect(result.payload).toEqual(employee);
    expect(mockFetchEmployeeById).toHaveBeenCalledWith(1);
  });

  it("handles fetch employee error with response", async () => {
    mockFetchEmployeeById.mockRejectedValue(
      makeError({
        detail: "Employee not found",
      }),
    );

    const result = await getEmployeeById(999)(vi.fn(), vi.fn(), {});

    expect(result.payload).toEqual({
      detail: "Employee not found",
    });
  });

  it("handles fetch employee error without response", async () => {
    mockFetchEmployeeById.mockRejectedValue(new Error("Failed to fetch"));

    const result = await getEmployeeById(999)(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe("Failed to fetch employee");
  });
});

// =============================================================================
// getAllEmployees
// =============================================================================

describe("getAllEmployees", () => {
  it("fetches all employees successfully", async () => {
    const response = {
      results: [
        {
          id: 1,
          name: "John",
        },
      ],
      count: 1,
      total_pages: 1,
      current_page: 1,
      next: null,
      previous: null,
    };

    mockFetchAllEmployees.mockResolvedValue(response);

    const result = await getAllEmployees({
      page: 1,
      search: "John",
      department_id: 2,
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toEqual(response);

    expect(mockFetchAllEmployees).toHaveBeenCalledWith(1, "John", 2);
  });

  it("handles get all employees error with response", async () => {
    mockFetchAllEmployees.mockRejectedValue(
      makeError({
        detail: "Server error",
      }),
    );

    const result = await getAllEmployees({
      page: 1,
      search: "",
      department_id: null,
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toEqual({
      detail: "Server error",
    });
  });

  it("handles get all employees error without response", async () => {
    mockFetchAllEmployees.mockRejectedValue(new Error("Network error"));

    const result = await getAllEmployees({
      page: 1,
      search: "",
      department_id: null,
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe("Server error");
  });
});

// =============================================================================
// getUpcomingExpiryEmployees
// =============================================================================

describe("getUpcomingExpiryEmployees", () => {
  it("fetches upcoming expiry employees successfully", async () => {
    mockApiGet.mockResolvedValue({
      data: {
        results: [
          {
            id: 1,
            name: "John",
          },
        ],
        count: 1,
        total_pages: 1,
        current_page: 1,
        next: null,
        previous: null,
      },
    });

    const result = await getUpcomingExpiryEmployees({
      expiryType: "passport",
      page: 2,
      search: "John",
    })(vi.fn(), vi.fn(), {});

    expect(result.payload.results).toHaveLength(1);

    expect(mockApiGet).toHaveBeenCalledWith(
      "/employees/upcoming-expiry/?type=passport&page=2&search=John",
    );
  });

  it("uses default page and search", async () => {
    mockApiGet.mockResolvedValue({
      data: {
        results: [],
      },
    });

    await getUpcomingExpiryEmployees({
      expiryType: "contract",
    })(vi.fn(), vi.fn(), {});

    expect(mockApiGet).toHaveBeenCalledWith(
      "/employees/upcoming-expiry/?type=contract&page=1&search=",
    );
  });

  it("handles upcoming expiry error with response", async () => {
    mockApiGet.mockRejectedValue(
      makeError({
        detail: "Unable to fetch expiry employees",
      }),
    );

    const result = await getUpcomingExpiryEmployees({
      expiryType: "passport",
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toEqual({
      detail: "Unable to fetch expiry employees",
    });
  });

  it("handles upcoming expiry error without response", async () => {
    mockApiGet.mockRejectedValue(new Error("Network failure"));

    const result = await getUpcomingExpiryEmployees({
      expiryType: "passport",
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe("Network failure");
  });
});

// =============================================================================
// fetchAllBankPaymentsThunk
// =============================================================================

describe("fetchAllBankPaymentsThunk", () => {
  it("fetches bank payments", async () => {
    const payments = [
      {
        id: 1,
        amount: 500,
      },
      {
        id: 2,
        amount: 1000,
      },
    ];

    mockFetchAllBankPaymentsByEmployee.mockResolvedValue(payments);

    const result = await fetchAllBankPaymentsThunk(10)(vi.fn(), vi.fn(), {});

    expect(result.payload).toEqual(payments);

    expect(mockFetchAllBankPaymentsByEmployee).toHaveBeenCalledWith(10);
  });
});

// =============================================================================
// submitDocumentsThunk
// =============================================================================

describe("submitDocumentsThunk", () => {
  it("submits employee documents successfully", async () => {
    const documents = [
      {
        id: 1,
        type: "passport",
      },
    ];

    mockSaveEmployeeDocuments.mockResolvedValue(documents);

    const result = await submitDocumentsThunk({
      employeeId: 10,
      documents,
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toEqual(documents);

    expect(mockSaveEmployeeDocuments).toHaveBeenCalledWith(10, documents);
  });

  it("handles document submission error with response", async () => {
    mockSaveEmployeeDocuments.mockRejectedValue(
      makeError({
        detail: "Document upload failed",
      }),
    );

    const result = await submitDocumentsThunk({
      employeeId: 10,
      documents: [],
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toEqual({
      detail: "Document upload failed",
    });
  });

  it("handles document submission error without response", async () => {
    mockSaveEmployeeDocuments.mockRejectedValue(new Error("Upload failed"));

    const result = await submitDocumentsThunk({
      employeeId: 10,
      documents: [],
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe("Document submission failed");
  });
});

// =============================================================================
// getEmployeeDocumentsThunk
// =============================================================================

describe("getEmployeeDocumentsThunk", () => {
  it("fetches employee documents successfully", async () => {
    const documents = [
      {
        id: 1,
        type: "passport",
      },
    ];

    mockFetchEmployeeDocuments.mockResolvedValue(documents);

    const result = await getEmployeeDocumentsThunk(10)(vi.fn(), vi.fn(), {});

    expect(result.payload).toEqual(documents);

    expect(mockFetchEmployeeDocuments).toHaveBeenCalledWith(10);
  });

  it("handles document fetch error with response", async () => {
    mockFetchEmployeeDocuments.mockRejectedValue(
      makeError({
        detail: "Documents not found",
      }),
    );

    const result = await getEmployeeDocumentsThunk(10)(vi.fn(), vi.fn(), {});

    expect(result.payload).toEqual({
      detail: "Documents not found",
    });
  });

  it("handles document fetch error without response", async () => {
    mockFetchEmployeeDocuments.mockRejectedValue(new Error("Network error"));

    const result = await getEmployeeDocumentsThunk(10)(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe("Error fetching documents");
  });
});

// =============================================================================
// updateEmployeeDocumentThunk
// =============================================================================

describe("updateEmployeeDocumentThunk", () => {
  it("updates single employee document successfully", async () => {
    const response = {
      id: 10,
      passport: "updated.pdf",
    };

    mockUpdateEmployeeDocument.mockResolvedValue(response);

    const result = await updateEmployeeDocumentThunk({
      docId: 10,
      data: {
        passport: "updated.pdf",
      },
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toEqual(response);

    expect(mockUpdateEmployeeDocument).toHaveBeenCalledWith(10, {
      passport: "updated.pdf",
    });
  });

  it("handles update document error with response", async () => {
    mockUpdateEmployeeDocument.mockRejectedValue(
      makeError({
        detail: "Document update failed",
      }),
    );

    const result = await updateEmployeeDocumentThunk({
      docId: 10,
      data: {},
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toEqual({
      detail: "Document update failed",
    });
  });

  it("handles update document error without response", async () => {
    mockUpdateEmployeeDocument.mockRejectedValue(new Error("Update error"));

    const result = await updateEmployeeDocumentThunk({
      docId: 10,
      data: {},
    })(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe("Error updating document");
  });
});

// =============================================================================
// updateEmployeeDocumentsThunk
// =============================================================================

describe("updateEmployeeDocumentsThunk", () => {
  it("updates documents and dispatches refresh", async () => {
    const dispatch = vi.fn();

    const response = {
      id: 10,
      passport: "passport.pdf",
    };

    mockUpdateEmployeeDocuments.mockResolvedValue(response);

    const result = await updateEmployeeDocumentsThunk({
      id: 10,
      form: {
        passport: "passport.pdf",
      },
    })(dispatch, vi.fn(), {});

    expect(result.type).toContain("fulfilled");
    expect(result.payload).toEqual(response);

    expect(mockUpdateEmployeeDocuments).toHaveBeenCalledWith(10, {
      passport: "passport.pdf",
    });

    // updateEmployeeDocumentsThunk should dispatch the refresh thunk.
    expect(dispatch).toHaveBeenCalled();

    // A thunk is dispatched as a function, not as a pending action object.
    const refreshDispatch = dispatch.mock.calls.find(
      ([action]) => typeof action === "function",
    );

    expect(refreshDispatch).toBeDefined();
  });

  it("handles update documents error with response", async () => {
    mockUpdateEmployeeDocuments.mockRejectedValue(
      makeError({
        detail: "Update documents failed",
      }),
    );

    const result = await updateEmployeeDocumentsThunk({
      id: 10,
      form: {},
    })(vi.fn(), vi.fn(), {});

    expect(result.type).toContain("rejected");

    expect(result.payload).toEqual({
      detail: "Update documents failed",
    });
  });

  it("handles update documents error without response", async () => {
    mockUpdateEmployeeDocuments.mockRejectedValue(new Error("Update failed"));

    const result = await updateEmployeeDocumentsThunk({
      id: 10,
      form: {},
    })(vi.fn(), vi.fn(), {});

    expect(result.type).toContain("rejected");

    expect(result.payload).toBe("Update failed");
  });
});

// =============================================================================
// deleteDocumentThunk
// =============================================================================

describe("deleteDocumentThunk", () => {
  it("deletes document successfully", async () => {
    mockDeleteEmployeeDocument.mockResolvedValue({});

    const result = await deleteDocumentThunk(50)(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe(50);

    expect(mockDeleteEmployeeDocument).toHaveBeenCalledWith(50);
  });

  it("handles delete document error with response", async () => {
    mockDeleteEmployeeDocument.mockRejectedValue(
      makeError({
        detail: "Unable to delete document",
      }),
    );

    const result = await deleteDocumentThunk(50)(vi.fn(), vi.fn(), {});

    expect(result.payload).toEqual({
      detail: "Unable to delete document",
    });
  });

  it("handles delete document error without response", async () => {
    mockDeleteEmployeeDocument.mockRejectedValue(new Error("Delete error"));

    const result = await deleteDocumentThunk(50)(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe("Delete failed");
  });
});

// =============================================================================
// uploadImageThunk
// =============================================================================

describe("uploadImageThunk", () => {
  it("uploads image successfully", async () => {
    const file = new File(["image"], "test.png", {
      type: "image/png",
    });

    mockUploadTempImage.mockResolvedValue({
      url: "https://example.com/test.png",
    });

    const result = await uploadImageThunk(file)(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe("https://example.com/test.png");

    expect(mockUploadTempImage).toHaveBeenCalledWith(file);
  });

  it("handles upload error with response", async () => {
    mockUploadTempImage.mockRejectedValue(
      makeError({
        detail: "Image upload failed",
      }),
    );

    const file = new File(["image"], "test.png");

    const result = await uploadImageThunk(file)(vi.fn(), vi.fn(), {});

    expect(result.payload).toEqual({
      detail: "Image upload failed",
    });
  });

  it("handles upload error without response", async () => {
    mockUploadTempImage.mockRejectedValue(new Error("Upload network error"));

    const file = new File(["image"], "test.png");

    const result = await uploadImageThunk(file)(vi.fn(), vi.fn(), {});

    expect(result.payload).toBe("Upload network error");
  });
});

// =============================================================================
// deleteEmployeeDocumentImageThunk
// =============================================================================

describe("deleteEmployeeDocumentImageThunk", () => {
  it("handles the thunk when axiosPrivate is unavailable", async () => {
    /*
     * The current source references axiosPrivate but does not import it.
     *
     * The thunk enters the try block and then throws because axiosPrivate
     * is undefined. The catch block is therefore covered.
     *
     * Fix the source by importing axiosPrivate from your API module if
     * you want to test the successful API path too.
     */

    const result = await (
      await import("../../Redux/employeeSlice")
    ).deleteEmployeeDocumentImageThunk({
      id: 10,
      field: "passport",
      url: "passport.pdf",
    })(vi.fn(), vi.fn(), {});

    expect(result.type).toContain("rejected");
  });
});

// =============================================================================
// EXTRA REDUCERS - submitEmployee
// =============================================================================

describe("extraReducers - submitEmployee", () => {
  it("handles submitEmployee.pending", () => {
    const state = reducer(
      getInitialState(),
      submitEmployee.pending("request-id", {}),
    );

    expect(state.status).toBe("loading");
    expect(state.error).toBeNull();
  });

  it("handles submitEmployee.fulfilled with direct id", () => {
    const state = reducer(
      getInitialState(),
      submitEmployee.fulfilled(
        {
          id: 100,
        },
        "request-id",
        {},
      ),
    );

    expect(state.status).toBe("succeeded");
    expect(state.employeeId).toBe(100);
    expect(state.employeeCreated).toBe(true);
    expect(state.isDirty).toBe(false);
  });

  it("handles submitEmployee.fulfilled with nested employee id", () => {
    const state = reducer(
      getInitialState(),
      submitEmployee.fulfilled(
        {
          employee: {
            id: 200,
          },
        },
        "request-id",
        {},
      ),
    );

    expect(state.employeeId).toBe(200);
    expect(state.employeeCreated).toBe(true);
  });

  it("handles submitEmployee.fulfilled without id", () => {
    const state = reducer(
      {
        ...getInitialState(),
        employeeId: 999,
      },
      submitEmployee.fulfilled({}, "request-id", {}),
    );

    expect(state.employeeId).toBeUndefined();
    expect(state.employeeCreated).toBe(true);
  });

  it("handles submitEmployee.rejected", () => {
    const state = reducer(
      getInitialState(),
      submitEmployee.rejected(
        new Error("Failed"),
        "request-id",
        {},
        {
          detail: "Invalid employee",
        },
      ),
    );

    expect(state.status).toBe("failed");
    expect(state.error).toEqual({
      detail: "Invalid employee",
    });
  });
});

// =============================================================================
// EXTRA REDUCERS - UPDATE DOCUMENT
// =============================================================================

describe("extraReducers - updateEmployeeDocumentThunk", () => {
  it("handles pending", () => {
    const state = reducer(
      getInitialState(),
      updateEmployeeDocumentThunk.pending("request-id", {}),
    );

    expect(state.updateStatus).toBe("loading");
    expect(state.updateError).toBeNull();
  });

  it("handles fulfilled and merges document data", () => {
    const state = reducer(
      {
        ...getInitialState(),
        employeeDocuments: {
          id: 1,
          passport: "old.pdf",
          contract: "contract.pdf",
        },
      },
      updateEmployeeDocumentThunk.fulfilled(
        {
          passport: "new.pdf",
        },
        "request-id",
        {},
      ),
    );

    expect(state.updateStatus).toBe("succeeded");

    expect(state.employeeDocuments).toEqual({
      id: 1,
      passport: "new.pdf",
      contract: "contract.pdf",
    });
  });

  it("handles fulfilled when employeeDocuments is an array", () => {
    const state = reducer(
      {
        ...getInitialState(),
        employeeDocuments: [
          {
            id: 1,
          },
        ],
      },
      updateEmployeeDocumentThunk.fulfilled(
        {
          passport: "passport.pdf",
        },
        "request-id",
        {},
      ),
    );

    expect(state.updateStatus).toBe("succeeded");

    expect(state.employeeDocuments).toEqual({
      0: {
        id: 1,
      },
      passport: "passport.pdf",
    });
  });

  it("handles rejected", () => {
    const state = reducer(
      getInitialState(),
      updateEmployeeDocumentThunk.rejected(
        new Error("Failed"),
        "request-id",
        {},
        {
          detail: "Unable to update",
        },
      ),
    );

    expect(state.updateStatus).toBe("failed");
    expect(state.updateError).toEqual({
      detail: "Unable to update",
    });
  });
});

// =============================================================================
// EXTRA REDUCERS - UPCOMING EXPIRY
// =============================================================================

describe("extraReducers - getUpcomingExpiryEmployees", () => {
  it("handles pending", () => {
    const state = reducer(
      getInitialState(),
      getUpcomingExpiryEmployees.pending("request-id", {}),
    );

    expect(state.loading).toBe(true);
  });

  it("handles fulfilled with complete pagination", () => {
    const payload = {
      results: [
        {
          id: 1,
        },
      ],
      count: 10,
      total_pages: 5,
      current_page: 2,
      next: "/next",
      previous: "/previous",
    };

    const state = reducer(
      getInitialState(),
      getUpcomingExpiryEmployees.fulfilled(payload, "request-id", {}),
    );

    expect(state.loading).toBe(false);
    expect(state.employeeList).toEqual(payload.results);
    expect(state.pagination).toEqual({
      count: 10,
      total_pages: 5,
      current_page: 2,
      next: "/next",
      previous: "/previous",
    });
  });

  it("handles fulfilled with missing pagination values", () => {
    const state = reducer(
      getInitialState(),
      getUpcomingExpiryEmployees.fulfilled({}, "request-id", {}),
    );

    expect(state.loading).toBe(false);
    expect(state.employeeList).toEqual([]);

    expect(state.pagination).toEqual({
      count: 0,
      total_pages: 1,
      current_page: 1,
      next: null,
      previous: null,
    });
  });

  it("handles rejected", () => {
    const state = reducer(
      getInitialState(),
      getUpcomingExpiryEmployees.rejected(
        new Error("Failed"),
        "request-id",
        {},
        "Server unavailable",
      ),
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Server unavailable");
  });
});

// =============================================================================
// EXTRA REDUCERS - BANK PAYMENTS
// =============================================================================

describe("extraReducers - bank payments", () => {
  it("adds new bank payment", () => {
    const payment = {
      id: 10,
      amount: 500,
    };

    const state = reducer(
      getInitialState(),
      submitBankPayment.fulfilled(payment, "request-id", {}),
    );

    expect(state.employeeBankPayments).toEqual([payment]);
  });

  it("updates existing bank payment", () => {
    const existing = {
      id: 10,
      amount: 500,
    };

    const updated = {
      id: 10,
      amount: 1000,
    };

    const state = reducer(
      {
        ...getInitialState(),
        employeeBankPayments: [existing],
      },
      submitBankPayment.fulfilled(updated, "request-id", {}),
    );

    expect(state.employeeBankPayments).toEqual([updated]);
  });

  it("uses fallback when employeeBankPayments is not an array", () => {
    const payment = {
      id: 20,
      amount: 2000,
    };

    const state = reducer(
      {
        ...getInitialState(),
        employeeBankPayments: null,
      },
      submitBankPayment.fulfilled(payment, "request-id", {}),
    );

    /*
     * The reducer first converts null to [payment],
     * then finds payment.id and updates it.
     */
    expect(state.employeeBankPayments).toEqual([payment]);
  });

  it("deletes bank payment", () => {
    const state = reducer(
      {
        ...getInitialState(),
        employeeBankPayments: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
      deleteBankPayment.fulfilled(2, "request-id", {}),
    );

    expect(state.employeeBankPayments).toEqual([{ id: 1 }, { id: 3 }]);
  });

  it("stores fetched bank payments", () => {
    const payments = [{ id: 1 }, { id: 2 }];

    const state = reducer(
      getInitialState(),
      fetchAllBankPaymentsThunk.fulfilled(payments, "request-id", 10),
    );

    expect(state.employeeBankPayments).toEqual(payments);
  });
});

// =============================================================================
// EXTRA REDUCERS - DOCUMENTS
// =============================================================================

describe("extraReducers - documents", () => {
  it("handles uploadImageThunk.fulfilled", () => {
    const state = reducer(
      getInitialState(),
      uploadImageThunk.fulfilled("image-url", "request-id", {}),
    );

    // Source intentionally does not modify state here.
    expect(state).toEqual(getInitialState());
  });

  it("handles submitDocumentsThunk.fulfilled", () => {
    const documents = [
      {
        id: 1,
        type: "passport",
      },
    ];

    const state = reducer(
      getInitialState(),
      submitDocumentsThunk.fulfilled(documents, "request-id", {}),
    );

    expect(state.documentList).toEqual(documents);

    expect(state.documentUrls).toEqual({
      passport: [],
      workPermit: [],
      contract: [],
      insurance: [],
      certificate: [],
    });
  });

  it("handles getEmployeeDocumentsThunk.fulfilled", () => {
    const documents = [
      {
        id: 1,
        type: "passport",
      },
    ];

    const state = reducer(
      getInitialState(),
      getEmployeeDocumentsThunk.fulfilled(documents, "request-id", 10),
    );

    expect(state.employeeDocuments).toEqual(documents);
  });

  it("handles deleteDocumentThunk.fulfilled", () => {
    const state = reducer(
      {
        ...getInitialState(),
        employeeDocuments: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
      deleteDocumentThunk.fulfilled(2, "request-id", 2),
    );

    expect(state.employeeDocuments).toEqual([{ id: 1 }, { id: 3 }]);
  });
});

// =============================================================================
// EXTRA REDUCERS - ALL EMPLOYEES
// =============================================================================

describe("extraReducers - getAllEmployees", () => {
  it("handles fulfilled", () => {
    const payload = {
      results: [
        {
          id: 1,
          name: "John",
        },
        {
          id: 2,
          name: "Jane",
        },
      ],
      count: 2,
      total_pages: 1,
      current_page: 1,
      next: null,
      previous: null,
    };

    const state = reducer(
      getInitialState(),
      getAllEmployees.fulfilled(payload, "request-id", {}),
    );

    expect(state.employeeList).toEqual(payload.results);

    expect(state.pagination).toEqual({
      count: 2,
      total_pages: 1,
      current_page: 1,
      next: null,
      previous: null,
    });
  });
});

// =============================================================================
// EXTRA REDUCERS - EMPLOYEE BY ID
// =============================================================================

describe("extraReducers - getEmployeeById", () => {
  it("handles fulfilled", () => {
    const employee = {
      id: 100,
      name: "John Doe",
    };

    const state = reducer(
      getInitialState(),
      getEmployeeById.fulfilled(employee, "request-id", 100),
    );

    expect(state.employeeDetail).toEqual(employee);
  });
});

// =============================================================================
// ACTION CREATOR SANITY TESTS
// =============================================================================

describe("employee actions", () => {
  it("creates setEmployeeId action", () => {
    expect(setEmployeeId(10)).toEqual({
      type: "employee/setEmployeeId",
      payload: 10,
    });
  });

  it("creates setBankPaymentId action", () => {
    expect(setBankPaymentId(20)).toEqual({
      type: "employee/setBankPaymentId",
      payload: 20,
    });
  });

  it("creates setBasicFormData action", () => {
    const data = {
      name: "John",
    };

    expect(setBasicFormData(data)).toEqual({
      type: "employee/setBasicFormData",
      payload: data,
    });
  });

  it("creates setBankFormData action", () => {
    const data = {
      bank: "ABC",
    };

    expect(setBankFormData(data)).toEqual({
      type: "employee/setBankFormData",
      payload: data,
    });
  });

  it("creates addDocumentUrl action", () => {
    expect(
      addDocumentUrl({
        type: "passport",
        url: "test.pdf",
      }),
    ).toEqual({
      type: "employee/addDocumentUrl",
      payload: {
        type: "passport",
        url: "test.pdf",
      },
    });
  });

  it("creates removeDocumentUrl action", () => {
    expect(
      removeDocumentUrl({
        type: "passport",
        index: 0,
      }),
    ).toEqual({
      type: "employee/removeDocumentUrl",
      payload: {
        type: "passport",
        index: 0,
      },
    });
  });

  it("creates clearDocumentUrls action", () => {
    expect(clearDocumentUrls()).toEqual({
      type: "employee/clearDocumentUrls",
    });
  });

  it("creates clearBankPayment action", () => {
    expect(clearBankPayment()).toEqual({
      type: "employee/clearBankPayment",
    });
  });
});
