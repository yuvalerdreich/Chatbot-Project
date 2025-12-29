import React, { useState } from 'react';

const ChatInput = ({ onSend, disabled }) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            onSend(input);
            setInput('');
        }
    };

    return (
        <div className="chat-input">
            <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                disabled={disabled}
                placeholder="Type your message..."
            />
            <button onClick={handleSend} disabled={disabled}>Send</button>
        </div>
    );
};

export default ChatInput;