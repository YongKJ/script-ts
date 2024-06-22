import {GenUtil} from "./GenUtil";
import CryptoJS from "crypto-js";
import crypto from "crypto";

export class AesUtil {

    private constructor() {
    }

    public static generateIV(): string {
        return Buffer.from(GenUtil.getRandomCode(16)).toString("base64")
    }

    public static generateKey(): string {
        return Buffer.from(GenUtil.getRandomCode(32)).toString("base64")
    }

    public static aesEncrypt(key: string, iv: string, content: string): string {
        if (GenUtil.isBrowser()) {
            return this.aesEncryptByBrowser(key, iv, content);
        }

        const keyData = Buffer.from(key, 'base64');
        const ivData = Buffer.from(iv, 'base64');

        const cipher = crypto.createCipheriv("aes-256-cbc", keyData, ivData);
        let encrypted = cipher.update(content, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }

    public static aesEncryptByBrowser(key: string, iv: string, content: string): string {
        let encryptParams = CryptoJS.AES.encrypt(
            content,
            CryptoJS.enc.Base64.parse(key),
            {
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                iv: CryptoJS.enc.Base64.parse(iv)
            }
        );
        return encryptParams.ciphertext.toString(CryptoJS.enc.Base64);
    }

    public static aesDecrypt(key: string, iv: string, content: string): string {
        if (GenUtil.isBrowser()) {
            return this.aesDecryptByBrowser(key, iv, content);
        }

        const keyData = Buffer.from(key, 'base64');
        const ivData = Buffer.from(iv, 'base64');

        const decipher = crypto.createDecipheriv("aes-256-cbc", keyData, ivData);
        let decrypted = decipher.update(content, 'base64', 'utf-8');
        decrypted += decipher.final('utf-8')
        return decrypted;
    }

    public static aesDecryptByBrowser(key: string, iv: string, content: string): string {
        let decryptParams = CryptoJS.AES.decrypt(
            content,
            CryptoJS.enc.Base64.parse(key),
            {
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                iv: CryptoJS.enc.Base64.parse(iv)
            }
        );
        return decryptParams.toString(CryptoJS.enc.Utf8);
    }
}