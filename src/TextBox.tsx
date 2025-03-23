import {get, ref, onValue, update} from "firebase/database";
import "./TextBox.css"
import {useEffect, useState} from "react";
import {database} from "./firebase.ts";
import {useDebouncedCallback} from "use-debounce";

interface TextBoxProps {
    documentID: string;
}

function TextBox(props: TextBoxProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [text, setText] = useState("")
    const debouncedSave = useDebouncedCallback((value: string) => {
        return update(ref(database, props.documentID), {text: value})
    }, 1000, {maxWait: 5000})

    useEffect(() => {
        let unsub: ReturnType<typeof onValue> | undefined;
        setIsLoading(true);
        (async () => {
            const docRef = ref(database, props.documentID)
            const docSnap = await get(docRef);
            setText(docSnap.val().text)
            unsub = onValue(docRef, value => setText(value.val().text))
        })()
            .finally(() => setIsLoading(false))
        return () => {
            if (unsub) {
                unsub();
                debouncedSave.flush();
            }
        }
    }, [debouncedSave, props.documentID]);
    const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
        // debounce the save event
        debouncedSave(e.target.value)
    }

    const placeHolder = isLoading ? "Loading..." : "Type your note here..."
    return (
        <textarea
            id="simple-text-box"
            disabled={isLoading}
            placeholder={placeHolder}
            value={text}
            onChange={e => onTextChange(e)}
        />
    );
}

export default TextBox;