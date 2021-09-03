import * as CryptoJS from 'crypto-js';

const KEYSEPARATOR = '.';

export function encrypt(str: string, password: string): string {
  const hmac = CryptoJS.HmacMD5(str, password).toString();
  return CryptoJS.AES.encrypt(`${hmac}${KEYSEPARATOR}${str}`, password).toString();
}

export function decrypt(str: string, password: string): string | null {
  const data = CryptoJS.AES.decrypt(str, password).toString(CryptoJS.enc.Utf8);
  const hmac = data.slice(0, data.indexOf(KEYSEPARATOR));
  const content = data.slice(hmac.length + 1); // remove the KEYSEPARATOR
  if (hmac !== CryptoJS.HmacMD5(content, password).toString()) {
    return null;
  }
  return content;
}
