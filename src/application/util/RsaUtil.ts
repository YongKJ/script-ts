import EncryptRsa from 'encrypt-rsa';
import {returnCreateKeys} from "encrypt-rsa/build/utils/types";

export class RsaUtil {

    private static rsa = new EncryptRsa();

    private constructor() {
    }

    public static generateKey(): returnCreateKeys {
        return this.rsa.createPrivateAndPublicKeys(2048);
    }

    public static rsaEncrypt(key: string, content: string, keyType: "publicKey" | "privateKey"): string {
        if (keyType === "publicKey") {
            return this.rsa.encryptStringWithRsaPublicKey({
                text: content,
                privateKey: this.getPublicKey(key)
            });
        } else {
            return this.rsa.encrypt({
                text: content,
                privateKey: this.getPrivateKey(key)
            });
        }
    }

    public static rsaDecrypt(key: string, content: string, keyType: "publicKey" | "privateKey"): string {
        if (keyType === "publicKey") {
            return this.rsa.decrypt({
                text: content,
                publicKey: this.getPublicKey(key),
            });
        } else {
            return this.rsa.decryptStringWithRsaPrivateKey({
                text: content,
                publicKey: this.getPrivateKey(key),
            });
        }
    }

    private static getPrivateKey(key: string): string {
        if (key.includes("BEGIN")) {
            return key;
        }
        return "-----BEGIN PRIVATE KEY-----\n" + key + "\n-----END PRIVATE KEY-----";
    }

    private static getPublicKey(key: string): string {
        if (key.includes("BEGIN")) {
            return key;
        }
        return "-----BEGIN PUBLIC KEY-----\n" + key + "\n-----END PUBLIC KEY-----";
    }

}