// import {$getRoot, $getSelection} from 'lexical';
// import {useEffect} from 'react';

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';

import './editor.css';
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import {EditorState} from "lexical";

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
    const onChange = (editorState: EditorState) => {
        console.log(editorState.toJSON());
        // console.log(JSON.stringify(editorState.toJSON(), null, 2))
    }

    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError,
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-container">
                <div className="editor-inner">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className="editor-input"
                                aria-placeholder={'Enter some text...'}
                                placeholder={<div className="editor-placeholder">Enter some text...</div>}
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <OnChangePlugin onChange={onChange}/>
                </div>
            </div>
        </LexicalComposer>
    );
}

export default Editor;