import '@testing-library/jest-dom'; // Critical: Adds the matchers to Jest
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('Chatbot E2E Flow', () => {
    test('renders welcome message and allows typing', async () => {
        render(<App />);
        
        /**
         * Wait for the initial recruitment greeting to appear.
         * findByText is asynchronous and handles the component mounting.
         */
        const welcome = await screen.findByText(/Platform Engineer position/i);
        expect(welcome).toBeInTheDocument();

        // Simulate user interaction
        const input = screen.getByPlaceholderText(/Type your message/i);
        fireEvent.change(input, { target: { value: 'Yes, I am ready.' } });
        
        const sendBtn = screen.getByRole('button', { name: /send/i });
        fireEvent.click(sendBtn);

        // Assert that the input was cleared after sending
        expect(input.value).toBe('');
    });
});