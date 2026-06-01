export const API_ENDPOINTS = {

  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    verifyOtp: '/auth/verify-otp',
  },

  products: {
    getAll: '/products',
    getById: (id: number) => `/products/${id}`,
    create: '/products',
    update: (id: number) => `/products/${id}`,
    delete: (id: number) => `/products/${id}`,
  },

  cart: {
    get: '/cart',
    addToCart: '/cart/items',
    create: '/cart/items',
    removeItem: (id: number) => `/cart/items/${id}`,
    updateItemQuantity: `/cart/items`,
  },

  payment:{
    createIntent: '/payments/create-intent',
  }
};
