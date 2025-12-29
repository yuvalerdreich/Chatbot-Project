import React from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useChat } from '../hooks/useChat';

const ChatInterface = ({ userId }) => {
    const { messages, sendMessage, isLoading } = useChat(userId);

    return (
        <div className="chat-interface">
            <MessageList messages={messages} />
            {isLoading && <span>Bot is typing...</span>}
            <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
    );
};

export default ChatInterface;