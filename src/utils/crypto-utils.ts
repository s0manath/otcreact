import CryptoJS from 'crypto-js';

// The same Key and IV as in appsettings.json
const KEY = CryptoJS.enc.Utf8.parse('b14ca5898a4e4133bbce2ea2315a1916');
const IV = CryptoJS.enc.Utf8.parse('1234567890123456');

export const encrypt = (data: any): string => {
    const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonStr, KEY, {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
};

export const decrypt = (encryptedStr: string): any => {
    const decrypted = CryptoJS.AES.decrypt(encryptedStr, KEY, {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedStr) {
        throw new Error('Failed to decrypt data');
    }
    return JSON.parse(decryptedStr);
};
