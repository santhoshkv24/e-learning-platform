import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
  
    const userMessage = { text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
  
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer API_KEY`
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [{ role: 'user', content: inputText }]
        })
      });
  
      const data = await response.json();
  
      if (data && data.choices && data.choices[0]) {
        const aiMessage = { text: data.choices[0].message.content, sender: 'ai' };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('No valid response from API');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { text: 'Failed to get AI response', sender: 'ai' };
      setMessages(prev => [...prev, errorMessage]);
    }
  };
  
  
  
  return (
    <div className="fixed bottom-4 right-4">
      {!isOpen && (
        <Button 
          onClick={toggleChat}
          className="rounded-full h-15 shadow-lg"
        >
          Vidh AI
        </Button>
      )}
      {isOpen && (
        <div className="w-96 bg-card border rounded-lg shadow-lg">
          <div className="p-4">
        {/* Chat Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">Vidh AI Assistant</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleChat}
          >
            X
          </Button>
        </div>

        {/* Chat Messages */}
        <div className="h-64 overflow-y-auto space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg ${
                msg.sender === 'user' 
                  ? 'bg-primary text-primary-foreground ml-auto w-3/4' 
                  : 'bg-muted text-foreground mr-auto w-3/4'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="mt-4 flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;
