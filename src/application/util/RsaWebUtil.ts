import {returnCreateKeys} from "encrypt-rsa/build/utils/types";
import {LogUtil} from "./LogUtil";
import {Log} from "../pojo/dto/Log";
import crypto from "crypto";
import {GenUtil} from "./GenUtil";

export class RsaWebUtil {

    /**
     * 公钥加密（客户端）
     * 私钥解密（服务端）
     *
     * @private
     */
    private static readonly ALGORITHM_OAEP: string = "RSA-OAEP";

    /**
     * 私钥签名（加密）
     * 公钥认证（解密）
     *
     * @private
     */
    private static readonly ALGORITHM_PSS: string = "RSA-PSS";

    /**
     * 默认取公钥加密，私钥解密
     *
     * @private
     */
    private static ALGORITHM_NAME = this.ALGORITHM_OAEP;

    private constructor() {
    }

    public static async generateKey(type: "OAEP" | "PSS"): Promise<returnCreateKeys> {
        this.ALGORITHM_NAME = type === "OAEP" ? this.ALGORITHM_OAEP : this.ALGORITHM_PSS;
        let keyPair = await (GenUtil.isBrowser() ? window.crypto : crypto).subtle.generateKey(
            {
                name: this.ALGORITHM_NAME,
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: "SHA-256"
            },
            true,
            type === "OAEP" ? ["encrypt", "decrypt"] : ["sign", "verify"]
        );

        // @ts-ignore
        const publicKey = await (GenUtil.isBrowser() ? window.crypto : crypto).subtle.exportKey("spki", keyPair.publicKey);
        // @ts-ignore
        const privateKey = await (GenUtil.isBrowser() ? window.crypto : crypto).subtle.exportKey("pkcs8", keyPair.privateKey);

        return {
            publicKey: this.arrayBufferToPem(publicKey, "PUBLIC KEY"),
            privateKey: this.arrayBufferToPem(privateKey, "PRIVATE KEY"),
        }

    }

    private static arrayBufferToPem(buffer: ArrayBuffer, type: string): string {
        let binary = '';
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        let base64 = Buffer.from(binary).toString("base64");
        return '-----BEGIN ' + type + '-----\n' +
            base64 + '\n' +
            '-----END ' + type + '-----';
    }

    public static async rsaEncrypt(key: string, content: string, keyType: "public" | "private", algType: "OAEP" | "PSS"): Promise<string> {
        this.ALGORITHM_NAME = algType === "OAEP" ? this.ALGORITHM_OAEP : this.ALGORITHM_PSS;
        try {
            const cryptoKey = keyType === "public" ?
                await this.importPublicKey(this.getPublicKey(key), this.ALGORITHM_NAME === "RSA-OAEP" ? "encrypt" : "sign") :
                await this.importPrivateKey(this.getPrivateKey(key), this.ALGORITHM_NAME === "RSA-OAEP" ? "encrypt" : "sign");
            const encrypted = await this.encryptRSA(cryptoKey, new TextEncoder().encode(content), algType);
            const encryptedBase64 = Buffer.from(this.ab2str(encrypted)).toString("base64");
            return encryptedBase64.replace(/(.{64})/g, "$1\n");
        } catch (error) {
            LogUtil.loggerLine(Log.of("RsaWebUtil", "rsaEncrypt", "error", error));
        }
        return "";
    }

    private static async encryptRSA(key: CryptoKey, plaintext: Uint8Array, algType: "OAEP" | "PSS"): Promise<ArrayBuffer> {
        if (algType === "OAEP") {
            return await (GenUtil.isBrowser() ? window.crypto : crypto).subtle.encrypt(
                {
                    name: this.ALGORITHM_NAME,
                },
                key,
                plaintext
            );
        } else {
            return await (GenUtil.isBrowser() ? window.crypto : crypto).subtle.sign(
                {
                    name: this.ALGORITHM_NAME,
                },
                key,
                plaintext
            );
        }
    }

    public static async rsaDecrypt(key: string, content: string, keyType: "public" | "private", algType: "OAEP" | "PSS", text?: string): Promise<string | boolean> {
        this.ALGORITHM_NAME = algType === "OAEP" ? this.ALGORITHM_OAEP : this.ALGORITHM_PSS;
        try {
            const cryptoKey = keyType === "public" ?
                await this.importPublicKey(this.getPublicKey(key), this.ALGORITHM_NAME === "RSA-OAEP" ? "decrypt" : "verify") :
                await this.importPrivateKey(this.getPrivateKey(key), this.ALGORITHM_NAME === "RSA-OAEP" ? "decrypt" : "verify");
            return await this.decryptRSA(cryptoKey, this.str2ab(Buffer.from(content, "base64").toString()), algType, text);
        } catch (error) {
            LogUtil.loggerLine(Log.of("RsaWebUtil", "rsaEncrypt", "error", error));
        }
        return "";
    }

    private static async decryptRSA(key: CryptoKey, ciphertext: ArrayBuffer, algType: "OAEP" | "PSS", content?: string): Promise<string | boolean> {
        if (algType === "OAEP") {
            let decrypted = await (GenUtil.isBrowser() ? window.crypto : crypto).subtle.decrypt(
                {
                    name: this.ALGORITHM_NAME,
                },
                key,
                ciphertext
            );
            return new TextDecoder().decode(decrypted);
        } else {
            let decrypted = await (GenUtil.isBrowser() ? window.crypto : crypto).subtle.verify(
                {
                    name: this.ALGORITHM_NAME,
                },
                key,
                ciphertext,
                new TextEncoder().encode(content)
            );
            return decrypted;
        }
    }

    private static async importPrivateKey(pkcs8Pem: string, keyUsage: "decrypt" | "encrypt" | "sign" | "verify"): Promise<CryptoKey> {
        return await (GenUtil.isBrowser() ? window.crypto : crypto).subtle.importKey(
            "pkcs8",
            this.getPkcs8Der(pkcs8Pem),
            {
                name: this.ALGORITHM_NAME,
                hash: "SHA-256",
            },
            true,
            [keyUsage]
        );
    }

    private static getPkcs8Der(pkcs8Pem: string): ArrayBuffer {
        const pemHeader = "-----BEGIN PRIVATE KEY-----";
        const pemFooter = "-----END PRIVATE KEY-----";
        let pemContents = pkcs8Pem.trim().substring(pemHeader.length, pkcs8Pem.length - pemFooter.length - 1).trim();
        let binaryDerString = Buffer.from(pemContents, "base64").toString();
        return this.str2ab(binaryDerString);
    }

    private static async importPublicKey(spkiPem: string, keyUsage: "decrypt" | "encrypt" | "sign" | "verify"): Promise<CryptoKey> {
        return await (GenUtil.isBrowser() ? window.crypto : crypto).subtle.importKey(
            "spki",
            this.getSpkiDer(spkiPem),
            {
                name: this.ALGORITHM_NAME,
                hash: "SHA-256",
            },
            true,
            [keyUsage]
        );
    }

    private static getSpkiDer(spkiPem: string): ArrayBuffer {
        const pemHeader = "-----BEGIN PUBLIC KEY-----";
        const pemFooter = "-----END PUBLIC KEY-----";
        let pemContents = spkiPem.trim().substring(pemHeader.length, spkiPem.length - pemFooter.length - 1).trim();
        let binaryDerString = Buffer.from(pemContents, "base64").toString();
        return this.str2ab(binaryDerString);
    }

    private static str2ab(str: string) {
        const buf = new ArrayBuffer(str.length);
        const bufView = new Uint8Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    private static ab2str(buf: ArrayBuffer): string {
        // @ts-ignore
        return String.fromCharCode.apply(null, new Uint8Array(buf));
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