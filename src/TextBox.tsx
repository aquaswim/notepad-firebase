import {get, ref, onValue, update} from "firebase/database";
import "./TextBox.css"
import {useEffect, useState} from "react";
import {database} from "./firebase.ts";
import {useDebouncedCallback} from "use-debounce";

interface TextBoxProps {
    documentID: string;
}

function TextBox(props: TextBoxProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [text, setText] = useState("")
    const debouncedSave = useDebouncedCallback((value: string) => {
        return update(ref(database, props.documentID), {text: value})
    }, 1000, {maxWait: 5000})

    useEffect(() => {
        let isActive = true;
        const docRef = ref(database, props.documentID);
        const unsubscribe = onValue(docRef, (snapshot) => {
            if (!isActive) {
                return;
            }

            setText(snapshot.val()?.text ?? "");
            setIsLoading(false);
        });

        get(docRef).catch(() => {
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