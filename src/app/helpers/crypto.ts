import * as CryptoJS from 'crypto-js';

export function encrypt(str: string, password: string): string {
  return CryptoJS.AES.encrypt(str, password).toString();
}

export function decrypt(str: string, password: string): string | null {
  return CryptoJS.AES.decrypt(str, password).toString(CryptoJS.enc.Utf8);
}
