import React from 'react';
import './App.css';

function App() {
    return (
        <div className="section">
            <div className="container">
                <div className="card mt-4">
                    <header className="card-header">
                        <p className="card-header-title">
                            Firenote 🔥
                        </p>
                    </header>
                    <div className="card-content">
                        <div className="control">
                            <textarea className="textarea" rows={10}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
