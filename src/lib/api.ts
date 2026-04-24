import axios from "axios";

/* =========================
   AXIOS INSTANCE
========================= */

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
});

/* =========================
   ATTACH TOKEN
========================= */

axiosInstance.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "access_token"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  }
);

/* =========================
   GLOBAL ERROR HANDLER
========================= */

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      console.warn(
        "Unauthorized — redirecting"
      );

      localStorage.removeItem(
        "access_token"
      );

      window.location.href =
        "/auth";

    }

    return Promise.reject(error);

  }
);

/* =========================
   PRODUCTS API
========================= */

export const api = {

  /* ======================
     PRODUCTS
  ====================== */

  getProducts: async () => {

    const res =
      await axiosInstance.get(
        "/products"
      );

    return res.data;

  },

  createProduct: async (
    data: any
  ) => {

    const res =
      await axiosInstance.post(
        "/products",
        data
      );

    return res.data;

  },

  updateProduct: async (
    id: number,
    data: any
  ) => {

    const res =
      await axiosInstance.put(
        `/products/${id}`,
        data
      );

    return res.data;

  },

  deleteProduct: async (
    id: number
  ) => {

    const res =
      await axiosInstance.delete(
        `/products/${id}`
      );

    return res.data;

  },

  /* ======================
     ORDERS
  ====================== */

  getOrders: async () => {

    const res =
      await axiosInstance.get(
        "/orders"
      );

    return res.data;

  },

  updateOrderStatus: async (
    id: number,
    status: string
  ) => {

    const res =
      await axiosInstance.put(
        `/orders/${id}`,
        { status }
      );

    return res.data;

  },

  /* ======================
     CUSTOMERS
  ====================== */

  getCustomers: async () => {

    const res =
      await axiosInstance.get(
        "/customers"
      );

    return res.data;

  },

  /* ======================
     DAILY SALES (DMT)
  ====================== */

  getDailySales: async () => {

    const res =
      await axiosInstance.get(
        "/daily-sales"
      );

    return res.data;

  },

  createDailySale: async (
    data: any
  ) => {

    const res =
      await axiosInstance.post(
        "/daily-sales",
        data
      );

    return res.data;

  },

  deleteDailySale: async (
    id: number
  ) => {

    const res =
      await axiosInstance.delete(
        `/daily-sales/${id}`
      );

    return res.data;

  }

};