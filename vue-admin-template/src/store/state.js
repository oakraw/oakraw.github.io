const STORAGE_KEY = process.env.STORAGE_KEY;
let syncedData = {
  auth: {
    isLoggedIn: false,
    accessToken: null,
    refreshToken: null,
  },
  user: {
    name: null,
  },
};

if (localStorage.getItem(STORAGE_KEY)) {
  syncedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
}

const state = syncedData;
export default state;
