
export const getItemFromLocalStorage = (key) => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return null;
    } catch (error) {
      console.error('Error getting item from local storage:', error);
      return null;
    }
  };
  export const setItemInLocalStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item in local storage:', error);
    }
  };