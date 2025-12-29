import React from 'react';
import ChatInterface from './components/ChatInterface';

function App() {
    const tempUserId = "candidate_123";

    return (
        <div className="App">
            <header>
                <h1>KPMG Screening Chatbot</h1>
            </header>
            <main>
                <ChatInterface userId={tempUserId} />
            </main>
        </div>
    );
}

export default App;