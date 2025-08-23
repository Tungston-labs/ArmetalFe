import API from './api';

// Fetch reimbursements grouped by date
export const getGroupedReimbursements = async () => {
  const response = await API.get("/reimbursements/grouped/");
  return response.data;
};
