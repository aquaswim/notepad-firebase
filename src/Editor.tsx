import {useEffect} from 'react';
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import './Editor.css';
import {PlainTextPlugin} from "@lexical/react/LexicalPlainTextPlugin";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$generateNodesFromDOM, $generateHtmlFromNodes} from '@lexical/html'
import {getCurrentDocID} from "./utils.ts";
import {get, onValue, ref, update} from "firebase/database";
import {database} from "./firebase.ts";
import {$getRoot, $insertNodes} from "lexical";
import {useDebouncedCallback} from "use-debounce";

const theme = {
    // Theme styling goes here
    //...
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: unknown) {
    console.error(error);
}

function Editor() {
    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError,
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-container">
                <div className="editor-inner">
                    <PlainTextPlugin
                        contentEditable={
                            <ContentEditable
                                className="editor-input"
                                aria-placeholder={'Enter some text...'}
                                placeholder={<div className="editor-placeholder">Enter some text...</div>}
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin/>
                    <AutoFocusPlugin/>
                    <Firebase/>
                </div>
            </div>
        </LexicalComposer>
    );
}

export default Editor;

function Firebase() {
    const [editor] = useLexicalComposerContext()
    const docId = getCurrentDocID();
    const debouncedSave = useDebouncedCallback((value: string) => {
        return update(ref(database, docId), {text: value})
    }, 2000, {maxWait: 5000})

    useEffect(() => {
        let unsub: ReturnType<typeof onValue> | undefined;
        let firstLoad = true;

        (async () => {
            editor.setEditable(false);
            const docRef = ref(database, docId)
            const docSnap = await get(docRef)
            if (docSnap.exists()) {
                editor.update(() => {
                    const parser = new DOMParser();
                    const dom = parser.parseFromString(docSnap.val().text, "text/html")
                    const nodes = $generateNodesFromDOM(editor, dom);

                    // Select the root
                    $getRoot().select();
                    $getRoot().clear();

                    // Insert them at a selection.
                    $insertNodes(nodes);
                })
            }
        })()
            .then(() => {
                firstLoad = false;
                editor.setEditable(true);
                editor.focus();
            })
            .catch((err) => {
                alert("Error initializing editor");
                console.error(err);
            });

        const onUpdateCleanup = editor.registerUpdateListener(() => {
            if (firstLoad) {
                return;
            }
            editor.update(() => {
                debouncedSave($generateHtmlFromNodes(editor))
            })
        });
        return () => {
            onUpdateCleanup()
            debouncedSave.flush();
            if (unsub) {
                unsub()
            }
        }
    }, [debouncedSave, docId, editor]);

    return null
}