import {get, onValue, ref, set} from "firebase/database";
import "./TextBox.css"
import {SubmitEvent, useEffect, useRef, useState} from "react";
import {database} from "./firebase.ts";
import {useDebouncedCallback} from "use-debounce";
import {createEncryptionKey, decryptText, encryptText, EncryptedNoteContent} from "./crypto.ts";

interface TextBoxProps {
    documentID: string;
}

interface SecretNote extends EncryptedNoteContent {
    secret: true;
}

function isSecretNote(value: unknown): value is SecretNote {
    if (!value || typeof value !== "object") {
        return false;
    }

    const note = value as Record<string, unknown>;
    return note.secret === true
        && typeof note.encryptedText === "string"
        && typeof note.salt === "string"
        && typeof note.iv === "string";
}

function TextBox(props: TextBoxProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [text, setText] = useState("")
    const [secretNote, setSecretNote] = useState<SecretNote | null>(null);
    const [mode, setMode] = useState<"editor" | "unlock" | "protect">("editor");
    const [error, setError] = useState("");
    const encryptionKey = useRef<CryptoKey | null>(null);

    const debouncedSave = useDebouncedCallback(async (value: string) => {
        const currentSecret = secretNote;
        if (currentSecret && encryptionKey.current) {
            const encrypted = await encryptText(value, encryptionKey.current, currentSecret.salt);
            await set(ref(database, props.documentID), {secret: true, ...encrypted});
            return;
        }

        await set(ref(database, props.documentID), {text: value});
    }, 1000, {maxWait: 5000})

    useEffect(() => {
        let isActive = true;
        const docRef = ref(database, props.documentID);
        encryptionKey.current = null;
        const unsubscribe = onValue(docRef, (snapshot) => {
            if (!isActive) {
                return;
            }

            const value = snapshot.val();
            if (isSecretNote(value)) {
                setSecretNote(value);
                if (!encryptionKey.current) {
                    setMode("unlock");
                    setText("");
                }
            } else {
                setSecretNote(null);
                setMode("editor");
                setText(value?.text ?? "");
            }
            setIsLoading(false);
        });

        get(docRef).catch((error: unknown) => {
            console.error("Unable to load note from Firebase:", error);
            if (isActive) {
                setIsLoading(false);
            }
        });

        return () => {
            isActive = false;
            unsubscribe();
            debouncedSave.flush();
        }
    }, [debouncedSave, props.documentID]);
    const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
        void debouncedSave(e.target.value);
    }

    const unlockNote = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formElement = event.currentTarget;
        const form = new FormData(formElement);
        const password = String(form.get("password") ?? "");
        if (!secretNote || !password) return;

        setError("");
        try {
            const unlocked = await decryptText(secretNote, password);
            encryptionKey.current = unlocked.key;
            setText(unlocked.text);
            setMode("editor");
            formElement.reset();
        } catch (error: unknown) {
            console.error("Unable to unlock protected note:", error);
            setError("Incorrect password or corrupted protected note.");
        }
    };

    const protectNote = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formElement = event.currentTarget;
        const form = new FormData(formElement);
        const password = String(form.get("password") ?? "");
        const confirmation = String(form.get("confirmation") ?? "");
        if (!password) {
            setError("Enter a password to protect this note.");
            return;
        }
        if (password !== confirmation) {
            setError("Passwords do not match.");
            return;
        }

        setError("");
        try {
            const {key, salt} = await createEncryptionKey(password);
            const encrypted = await encryptText(text, key, salt);
            await set(ref(database, props.documentID), {secret: true, ...encrypted});
            encryptionKey.current = key;
            setSecretNote({secret: true, ...encrypted});
            setMode("editor");
            formElement.reset();
        } catch (error: unknown) {
            console.error("Unable to protect note:", error);
            setError("Unable to protect this note. Please try again.");
        }
    };

    const placeHolder = isLoading ? "Loading..." : "Type your note here..."
    if (mode === "unlock") {
        return <section className="note-password-panel">
            <h1>Protected note</h1>
            <p>Enter its password to unlock this note.</p>
            <form onSubmit={unlockNote}>
                <label htmlFor="unlock-password">Password</label>
                <input id="unlock-password" name="password" type="password" autoComplete="current-password" required autoFocus />
                <button type="submit">Unlock note</button>
            </form>
            {error && <p className="note-error" role="alert">{error}</p>}
        </section>;
    }

    if (mode === "protect") {
        return <section className="note-password-panel">
            <h1>Protect note</h1>
            <p>Your note will be encrypted in Firebase. Lost passwords cannot be recovered.</p>
            <form onSubmit={protectNote}>
                <label htmlFor="new-password">Password</label>
                <input id="new-password" name="password" type="password" autoComplete="new-password" required autoFocus />
                <label htmlFor="confirm-password">Confirm password</label>
                <input id="confirm-password" name="confirmation" type="password" autoComplete="new-password" required />
                <button type="submit">Encrypt and protect note</button>
                <button type="button" className="secondary" onClick={() => { setError(""); setMode("editor"); }}>Cancel</button>
            </form>
            {error && <p className="note-error" role="alert">{error}</p>}
        </section>;
    }

    return (
        <>
            <div className="note-toolbar">
                {secretNote ? <span>🔒 Protected note</span> : <button type="button" className="secondary" disabled={isLoading} onClick={() => setMode("protect")}>Protect with password</button>}
                {error && <span className="note-error" role="alert">{error}</span>}
            </div>
            <textarea
                id="simple-text-box"
                disabled={isLoading}
                placeholder={placeHolder}
                value={text}
                onChange={onTextChange}
            />
        </>
    );
}

export default TextBox;