import axiosClient from "./axiosClient";

export const postApi = async (url, data, config = {}) => {
  const res = await axiosClient.post(`${url}`, data, {
    headers: { "Content-Type": "multipart/form-data", ...config.headers },
    ...config,
  });
  return res.data;
};

export const putApi = async (url, data, config = {}) => {
  const res = await axiosClient.post(`${url}`, data, {
    headers: { "Content-Type": "multipart/form-data", ...config.headers },
    ...config,
  });
  return res.data;
};

// ✅ GET Request
export const getApi = async (url, config = {}) => {
  const res = await axiosClient.get(`${url}`, {
    headers: { Accept: "application/json", ...config.headers },
    ...config,
  });
  return res.data;
};

// ✅ DELETE Request
export const deleteApi = async (url, config = {}) => {
  const res = await axiosClient.delete(`${url}`, {
    headers: { Accept: "application/json", ...config.headers },
    ...config,
  });
  return res.data;
};

// Profile Post Api
export const profilePostApi = async (url, data, config = {}) => {
  const res = await axiosClient.post(`${url}`, data, {
    headers: { "Content-Type": "multipart/form-data", ...config.headers },
    ...config,
  });
  return res;
};

// Profile Put Api
export const profilePutApi = async (url, data, config = {}) => {
  const res = await axiosClient.post(`${url}`, data, {
    headers: { "Content-Type": "multipart/form-data", ...config.headers },
    ...config,
  });
  return res;
};

// ✅ Profile DELETE Request
export const profileDeleteApi = async (url, config = {}) => {
  const res = await axiosClient.delete(`${url}`, {
    headers: { Accept: "application/json", ...config.headers },
    ...config,
  });
  return res;
};