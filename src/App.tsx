import Container from "@/components/Container.tsx";
import {getCurrentDocID} from "@/lib/routing.ts";
import HomePage from "@/features/home/HomePage.tsx";
import NotePage from "@/features/note/NotePage.tsx";

function App() {
    const docId = getCurrentDocID();
    return (
        <Container fluid>
            {!docId ? <HomePage/> : <NotePage key={docId} documentID={docId}/>}
        </Container>
    )
}

export default App
