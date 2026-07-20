const PBKDF2_ITERATIONS = 600_000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export interface EncryptedNoteContent {
    encryptedText: string;
    iv: string;
    salt: string;
}

function toBase64(bytes: Uint8Array): string {
    let binary = "";
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });

    return window.btoa(binary);
}

function fromBase64(value: string): Uint8Array {
    const binary = window.atob(value);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

export function createSalt(): string {
    return toBase64(crypto.getRandomValues(new Uint8Array(SALT_LENGTH)));
}

async function deriveKey(password: string, salt: string): Promise<CryptoKey> {
    const passwordMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"],
    );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: toArrayBuffer(fromBase64(salt)),
            iterations: PBKDF2_ITERATIONS,
            hash: "SHA-256",
        },
        passwordMaterial,
        {name: "AES-GCM", length: 256},
        false,
        ["encrypt", "decrypt"],
    );
}

export async function createEncryptionKey(password: string, salt = createSalt()): Promise<{key: CryptoKey; salt: string}> {
    return {key: await deriveKey(password, salt), salt};
}

export async function encryptText(text: string, key: CryptoKey, salt: string): Promise<EncryptedNoteContent> {
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const encrypted = await crypto.subtle.encrypt(
        {name: "AES-GCM", iv: toArrayBuffer(iv)},
        key,
        encoder.encode(text),
    );

    return {
        encryptedText: toBase64(new Uint8Array(encrypted)),
        iv: toBase64(iv),
        salt,
    };
}

export async function decryptText(content: EncryptedNoteContent, password: string): Promise<{key: CryptoKey; text: string}> {
    const key = await deriveKey(password, content.salt);
    const decrypted = await crypto.subtle.decrypt(
        {name: "AES-GCM", iv: toArrayBuffer(fromBase64(content.iv))},
        key,
        toArrayBuffer(fromBase64(content.encryptedText)),
    );

    return {key, text: decoder.decode(decrypted)};
}