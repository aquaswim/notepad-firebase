import Container from "./Container.tsx";
import {getCurrentDocID} from "./utils.ts";
import Home from "./Home.tsx";
import Editor from "./Editor.tsx";

function App() {
    const docId = getCurrentDocID();
    return (
        <Container fluid>
            {!docId ? <Home/> : <Editor/>}
        </Container>
    )
}

export default App
