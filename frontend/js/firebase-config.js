/**
 * Hall Khoj Finder — Client Firebase Integration & Fallback Bridge
 * Supports direct Firebase Web SDK (Auth, Firestore, Storage) when configured,
 * and seamlessly falls back to the Express REST API (HKF_API) during development.
 */

window.HKF_Firebase = (function () {
  // Client configuration: can be populated dynamically or via environment injection
  const firebaseConfig = window.__FIREBASE_CONFIG__ || {
    apiKey: "",
    authDomain: "hall-khoj-finder.firebaseapp.com",
    projectId: "hall-khoj-finder",
    storageBucket: "hall-khoj-finder.appspot.com",
    messagingSenderId: "",
    appId: ""
  };

  let app = null;
  let auth = null;
  let db = null;
  let storage = null;
  let isLive = false;

  // Initialize Firebase if the SDK is loaded on page and apiKey is present
  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_firebase_api_key_here') {
    try {
      if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
      } else {
        app = firebase.app();
      }
      auth = firebase.auth();
      db = firebase.firestore();
      storage = firebase.storage();
      isLive = true;
      console.log('✓ [HKF_Firebase] Client Firebase SDK initialized with project:', firebaseConfig.projectId);
    } catch (err) {
      console.warn('⚠️ [HKF_Firebase] Client Firebase SDK initialization skipped:', err.message);
    }
  } else {
    console.log('ℹ️ [HKF_Firebase] Running in Unified REST API Mode via HKF_API.');
  }

  return {
    isLive: () => isLive,
    getConfig: () => ({ ...firebaseConfig }),
    
    // Auth Helpers
    auth: {
      getCurrentUser: () => {
        if (isLive && auth) {
          return auth.currentUser;
        }
        return window.HKF_API ? window.HKF_API.auth.getCurrentUser() : null;
      },
      getIdToken: async () => {
        if (isLive && auth?.currentUser) {
          return await auth.currentUser.getIdToken();
        }
        return window.HKF_API ? window.HKF_API.auth.getToken() : '';
      },
      signOut: async () => {
        if (isLive && auth) {
          await auth.signOut();
        }
        if (window.HKF_API) {
          window.HKF_API.auth.logout();
        }
      }
    },

    // Storage Upload Bridge
    storage: {
      uploadFile: async (file, folder = 'listings') => {
        // If live Firebase client storage is initialized
        if (isLive && storage) {
          const ext = file.name.split('.').pop();
          const cleanName = `${folder}/${Date.now()}_${Math.random().toString(36).substr(2, 6)}.${ext}`;
          const storageRef = storage.ref().child(cleanName);
          const snapshot = await storageRef.put(file);
          const downloadUrl = await snapshot.ref.getDownloadURL();
          return {
            url: downloadUrl,
            fileName: cleanName,
            storageProvider: 'firebase-storage'
          };
        }

        // Default & Development: Upload via server-side storage service
        if (window.HKF_API?.upload) {
          const res = await window.HKF_API.upload.image(file, folder);
          return res.data;
        }

        throw new Error('No storage provider available for upload');
      }
    }
  };
})();
