/**
 * Hall Khoj Finder — Client REST API Connector
 * Provides authenticated Fetch calls with automatic JSON parsing and error handling.
 */

window.HKF_API = (function () {
  // Configurable API base URL: Checks window.HKF_API_URL, window.HKF_CONFIG, localStorage, or auto-detects
  const configuredUrl = (typeof window !== 'undefined') && (
    window.HKF_API_URL || 
    window.HKF_CONFIG?.apiBaseUrl || 
    localStorage.getItem('hkf_api_base')
  );

  const isStaticOrCrossPort = typeof window !== 'undefined' && (
    window.location.protocol === 'file:' || 
    (window.location.port && window.location.port !== '3000' && window.location.hostname === 'localhost') ||
    (window.location.port && window.location.port !== '3000' && window.location.hostname === '127.0.0.1')
  );

  const API_BASE = configuredUrl || (isStaticOrCrossPort ? 'http://localhost:3000/api' : '/api');

  function getToken() {
    return localStorage.getItem('hkf_token') || '';
  }

  function setSession(user, token) {
    if (token) localStorage.setItem('hkf_token', token);
    if (user) localStorage.setItem('hkf_session', JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem('hkf_token');
    localStorage.removeItem('hkf_session');
  }

  async function request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      const contentType = response.headers.get('content-type') || '';
      let data = {};
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      if (!response.ok) {
        const error = new Error(data.message || `Request failed with status ${response.status}`);
        error.code = data.code || 'API_ERROR';
        error.statusCode = response.status;
        throw error;
      }
      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        const networkErr = new Error('Server connection unavailable. Please check your internet or try again shortly.');
        networkErr.code = 'NETWORK_UNAVAILABLE';
        networkErr.statusCode = 0;
        console.warn(`[HKF_API Offline] ${endpoint}`);
        throw networkErr;
      }
      console.warn(`[HKF_API Error] ${endpoint}:`, err.message);
      throw err;
    }
  }


  return {
    baseUrl: API_BASE,
    health: () => request('/health'),
    request,

    // Auth Endpoints
    auth: {
      register: async (userData) => {
        const res = await request('/auth/register', {
          method: 'POST',
          body: JSON.stringify(userData)
        });
        if (res.data?.token) setSession(res.data.user, res.data.token);
        return res;
      },
      login: async (mobileOrEmail, password) => {
        const res = await request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ mobile: mobileOrEmail, password })
        });
        if (res.data?.token) setSession(res.data.user, res.data.token);
        return res;
      },
      getMe: () => request('/auth/me'),
      sendOtp: (mobile) => request('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ mobile })
      }),
      verifyOtp: async (mobile, otp) => {
        const res = await request('/auth/verify-otp', {
          method: 'POST',
          body: JSON.stringify({ mobile, otp })
        });
        if (res.data?.token) setSession(res.data.user, res.data.token);
        return res;
      },
      forgotPassword: (email) => request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      }),
      resetPassword: (token, newPassword) => request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword })
      }),
      logout: () => clearSession(),
      getToken,
      getCurrentUser: () => {
        try {
          return JSON.parse(localStorage.getItem('hkf_session') || 'null');
        } catch (e) {
          return null;
        }
      }
    },

    // Halls Endpoints
    halls: {
      list: () => request('/halls'),
      getById: (id) => request(`/halls/${id}`),
      create: (hallData) => request('/halls', {
        method: 'POST',
        body: JSON.stringify(hallData)
      }),
      update: (id, hallData) => request(`/halls/${id}`, {
        method: 'PUT',
        body: JSON.stringify(hallData)
      }),
      updateStatus: (id, status, reason = '') => request(`/halls/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, reason })
      }),
      delete: (id) => request(`/halls/${id}`, {
        method: 'DELETE'
      })
    },

    // Bookings Endpoints
    bookings: {
      create: (bookingData) => request('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      }),
      checkAvailability: (serviceId, date) => request(`/bookings/check-availability?serviceId=${encodeURIComponent(serviceId)}&date=${encodeURIComponent(date)}`),
      getById: (id) => request(`/bookings/${id}`),
      getUserBookings: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') searchParams.set(k, v);
        });
        const query = searchParams.toString();
        return request(`/bookings/user${query ? '?' + query : ''}`);
      },
      getOwnerBookings: () => request('/bookings/owner'),
      updateStatus: (id, status, note = '') => request(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note })
      }),
      cancel: (id, reason = '') => request(`/bookings/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      }),
      getInvoiceUrl: (id) => `${API_BASE}/bookings/${id}/invoice`
    },


    // Owners Endpoints
    owners: {
      getStats: () => request('/owners/stats'),
      getProfile: () => request('/owners/profile'),
      updateProfile: (profileData) => request('/owners/profile', {
        method: 'PATCH',
        body: JSON.stringify(profileData)
      }),
      getListings: () => request('/owners/listings'),
      getAnalytics: () => request('/owners/analytics'),
      blockDate: (venueId, date) => request('/owners/block-date', {
        method: 'POST',
        body: JSON.stringify({ venueId, date })
      }),
      unblockDate: (venueId, date) => request('/owners/unblock-date', {
        method: 'POST',
        body: JSON.stringify({ venueId, date })
      }),
      sendEmailVerification: (email) => request('/owners/verify-email/send', {
        method: 'POST',
        body: JSON.stringify({ email })
      }),
      confirmEmailVerification: (email, otp) => request('/owners/verify-email/confirm', {
        method: 'POST',
        body: JSON.stringify({ email, otp })
      })
    },

    // Admin Endpoints
    admin: {
      getMetrics: () => request('/admin/metrics'),
      getVerifications: () => request('/admin/verifications'),
      verifyOwner: (ownerId, status, rejectionReason = '', notes = '') => request('/admin/verify-owner', {
        method: 'POST',
        body: JSON.stringify({ ownerId, status, rejectionReason, notes })
      }),
      getUsers: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') searchParams.set(k, v);
        });
        const query = searchParams.toString();
        return request(`/admin/users${query ? '?' + query : ''}`);
      },
      updateUserStatus: (userId, status, reason = '') => request(`/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, reason })
      }),
      getListings: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') searchParams.set(k, v);
        });
        const query = searchParams.toString();
        return request(`/admin/listings${query ? '?' + query : ''}`);
      },
      updateListingStatus: (listingId, status, moderationNote = '') => request(`/admin/listings/${listingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, moderationNote })
      }),
      getAuditLogs: () => request('/admin/audit-logs')
    },

    // AI Endpoints
    ai: {
      parseQuery: (prompt) => request('/ai/parse', {
        method: 'POST',
        body: JSON.stringify({ prompt })
      }),
      search: (prompt) => request('/ai/search', {
        method: 'POST',
        body: JSON.stringify({ prompt })
      }),
      getRecommendations: (params = {}) => {
        const qry = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') qry.append(k, v);
        });
        const queryStr = qry.toString();
        return request(`/ai/recommendations${queryStr ? '?' + queryStr : ''}`);
      },
      ownerAssistant: (intent, context = {}) => request('/ai/owner/assistant', {
        method: 'POST',
        body: JSON.stringify({ intent, context })
      }),
      executeOwnerAction: (actionPayload, confirmed = true) => request('/ai/owner/execute-action', {
        method: 'POST',
        body: JSON.stringify({ actionPayload, confirmed })
      })
    },

    // Upload Endpoints
    upload: {
      image: async (file, folder = 'listings') => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', folder);

        const token = getToken();
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE}/upload/image`, {
          method: 'POST',
          headers,
          body: formData
        });

        const data = await response.json();
        if (!response.ok) {
          const error = new Error(data.message || 'Image upload failed');
          error.code = data.code || 'UPLOAD_ERROR';
          error.statusCode = response.status;
          throw error;
        }
        return data;
      }
    },

    // Staff Management Endpoints
    staff: {
      list: () => request('/staff'),
      add: (staffData) => request('/staff', {
        method: 'POST',
        body: JSON.stringify(staffData)
      }),
      update: (id, staffData) => request(`/staff/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(staffData)
      }),
      remove: (id) => request(`/staff/${id}`, {
        method: 'DELETE'
      })
    },

    // Users & Customer Profile Endpoints
    users: {
      getProfile: () => request('/users/profile'),
      updateProfile: (profileData) => request('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(profileData)
      }),
      getFavorites: () => request('/users/favorites'),
      toggleFavorite: (venueId) => request('/users/favorites/toggle', {
        method: 'POST',
        body: JSON.stringify({ venueId })
      }),
      getLocations: () => request('/users/locations'),
      addLocation: (locationData) => request('/users/locations', {
        method: 'POST',
        body: JSON.stringify(locationData)
      })
    },

    // Search & Geolocation Endpoints
    search: {
      query: (params = {}) => {
        const qry = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            qry.append(k, v);
          }
        });
        return request(`/search?${qry.toString()}`);
      },
      suggestions: (q = '') => request(`/search/suggestions?q=${encodeURIComponent(q)}`),
      cities: () => request('/search/cities')
    },

    // Category Endpoints
    categories: {
      list: () => request('/categories'),
      getBySlug: (slug) => request(`/categories/${slug}`)
    },

    // Notifications Endpoints
    notifications: {
      list: (params = {}) => {
        const qry = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') qry.append(k, v);
        });
        const queryStr = qry.toString();
        return request(`/notifications${queryStr ? '?' + queryStr : ''}`);
      },
      markAsRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
      markAllAsRead: () => request('/notifications/read-all', { method: 'PATCH' }),
      delete: (id) => request(`/notifications/${id}`, { method: 'DELETE' })
    },

    // Customer-Owner Chat & Messaging Endpoints
    messages: {
      send: (messageData) => request('/messages', {
        method: 'POST',
        body: JSON.stringify(messageData)
      }),
      getConversations: () => request('/messages/conversations'),
      getMessages: (conversationId) => request(`/messages/${conversationId}`),
      markAsRead: (conversationId) => request(`/messages/${conversationId}/read`, { method: 'PATCH' })
    },

    // Verified Reviews Endpoints
    reviews: {
      create: (reviewData) => request('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData)
      }),
      getListingReviews: (serviceId) => request(`/reviews/listing/${serviceId}`),
      getUserReviews: () => request('/reviews/user'),
      reply: (id, text) => request(`/reviews/${id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ text })
      }),
      moderate: (id, status) => request(`/reviews/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
      delete: (id) => request(`/reviews/${id}`, { method: 'DELETE' })
    },

    // Payment Endpoints (Phase 15)
    payments: {
      createOrder: (bookingId) => request('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ bookingId })
      }),
      verify: (paymentData) => request('/payments/verify', {
        method: 'POST',
        body: JSON.stringify(paymentData)
      }),
      refund: (bookingId, reason) => request('/payments/refund', {
        method: 'POST',
        body: JSON.stringify({ bookingId, reason })
      }),
      getHistory: () => request('/payments/history'),
      getByBooking: (bookingId) => request(`/payments/${bookingId}`)
    },

    // AI Endpoints (Phases 12 & 13)
    ai: {
      search: (prompt, filters = {}) => request('/ai/search', {
        method: 'POST',
        body: JSON.stringify({ prompt, filters })
      }),
      parse: (prompt) => request('/ai/parse', {
        method: 'POST',
        body: JSON.stringify({ prompt })
      }),
      getRecommendations: (filters = {}) => request('/ai/recommendations', {
        method: 'POST',
        body: JSON.stringify(filters)
      }),
      ownerAssistant: (taskType, context = {}) => request('/ai/owner/assistant', {
        method: 'POST',
        body: JSON.stringify({ taskType, context })
      }),
      executeAction: (actionPayload) => request('/ai/owner/execute-action', {
        method: 'POST',
        body: JSON.stringify({ actionPayload })
      })
    }
  };
})();

