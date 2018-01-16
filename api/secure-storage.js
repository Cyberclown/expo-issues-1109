import Expo from 'expo';

export default class SecureStorage {

  static async getData(key, def) {
    try {
      const value = await Expo.SecureStore.getItemAsync(key);
      if (value !== null && value !== undefined) {
        return value;
      } else {
        if (!def) 
          def = null;
        return def;
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async setData(key, val) {
    try {
      return await Expo.SecureStore.setItemAsync(key, val);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  
  static async deleteData(key) {
    try {
      return await Expo.SecureStore.deleteItemAsync(key);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}