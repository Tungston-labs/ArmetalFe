import API from "./api";

export const createFinanceService = async (data) => {
  const response = await API.post("/finance/", data);
  return response.data;
};

export const listFinanceService = async (page = 1, pageSize = 20) => {
  const response = await API.get(
    `/finance/?page=${page}&page_size=${pageSize}`
  );
  return response.data;
};

export const deleteFinanceService = async (id) => {
  const response = await API.delete(`/finance/${id}/`);
  return response.data;
};
