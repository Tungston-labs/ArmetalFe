import axios from "axios";
const API = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});



export const fetchApproveBuyerList = async (buyer) => {
  const response = API.get(`/admin/auth/unapproved-users=${buyer}`);
  return response;
};

export const fetchAgents = async ({page}) => {
  const response = await API.get(`/admin/agent/get-agents?page=${page}`);
  return response;
};
export const fetchUnapprovedUsers = async ({page}) => {
  const response = await API.get(`admin/auth/unapproved-users?page=${page}`);
  return response;
};

export const fetchItems = async ({page}) => {
    console.log("hello")
    const response = API.get(`product/get-products?page=${page}`)
    return response
}


export const fetchSubItems = async (page = 1, search = "") => {
  const response = await API.get(`/items/get-subcategories?page=${page}&search=${search}`);
  return {
    data: response.data.items, // adjust based on actual response
    totalPages: response.data.totalPages,
  };
};
console.log("Selected code is empty");

export const fetchProducts = async ({page}) => {
    console.log("hello")
    const response = API.get(`/product/get-products/${role}&page=${page}`)
    return response
}

export const deleteUserById = async ({ role, id }) => {
  const res = API.delete(`/admin/auth/delete-user/${role}/${id}`);
  return res.data;
};

// edit buyer


export const editUserAPI = async (role, id, editData) => {
  const response = await API.put(
    `/admin/auth/edit-user/${role}/${id}`,
    editData,
  
  );
  return response.data;
};


// edit seller

export const editSellerAPI = async (id, editData, files = {}) => {
  const formData = new FormData();

  // Append fields from editData
  for (const key in editData) {
    if (editData.hasOwnProperty(key)) {
      formData.append(key, editData[key]);
    }
  }

  // Append files if provided (expecting arrays or FileList)
  if (files.profileImage && files.profileImage.length > 0) {
    formData.append("profileImage", files.profileImage[0]);
  }
  if (files.tradeLicenseCopy && files.tradeLicenseCopy.length > 0) {
    formData.append("tradeLicenseCopy", files.tradeLicenseCopy[0]);
  }

  // Override headers to multipart/form-data for this request only
  const response = await API.put(`/edit/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // re-include auth header explicitly
    },
  });

  return response.data;
};



export const addAgentAPI=async(agentData)=>{
    const response=API.post(`/admin/agent/add-agent`,agentData)
    return response.data;
}

export const editAgentAPI = async (id, editData) => {
  const response = await API.put(`/admin/agent/update-agent/${id}`, editData);
  return response.data;
};

export const fetchUsersAPI = async ({ role, search = "", page = 1, status = "" }) => {
  const response = await API.get(
        `/admin/auth/get-all-users?role=${role}&search=${search}&page=${page}&status=${status}`
      );
  return response.data;
};

export const fetchPendingUsersAPI=async({role, search = "", page = 1, status = ""}) => {
const response= await API.get(`/admin/auth/unapproved-users?role=${role}&search=${search}&page=${page}&status=${status}`
  ); 
  return response.data;
  
}

export const approveUsersAPI = async ({ userId, role, status }) => {
  const response = await API.post('admin/auth/verify-user', {
    userId,
    role,
    status
  });
  return response.data;
};
