import React from 'react';
const MessageList = ({ messages }) => (
    <div className="message-list">
        {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
                <p>{msg.content}</p>
            </div>
        ))}
    </div>
);

export default MessageList;