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
   API
========================= */

export const api = {

  /* ======================
     PRODUCTS
  ====================== */

  getProducts: async () => {

    const res =
      await axiosInstance.get(
        "/products/"
      );

    return res.data.map((p: any) => ({

      ...p,

      // ✅ snake_case -> camelCase
      stockQuantity:
        p.stock_quantity,

      images:
        p.image_urls || [],

      image:
        p.image_urls?.[0] || "",

      inStock:
        p.in_stock,

    }));

  },

  createProduct: async (
    data: any
  ) => {

    const payload = {

      ...data,

      // ✅ camelCase -> snake_case
      stock_quantity:
        data.stockQuantity,

      image_urls:
        data.images || [],

    };

    const res =
      await axiosInstance.post(
        "/products/",
        payload
      );

    return res.data;

  },

  updateProduct: async (
    id: string,
    data: any
  ) => {

    const payload = {

      ...data,

      // ✅ camelCase -> snake_case
      stock_quantity:
        data.stockQuantity,

      image_urls:
        data.images || [],

    };

    const res =
      await axiosInstance.put(
        `/products/${id}`,
        payload
      );

    return res.data;

  },

  deleteProduct: async (
    id: string
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
    id: string,
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
     DAILY SALES
  ====================== */

  getDailySales: async () => {

    const res =
      await axiosInstance.get(
        "/sales"
      );

    return res.data;

  },

  createDailySale: async (
    data: any
  ) => {

    const res =
      await axiosInstance.post(
        "/sales",
        data
      );

    return res.data;

  },

  deleteDailySale: async (
    id: string
  ) => {

    const res =
      await axiosInstance.delete(
        `/sales/${id}`
      );

    return res.data;

  }

};