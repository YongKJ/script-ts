import rsa from 'js-crypto-rsa';
import {LogUtil} from "../../util/LogUtil";
import {Log} from "../../pojo/dto/Log";
import NodeRSA from "node-rsa";
import CryptoJS from "crypto-js";

export class EncodeAndDecode {

    private constructor() {
    }

    private apply(): void {
        // this.decode().then();
        // this.decode1();
        // this.decode2();
        this.decode3();
    }

    private decode2(): void {
        let iv = "wmgcCFxfuL2MaegK";
        let content = "Hello world!";
        let base64Key = "ODJrHhcGN1DGglwIZ4f7YE5I7sg5JxUspHFRFi3S+lk=";
        let key = Buffer.from(base64Key, "base64").toString("utf8");
        LogUtil.loggerLine(Log.of("EncodeAndDecode", "decode2", "key", key));
        // let key = "GuWpAYNaAn7aDOutTGyQrlU7N3zCWiSDDnoWCuldtZs=";

        let encryptParams = CryptoJS.AES.encrypt(content, CryptoJS.enc.Utf8.parse(key), {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            iv: CryptoJS.enc.Utf8.parse(iv),
        });
        let encryptStr = encryptParams.ciphertext.toString(CryptoJS.enc.Base64);
        LogUtil.loggerLine(Log.of("EncodeAndDecode", "decode2", "encryptStr", encryptStr));

        let base64EncryptData = "Np4Ua9YwOLRwkx0jnrjLRw==";
        let encryptData = CryptoJS.enc.Base64.parse(encryptStr);
        // LogUtil.loggerLine(Log.of("EncodeAndDecode", "decode2", "encryptData", encryptData));
        let encryptedCP = CryptoJS.lib.CipherParams.create({
            ciphertext: encryptData,
        });

        let decryptParams = CryptoJS.AES.decrypt(encryptedCP, CryptoJS.enc.Utf8.parse(key), {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            iv: CryptoJS.enc.Utf8.parse(iv),
        });
        // let decryptStr = CryptoJS.enc.Utf8.stringify(decryptParams).toString();
        let decryptStr = decryptParams.toString(CryptoJS.enc.Utf8);
        LogUtil.loggerLine(Log.of("EncodeAndDecode", "decode2", "decryptStr", decryptStr));

        // let aes256 = require('aes256');
        // let encryptStr = aes256.encrypt(key, content);
        // LogUtil.loggerLine(Log.of("EncodeAndDecode", "decode2", "encryptStr", encryptStr));

        // let encryptData = "XjmKZuuS10PX8RDXSsyUtA==";
        // let decryptStr = aes256.decrypt(key, encryptStr);
        // LogUtil.loggerLine(Log.of("EncodeAndDecode", "decode2", "decryptStr", decryptStr));

    }

    private decode1(): void {
        let privateKeyEncryptStr = "JksyEIFGoemYCkdQhlJXkTchMeGLoKgkl+agMrTOOaE1uVfngBKIYH91t7OMwN42lXy6SzmySP4eYQSc7DdGHgLhP7HT6qt8YFRZNZzL0PdB5unnCpnFo14x7KojitFs8OiCGMLjRY1R9GVgXydud5pmTEy3MeyB2TLSbz/DKpxT0AkQLZhT/biJbQAwUKxbYKim+oMaWY8jgG8ChsPydNsV1gz8Y/SuUbsxy08utFN9wkZD80xn5VEr19646ovLHPY+lem306YXJnwCZVpVqgn+W5oXfY1WY8k2VxUzIXavnJvYtjcMRz8PtvTJRxXjtpVw3Hzl1dXI1yxMk0KQuA==";
        let publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArCS+Mc95KdU5XvsL5Z5sYo78CmRgZ2D65dMHaZw8KjaJtM2SXiswz3f6ykR+dgSRONQifQjfdLdiaAiczJqchRLb2y5FrlQJ/Rxe+Z3Jn74vuUiKn5XeMy4nqsdNaaLQavakfQBMYmAPcxZfnjNIyyfyMGIFmW+MMgs/bGXLO6UrwJvaaXC59x5+2I/5KL0TrL9kNWBh0Xfv61U64fg0cAqHZF2HzckmxSF8H3AEAheqbvzuqzkBW26dP+2x5MOKQmfbkf8VlX+lcqPdvIFZOYQQ+olHsGIUzduuk8Xt6UqfMwDo4PTnv9SVQQdFlZ/hLOtncTMLoeqPM8H2rJ3ihwIDAQAB";

        const rsa = new NodeRSA(publicKey, "public");
        let publicKeyDecryptStr = rsa.decryptPublic(privateKeyEncryptStr, "utf8");
        LogUtil.logger(Log.of("EncodeAndDecode", "decode1", "publicKeyDecryptStr", publicKeyDecryptStr));
    }

    private async decode(): Promise<void> {
        let privateKeyEncryptStr = "JksyEIFGoemYCkdQhlJXkTchMeGLoKgkl+agMrTOOaE1uVfngBKIYH91t7OMwN42lXy6SzmySP4eYQSc7DdGHgLhP7HT6qt8YFRZNZzL0PdB5unnCpnFo14x7KojitFs8OiCGMLjRY1R9GVgXydud5pmTEy3MeyB2TLSbz/DKpxT0AkQLZhT/biJbQAwUKxbYKim+oMaWY8jgG8ChsPydNsV1gz8Y/SuUbsxy08utFN9wkZD80xn5VEr19646ovLHPY+lem306YXJnwCZVpVqgn+W5oXfY1WY8k2VxUzIXavnJvYtjcMRz8PtvTJRxXjtpVw3Hzl1dXI1yxMk0KQuA==";
        let publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArCS+Mc95KdU5XvsL5Z5sYo78CmRgZ2D65dMHaZw8KjaJtM2SXiswz3f6ykR+dgSRONQifQjfdLdiaAiczJqchRLb2y5FrlQJ/Rxe+Z3Jn74vuUiKn5XeMy4nqsdNaaLQavakfQBMYmAPcxZfnjNIyyfyMGIFmW+MMgs/bGXLO6UrwJvaaXC59x5+2I/5KL0TrL9kNWBh0Xfv61U64fg0cAqHZF2HzckmxSF8H3AEAheqbvzuqzkBW26dP+2x5MOKQmfbkf8VlX+lcqPdvIFZOYQQ+olHsGIUzduuk8Xt6UqfMwDo4PTnv9SVQQdFlZ/hLOtncTMLoeqPM8H2rJ3ihwIDAQAB";
        let privateKeyEncryptStrArray = Uint8Array.from(Array.from(privateKeyEncryptStr).map(letter => letter.charCodeAt(0)))
        let publicKeyDecryptStr = await rsa.encrypt(privateKeyEncryptStrArray, {
            kty: "RSA",
            e: <any>Buffer.from(publicKey)
        }, 'SHA-256');

        // const encryptTool = new JSEncrypt();
        // encryptTool.setPublicKey(publicKey);
        // let publicKeyDecryptStr = encryptTool.decrypt(privateKeyEncryptStr);

        LogUtil.logger(Log.of("EncodeAndDecode", "decode", "publicKeyDecryptStr", publicKeyDecryptStr));
    }

    private decode3(): void {
        let content = "Hello world!";
        let base64Iv = "V1lhZjI2b3c3WTlmWjFpeg==";
        let base64Key = "Ep0U1U2zm7vfA1UZ03m2+E1pU/ugLEZ33tO1ui7rT2s=";
        let base64Content = "FbcG8w9oKVTfvxdt6j74vA==";

        let encryptStr = this.encrypt(content, base64Key, base64Iv);
        LogUtil.loggerLine(Log.of("EncodeAndDecode", "decode3", "encryptStr", encryptStr));
        let decryptStr = this.decrypt(base64Content, base64Key, base64Iv);
        LogUtil.loggerLine(Log.of("EncodeAndDecode", "decode3", "decryptStr", decryptStr));
    }

    private encrypt(plainText: string, keyBase64: string, ivBase64: string): string {
        const key = Buffer.from(keyBase64, 'base64');
        const iv = Buffer.from(ivBase64, 'base64');

        let crypto = require('crypto');
        const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
        let encrypted = cipher.update(plainText, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }

    private decrypt(messageBase64: string, keyBase64: string, ivBase64: string) {
        const key = Buffer.from(keyBase64, 'base64');
        const iv = Buffer.from(ivBase64, 'base64');

        let crypto = require('crypto');
        const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
        let decrypted = decipher.update(messageBase64, 'base64');
        decrypted += decipher.final();
        return decrypted;
    }

    public static run(): void {
        let encodeAndDecode = new EncodeAndDecode();
        encodeAndDecode.apply();
    }

}