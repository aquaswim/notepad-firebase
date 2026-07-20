import {FormEvent, useState} from "react";

function Home() {
    const [documentId, setDocumentId] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedDocumentId = documentId.trim();
        if (trimmedDocumentId) {
            window.location.assign(`/${encodeURIComponent(trimmedDocumentId)}`);
        }
    };

    return (
        <>
            <h1>Welcome to Firenote!</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="document-id">Document ID</label>
                <input
                    id="document-id"
                    name="documentId"
                    value={documentId}
                    onChange={(event) => setDocumentId(event.currentTarget.value)}
                    placeholder="Enter a document ID"
                    required
                />
                <button type="submit">Open document</button>
            </form>
        </>
    );
}

export default Home;