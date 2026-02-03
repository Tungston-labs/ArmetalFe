import API from "./api";

export const createFinanceService = async (data) => {
  const response = await API.post("/finance/", data);
  return response.data;
};


export const listFinanceService = async () => {
  const response = await API.get("/finance/");
  return response.data;
};
