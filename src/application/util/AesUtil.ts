import {GenUtil} from "./GenUtil";
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
        const keyData = Buffer.from(key, 'base64');
        const ivData = Buffer.from(iv, 'base64');

        const cipher = crypto.createCipheriv("aes-256-cbc", keyData, ivData);
        let encrypted = cipher.update(content, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }

    public static aesDecrypt(key: string, iv: string, content: string): string {
        const keyData = Buffer.from(key, 'base64');
        const ivData = Buffer.from(iv, 'base64');

        const decipher = crypto.createDecipheriv("aes-256-cbc", keyData, ivData);
        let decrypted = decipher.update(content, 'base64', 'utf-8');
        decrypted += decipher.final('utf-8')
        return decrypted;
    }

}