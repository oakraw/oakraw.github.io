const STORAGE_KEY = process.env.STORAGE_KEY;

const localStoragePlugin = (store) => {
  store.subscribe((mutation, state) => {
    const syncedData = {
      auth: state.auth,
      user: state.user,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(syncedData));

    if (mutation.type === 'CLEAR_ALL_DATA') {
      localStorage.removeItem(STORAGE_KEY);
    }
  });
};

export default [localStoragePlugin];
