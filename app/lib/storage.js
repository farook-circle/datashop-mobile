import EncryptedStorage from 'react-native-encrypted-storage';

const save = async (key, data) => {
  try {
    await EncryptedStorage.setItem(key, data);
    // Congrats! You've just stored your first value!
  } catch (error) {
    // There was an error on the native side
  }
};

const get = async key => {
  try {
    const session = await EncryptedStorage.getItem(key);

    if (session !== undefined) {
      return session;
    }
  } catch (error) {
    return null;
  }

  return null;
};

const remove = async key => {
  try {
    await EncryptedStorage.removeItem(key);
    // Congrats! You've just removed your first value!
  } catch (error) {
    // There was an error on the native side
  }
};

const clearStorage = async () => {
  try {
    await EncryptedStorage.clear();
    // Congrats! You've just cleared the device storage!
  } catch (error) {
    // There was an error on the native side
  }
};

export const Storage = {save, get, remove, clearStorage};
