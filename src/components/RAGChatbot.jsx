import React, { useState, useEffect, useRef } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

import './RAGChatbot.css';

const RAGChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [colorMode, setColorMode] = useState('light'); // Default to light mode

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { siteConfig } = useDocusaurusContext();

  // Get color mode from document or default to light
  useEffect(() => {
    if (ExecutionEnvironment.canUseDOM) {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const htmlElement = document.documentElement;
      const currentColorMode = htmlElement.getAttribute('data-theme') ||
                               (darkModeMediaQuery.matches ? 'dark' : 'light');
      setColorMode(currentColorMode);

      // Listen for theme changes
      const handleThemeChange = () => {
        const newColorMode = htmlElement.getAttribute('data-theme') ||
                            (darkModeMediaQuery.matches ? 'dark' : 'light');
        setColorMode(newColorMode);
      };

      htmlElement.addEventListener('theme-change', () => {
        const newColorMode = htmlElement.getAttribute('data-theme') ||
                            (darkModeMediaQuery.matches ? 'dark' : 'light');
        setColorMode(newColorMode);
      });

      return () => {
        htmlElement.removeEventListener('theme-change', handleThemeChange);
      };
    }
  }, []);

  // Get the current page URL and title
  const currentPage = ExecutionEnvironment.canUseDOM
    ? { url: window.location.href, title: document.title }
    : { url: '', title: '' };

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to get selected text from the page
  useEffect(() => {
    const handleSelection = () => {
      if (ExecutionEnvironment.canUseDOM) {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
          setSelectedText(selectedText);
        }
      }
    };

    if (ExecutionEnvironment.canUseDOM) {
      document.addEventListener('mouseup', handleSelection);
      return () => {
        document.removeEventListener('mouseup', handleSelection);
      };
    }
  }, []);

  // Function to send a message to the backend
  const sendMessage = async (messageText, context = null) => {
    if (!messageText.trim() || isLoading) return;

    setIsLoading(true);

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Prepare the request payload
      const requestBody = {
        query: messageText,
        context: context || currentPage.title, // Use context if provided, otherwise use page title
        userId: null // In a real implementation, this would be the authenticated user ID
      };

      // Call the backend API
      const response = await fetch('/api/chat/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Add bot response to chat
      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'bot',
        sources: data.sources,
        confidence: data.confidence,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        sender: 'bot',
        isError: true,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInputValue('');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
    }
  };

  // Handle asking about selected text
  const handleAskAboutSelection = () => {
    if (selectedText) {
      const contextMessage = {
        id: Date.now(),
        text: `About the selected text: "${selectedText}"`,
        sender: 'context',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, contextMessage]);

      // Now send the query with the selected text as context
      sendMessage(`Can you explain this: "${selectedText}"?`, selectedText);
    }
  };

  // Toggle chatbot open/close
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className={`rag-chatbot ${isOpen ? 'rag-chatbot--open' : ''} rag-chatbot--${colorMode}`}>
      {/* Chatbot toggle button */}
      {!isOpen && (
        <button
          className="rag-chatbot__toggle"
          onClick={toggleChatbot}
          aria-label="Open chatbot"
          title="Ask about the content"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Chatbot container */}
      {isOpen && (
        <div className="rag-chatbot__container">
          <div className="rag-chatbot__header">
            <h3>Content Assistant</h3>
            <button
              className="rag-chatbot__close"
              onClick={toggleChatbot}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          <div className="rag-chatbot__messages" ref={messagesEndRef}>
            {messages.length === 0 ? (
              <div className="rag-chatbot__welcome">
                <p>Hello! I'm your content assistant for the Physical AI & Humanoid Robotics Book.</p>
                <p>Ask me questions about the content, or select text on the page and I'll explain it.</p>
                {selectedText && (
                  <button
                    className="rag-chatbot__selection-button"
                    onClick={handleAskAboutSelection}
                  >
                    Explain selected text: "{selectedText.substring(0, 30)}{selectedText.length > 30 ? '...' : ''}"
                  </button>
                )}
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`rag-chatbot__message rag-chatbot__message--${message.sender}`}
                >
                  {message.sender === 'bot' && (
                    <div className="rag-chatbot__avatar">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 8v8m-4-4h8" />
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="rag-chatbot__content">
                    <p>{message.text}</p>
                    {message.sources && message.sender === 'bot' && !message.isError && (
                      <div className="rag-chatbot__sources">
                        <small>Sources: {message.sources.slice(0, 3).join(', ')}</small>
                      </div>
                    )}
                    {message.isError && (
                      <div className="rag-chatbot__error">
                        <small>The backend API may not be running. Please check your setup.</small>
                      </div>
                    )}
                  </div>
                  {message.sender === 'user' && (
                    <div className="rag-chatbot__avatar rag-chatbot__avatar--user">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {selectedText && messages.length > 0 && (
            <div className="rag-chatbot__selection-prompt">
              <button
                className="rag-chatbot__selection-button"
                onClick={handleAskAboutSelection}
              >
                Explain selected text: "{selectedText.substring(0, 40)}{selectedText.length > 40 ? '...' : ''}"
              </button>
            </div>
          )}

          <form className="rag-chatbot__input-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="rag-chatbot__input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about the content..."
              disabled={isLoading}
            />
            <button
              type="submit"
              className="rag-chatbot__send-button"
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send message"
            >
              {isLoading ? (
                <svg
                  className="rag-chatbot__loading-spinner"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RAGChatbot;