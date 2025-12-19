import React from 'react';
import RAGChatbot from './RAGChatbot';

const LayoutWrapper = ({ children }) => {
  return (
    <>
      {children}
      <RAGChatbot />
    </>
  );
};

export default LayoutWrapper;