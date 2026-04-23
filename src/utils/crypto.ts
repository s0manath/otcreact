import CryptoJS from 'crypto-js';

const KEY = CryptoJS.enc.Utf8.parse('OTC_SECURE_PAY_K');
const IV = CryptoJS.enc.Utf8.parse('OTC_SECURE_PAY_I');

export const encryptPayload = (data: any): string => {
  const jsonStr = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(jsonStr, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
};
