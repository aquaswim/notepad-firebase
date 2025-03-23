import Container from "./Container.tsx";
import {getCurrentDocID} from "./utils.ts";
import Home from "./Home.tsx";
import TextBox from "./TextBox.tsx";

function App() {
    const docId = getCurrentDocID();
    return (
        <Container fluid>
            {!docId ? <Home/> : <TextBox documentID={docId}/>}
        </Container>
    )
}

export default App
