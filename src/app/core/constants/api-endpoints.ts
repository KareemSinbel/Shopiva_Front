export const API_ENDPOINTS = {

  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    verifyOtp: '/auth/verify-otp',
  },

  profile: {
    get: '/profile',
    update: '/profile',
    changePassword: '/profile/change-password',
    updateImage: '/profile/image',
    removeImage: '/profile/image',
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
  },

  admin: {
    users:
    {
      getAll:      '/admin/users',
      restrict:    (id: number) => `/admin/users/${id}/restrict`,
      update:      (id: number) => `/admin/users/${id}`,
      delete:      (id: number) => `/admin/users/${id}`,
    }
  }
};
